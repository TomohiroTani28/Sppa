// src/app/therapist/profile/components/MediaUploadForm.tsx
import { useState } from "react";
import supabase from "@/app/lib/supabase-client"; // Import default supabase client
import { Button } from "@/app/components/ui/Button"; // Direct import from Button.tsx
import { Input } from "@/app/components/ui/Input"; // Direct import from Input.tsx

const MediaUploadForm = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMediaType(e.target.value as "image" | "video");
  };

  const handleSubmit = async () => {
    if (!mediaFile) return;

    try {
      const fileExt = mediaFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${mediaType}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("media-bucket") // Replace with your actual bucket name
        .upload(filePath, mediaFile);

      if (error) {
        throw error;
      }

      console.log("Media uploaded successfully:", data);
    } catch (err) {
      console.error("Error uploading media:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Media</h2>
      <div className="mb-4">
        <Input type="file" onChange={handleFileChange} className="mb-2" />
        <select
          value={mediaType}
          onChange={handleMediaTypeChange}
          className="mb-2"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Upload Media
      </Button>
    </div>
  );
};

export default MediaUploadForm;