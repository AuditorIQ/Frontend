import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { successToast, errorToast } from "@/lib/toast";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadModal({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setMessage("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    console.log(formData);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        window.location.reload();
        setTimeout(() => {
          successToast("Completed!");
        }, 1000);
    } catch (err) {
      setMessage("Upload failed.");
      errorToast("Not Completed.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl p-6 shadow-lg w-[400px] relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-600 hover:text-black">
          ✕
        </button>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "bg-blue-100" : "bg-gray-100"
          }`} style={{marginTop: "25px"}}
        >
          <input {...getInputProps()} />
          {file ? (
            <p>Selected File: {file.name}</p>
          ) : (
            <p>Drag & drop a file here, or click to select</p>
          )}
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
