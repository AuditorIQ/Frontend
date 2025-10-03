"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { successToast, errorToast } from "@/lib/toast";
import axios from "axios";
import { Trash2, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  buildAccessContext,
  buildUploadLimitError,
  isUploadCountAllowed,
} from "@/lib/access";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type FileWithStatus = {
  file: File;
  status: "pending" | "processing" | "done" | "error";
};

const specialties = ["Wound Care", "Podiatry"];
const specialtyMap: Record<string, string> = {
  "Wound Care": "Woundcare",
  Podiatry: "Podiatry",
};

export default function UploadModal({ isOpen, onClose }: Props) {
  const { user, accessToken } = useAuthStore();

  const [fileList, setFileList] = useState<FileWithStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [providerList, setProviderList] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Wound Care");
  const [selectedProviderId, setSelectedProviderId] = useState("");

  const providerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProviderId(e.target.value);
  };

  const fetchProviders = async (myspecialty: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/provider`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Id: user?.id, specialty: myspecialty }),
        }
      );
      const providerData = await res.json();
      setProviderList(providerData.result || []);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    }
  };

  const fetchProfiles = async (email: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    if (!user?.email || !user?.id) return;
    fetchProfiles(user.email);
    fetchProviders("Woundcare");
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileList((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({ file, status: "pending" as const })),
    ]);
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

    const accessCtx = buildAccessContext({
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin,
      subscriptionType: user?.subscriptionType ?? null,
      subscribedAt: user?.subscribedAt ?? null,
      isYearly: user?.isYearly,
    });

    const allowed = isUploadCountAllowed(fileList.length, accessCtx);
    if (!allowed) {
      const msg = buildUploadLimitError(fileList.length, accessCtx);
      if (msg) errorToast(msg);
      setUploading(false);
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      updateFileStatus(i, "processing");

      const formData = new FormData();
      formData.append("files", fileList[i].file);
      formData.append("specialty", selectedSpecialty);
      formData.append("providerId", selectedProviderId);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/openai/generate`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
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
    window.location.href = "/dashboard";
    successToast("All files processed.");
  };

  const handleRemoveFile = (index: number) => {
    setFileList((prevList) => prevList.filter((_, idx) => idx !== index));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center z-50"
      // Close only if the backdrop itself is clicked
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-gray-50 rounded-xl p-6 shadow-lg w-[480px] max-h-[90vh] flex flex-col relative border-2 border-blue-500"
        // Prevent mousedown inside from bubbling to the backdrop handler
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Specialty + Provider */}
        <div className="p-4 flex gap-4">
          <div>
            Specialty
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                fetchProviders(specialtyMap[e.target.value] || e.target.value);
              }}
              className="border rounded p-2"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            Rendering Provider
            <select
              className="border rounded p-2"
              value={selectedProviderId}
              onChange={providerChange}
            >
              <option value="">-- Select a provider --</option>
              {providerList.map((p) => (
                <option key={p.id} value={p.zipCode}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`mt-10 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? "bg-blue-100" : "bg-gray-100"}`}
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select</p>
        </div>

        {/* File list */}
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
                    {file.status === "done" && (
                      <CheckCircle2 className="text-green-600 w-4 h-4" />
                    )}
                    {file.status === "processing" && (
                      <Loader2 className="animate-spin text-blue-500 w-4 h-4" />
                    )}
                    {file.status === "error" && (
                      <XCircle className="text-red-500 w-4 h-4" />
                    )}
                    {file.status === "pending" && <></>}
                    <span className="capitalize text-xs">
                      {file.status !== "pending" ? file.status : ""}
                    </span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload button */}
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!fileList.length || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Processing
              </>
            ) : (
              "Audit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
