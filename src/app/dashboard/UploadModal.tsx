import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { successToast, errorToast } from "@/lib/toast";
import axios from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const specialties = ["Wound Care", "Podiatry", "Vascular Surgery"];

export default function UploadModal({ isOpen, onClose }: Props) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Wound Care");

  useEffect(() => {
    // fetch profiles list
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sessionStorage.getItem("user_email"),
      }),
    }).then((res) => res.json());
  }, []);

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
    formData.append("specialty", selectedSpecialty);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      successToast("Completed!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
      errorToast("Upload too many files");
      setTimeout(() => {}, 1000);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFileList((prevList) =>
      prevList.filter((_, idx) => idx !== indexToRemove)
    );
  };

  if (!isOpen) return null;
  //  if (!speciality) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl p-6 shadow-lg w-[480px] max-h-[90vh] flex flex-col relative border-2 border-blue-500">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          style={{ cursor: "pointer" }}
        >
          ✕
        </button>
        <div className="p-4">
          <label className="block mb-2 font-medium">Select Specialty:</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="border rounded p-2 mb-4"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {/* File Drop Zone */}
        <div
          {...getRootProps()}
          className={`mt-10 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select</p>
        </div>

        {/* File List */}
        {fileList.length > 0 && (
          <div className="mt-4 flex-grow overflow-y-auto bg-white border border-gray-300 rounded-lg p-3">
            <ul className="space-y-2">
              {fileList.map((file: File, idx: number) => (
                <li
                  key={idx}
                  className="flex justify-between items-center text-sm border-b pb-1 p-2"
                >
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="text-red-500 hover:text-red-700"
                    style={{ cursor: "pointer" }}
                    title="Remove file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            style={{ cursor: "pointer" }}
            disabled={!fileList || uploading}
          >
            {uploading ? "Auditing..." : "Audit"}
          </button>
        </div>

        {/* Message */}
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
