import { afterEach, describe, expect, it, vi } from "vitest";

import {
  insertMediaAsset,
  putToR2,
  requestSignedUpload,
} from "./upload-client";

const insert = vi.fn().mockReturnThis();
const select = vi.fn().mockReturnThis();
const single = vi.fn();
vi.mock("@/shared/supabase", () => ({
  getSupabaseClient: () => ({ from: () => ({ insert, select, single }) }),
}));

afterEach(() => vi.restoreAllMocks());

function fetchOk(body: unknown) {
  return vi.fn().mockResolvedValue({ ok: true, json: async () => body });
}

describe("upload-client flow", () => {
  it("signs, then PUTs to R2 forwarding the exact Content-Type", async () => {
    const sign = {
      url: "https://r2/put",
      key: "originals/x.png",
      contentType: "image/png",
    };
    const fetchMock = fetchOk(sign);
    vi.stubGlobal("fetch", fetchMock);

    const res = await requestSignedUpload("tok", "image/png", 10);
    expect(res).toEqual(sign);
    const [, signInit] = fetchMock.mock.calls[0];
    expect(signInit.headers.authorization).toBe("Bearer tok");

    const file = new File(["d"], "x.png", { type: "image/png" });
    await putToR2(res.url, file, res.contentType);
    const [putUrl, putInit] = fetchMock.mock.calls[1];
    expect(putUrl).toBe("https://r2/put");
    expect(putInit.method).toBe("PUT");
    expect(putInit.headers["content-type"]).toBe("image/png");
  });

  it("inserts the asset row after upload", async () => {
    single.mockResolvedValue({ data: { id: "1" }, error: null });
    const input = {
      kind: "image" as const,
      r2_key: "originals/x.png",
      width: 4,
      height: 2,
      alt: "a cat",
      byte_size: 10,
    };
    const asset = await insertMediaAsset(input);
    expect(insert).toHaveBeenCalledWith(input);
    expect(asset).toEqual({ id: "1" });
  });

  it("throws when the sign endpoint rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );
    await expect(requestSignedUpload("tok", "image/png", 1)).rejects.toThrow(
      /403/,
    );
  });
});
