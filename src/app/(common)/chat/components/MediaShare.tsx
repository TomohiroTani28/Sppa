// src/app/(common)/chat/components/MediaShare.tsx
"use client";

import { Button } from "@/components/ui/Button";
import supabaseClient from "@/lib/supabase-client";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";

interface MediaShareProps {
  onUploadComplete: (url: string) => void;
  onClose: () => void;
}

const MediaShare: React.FC<MediaShareProps> = ({
  onUploadComplete,
  onClose,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // 許可するファイル形式のチェック
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/webm", // スマートフォン対応のために追加
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(t("サポートされていないファイル形式です。JPG、PNG、GIF、MP4、またはWebMを使用してください。"));
      return;
    }

    // ファイルサイズのチェック（最大50MB）
    if (file.size > 50 * 1024 * 1024) {
      setError(t("ファイルが大きすぎます。最大サイズは50MBです。"));
      return;
    }

    setSelectedFile(file);

    // プレビュー生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // 一意のファイル名を生成
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Supabase Storageにアップロード
      const { error } = await supabaseClient.storage
        .from("media")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // 公開URLを取得
      const { data: urlData } = supabaseClient.storage
        .from("media")
        .getPublicUrl(filePath);

      onUploadComplete(urlData.publicUrl);
    } catch (err: any) {
      console.error("アップロードエラー:", err);
      setError(t("ファイルのアップロードに失敗しました。もう一度お試しください。"));
    } finally {
      setIsUploading(false);
    }
  };

  // アップロード進捗のシミュレーション（フォールバック）
  const simulateProgress = useCallback(() => {
    if (isUploading && uploadProgress < 90) {
      setUploadProgress((prev) => prev + 10);
      setTimeout(simulateProgress, 300);
    }
  }, [isUploading, uploadProgress]);

  // アップロード開始時に進捗シミュレーションを開始
  React.useEffect(() => {
    if (isUploading && uploadProgress === 0) {
      simulateProgress();
    }
  }, [isUploading, simulateProgress, uploadProgress]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{t("メディアを共有")}</h3>

      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label
          htmlFor="file-upload"
          className="block w-full px-4 py-2 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              {selectedFile
                ? selectedFile.name
                : t("写真またはビデオを選択するにはクリック")}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {t("JPG、PNG、GIF、MP4、またはWebM。最大50MB。")}
            </span>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime,video/webm"
            className="sr-only"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>

      {previewUrl && (
        <div className="mb-3 relative">
          {selectedFile?.type.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="プレビュー"
              className="max-h-40 max-w-full mx-auto rounded border border-gray-200"
            />
          ) : (
            <div className="h-40 bg-gray-800 flex items-center justify-center rounded border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="mb-3">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {uploadProgress}% {t("アップロード中...")}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} variant="outline" disabled={isUploading}>
          {t("キャンセル")}
        </Button>
        <Button
          onClick={uploadFile}
          disabled={!selectedFile || isUploading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isUploading ? t("アップロード中...") : t("送信")}
        </Button>
      </div>
    </div>
  );
};

export default MediaShare;