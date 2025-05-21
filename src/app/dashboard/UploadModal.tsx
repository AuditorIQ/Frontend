import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { successToast, errorToast } from "@/lib/toast";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadModal({ isOpen, onClose }: Props) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileList((prev) => [...prev, ...acceptedFiles]);
    setMessage("");
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));
  
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          }
        }
      );
      successToast("Completed!");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      setMessage("Upload failed.");
      errorToast("Not Completed.");
    } finally {
      setUploading(false);
    }
  };  

  const handleRemoveFile = (indexToRemove: number) => {
    setFileList((prevList) => prevList.filter((_, idx) => idx !== indexToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl p-6 shadow-lg w-[480px] h-[320px] relative" style={{border: "2px solid blue"}}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-600 hover:text-black">
          ✕
        </button>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "bg-blue-100" : "bg-gray-100"
          }`}
          style={{ marginTop: "25px", border: "1px solid black" }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select</p>
        </div>
        {fileList.length > 0 && (
        <div className="mt-4 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg p-3">
          <ul className="space-y-2">
            {fileList.map((file: File, idx: number) => (
              <li
                key={idx}
                className="flex justify-between items-center text-sm border-b pb-1"
              >
                <span className="truncate max-w-[80%]">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove file"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div> )}
        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!fileList || uploading}
        >
          {uploading ? "Auditing..." : "Audit"}
        </button>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
