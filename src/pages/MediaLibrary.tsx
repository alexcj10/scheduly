
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getMediaFiles, addMediaFile } from "@/lib/localProfile";
import { useFeedbackToast } from "@/lib/useFeedbackToast";

function isUnsplash(slug: string) {
  return slug.startsWith("photo-");
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<string[]>([]);
  const { success } = useFeedbackToast();
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFiles(getMediaFiles());
  }, []);

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = evt => {
      const url = evt.target?.result as string;
      addMediaFile(url);
      setFiles(getMediaFiles());
      success("Image Added", "Your image has been uploaded and added to the media library.");
    };
    reader.readAsDataURL(file);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <DashboardLayout>
      <div className="py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <span className="inline-flex bg-primary/10 text-primary p-3 rounded-full">
            <Image className="w-6 h-6 text-primary" />
          </span>
          <h2 className="text-2xl font-bold text-primary">Media Library</h2>
          <label className="ml-auto inline-flex items-center gap-2 cursor-pointer text-primary hover:underline text-sm px-3 py-2 rounded hover:bg-primary/10 transition-all">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInput}
              onChange={handleFilePick}
            />
            <Image className="w-4 h-4" />
            Add Image
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {files.map((nameOrUrl, i) => (
            <Card key={nameOrUrl + i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-2 flex flex-col gap-2">
                <img
                  src={
                    isUnsplash(nameOrUrl)
                      ? `https://images.unsplash.com/${nameOrUrl}?auto=format&fit=crop&w=400&q=80`
                      : nameOrUrl
                  }
                  alt="Media"
                  className="w-full h-40 object-cover rounded"
                  loading="lazy"
                />
                <span className="text-xs text-gray-500 break-words">
                  {isUnsplash(nameOrUrl) ? nameOrUrl : "User image"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
        {files.length === 0 && (
          <div className="text-sm text-muted-foreground text-center mt-6">No media yet. Upload images to get started!</div>
        )}
      </div>
    </DashboardLayout>
  );
}
