import { AdminRoute } from "@/features/auth";
import { MediaLibrary, MediaUploader } from "@/features/media";

export const metadata = { title: "Media" };

export default function MediaPage() {
  return (
    <AdminRoute>
      <div className="admin-media">
        <h1 className="admin-media__title">Media</h1>
        <MediaUploader />
        <MediaLibrary />
      </div>
    </AdminRoute>
  );
}
