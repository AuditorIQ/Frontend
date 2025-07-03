import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { successToast, errorToast } from "@/lib/toast";
import axios from "axios";
import { Trash2, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FileWithStatus = {
  file: File;
  status: "pending" | "processing" | "done" | "error";
};

const specialties = ["Wound Care", "Podiatry"];

export default function UploadModal({ isOpen, onClose }: Props) {
  const [fileList, setFileList] = useState<FileWithStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [providerList, setProviderList] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Wound Care");

  useEffect(() => {
    const fetchProviders = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionStorage.getItem("user_email"),
        }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id: sessionStorage.getItem("user_id") }),
        }
      );
      const providerData = await res.json();
      setProviderList(providerData.result);
    };
    fetchProviders();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithStatus[] = acceptedFiles.map((file) => ({
      file,
      status: "pending",
    }));
    setFileList((prev) => [...prev, ...newFiles]);
    setMessage("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const updateFileStatus = (
    index: number,
    status: FileWithStatus["status"]
  ) => {
    setFileList((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status } : f))
    );
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    setUploading(true);

    for (let i = 0; i < fileList.length; i++) {
      updateFileStatus(i, "processing");

      const formData = new FormData();
      formData.append("files", fileList[i].file);
      formData.append("specialty", selectedSpecialty);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        updateFileStatus(i, "done");
      } catch (err) {
        console.error(err);
        updateFileStatus(i, "error");
      }
    }

    setUploading(false);
    successToast("All files processed.");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFileList((prevList) =>
      prevList.filter((_, idx) => idx !== indexToRemove)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-xl p-6 shadow-lg w-[480px] max-h-[90vh] flex flex-col relative border-2 border-blue-500">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="p-4">
          <div className="flex items-center gap-4">
            <div>
              Rendering Provider
              <select className="border rounded p-2">
                {providerList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName + " " + p.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Specialty
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="border rounded p-2"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`mt-10 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select</p>
        </div>

        {fileList.length > 0 && (
          <div className="mt-4 flex-grow overflow-y-auto bg-white border border-gray-300 rounded-lg p-3">
            <ul className="space-y-2">
              {fileList.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center text-sm border-b pb-1 p-2"
                >
                  <span className="truncate max-w-[60%]">{file.file.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-medium">
                      {file.status === "done" && (
                        <CheckCircle2 className="text-green-600 w-4 h-4" />
                      )}
                      {file.status === "processing" && (
                        <Loader2 className="animate-spin text-blue-500 w-4 h-4" />
                      )}
                      {file.status === "error" && (
                        <XCircle className="text-red-500 w-4 h-4" />
                      )}
                      {file.status === "pending" && (
                        <Clock3 className="text-gray-400 w-4 h-4" />
                      )}
                      <span className="capitalize">{file.status}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!fileList.length || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Auditing...
              </>
            ) : (
              "Audit"
            )}
          </button>
        </div>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
