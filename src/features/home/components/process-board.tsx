import Image from "next/image";

import { publicAssetPath } from "@/shared/assets";

export function ProcessBoard() {
  return (
    <div className="process-board">
      <div className="process-note">
        <span>Product sprint</span>
        <b>Direction → System → Delivery</b>
      </div>
      <Image
        alt="Northstar project direction board"
        height={720}
        src={publicAssetPath("/media/northstar.jpg")}
        width={720}
      />
      <div className="process-card">
        <b>Build responsibly.</b>
        <span>Make the important obvious.</span>
      </div>
    </div>
  );
}
