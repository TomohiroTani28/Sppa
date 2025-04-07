import { useMediaHandling } from '@/hooks/useMediaHandling';
import { useState } from 'react';

export const MediaUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const { media, loading, error, handleMediaUpload } = useMediaHandling();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      await handleMediaUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,video/*"
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}; 