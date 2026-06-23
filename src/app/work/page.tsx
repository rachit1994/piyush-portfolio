import { Suspense } from "react";

import { WorkPage } from "@/features/work";

export default function WorkRoute() {
  return (
    <Suspense>
      <WorkPage />
    </Suspense>
  );
}
