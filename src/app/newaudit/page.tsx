"use client";
import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SubMenu from "@/components/SubMenu/SubMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/useAuthStore";
import { Upload, PlusCircle } from "lucide-react";
import {
  buildAccessContext,
  buildUploadLimitError,
  isUploadCountAllowed,
} from "@/lib/access";
import { successToast, errorToast } from "@/lib/toast";

import PatientModal from "../patients/PatientModal";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type FileWithStatus = {
  file: File;
  status: "pending" | "processing" | "done" | "error";
};

type UploadFile = {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
};

const specialties = ["Wound Qualification", "Wound Care General"];
const specialtyMap: Record<string, string> = {
  "Wound Qualification": "Woundcare",
  "Wound Care General": "Woundcare",
};

export default function NewAuditPage() {
  const { user, accessToken } = useAuthStore();

  const [patient, setPatient] = useState<any[]>([]);
  const [auditType, setAuditType] = useState("");
  const [provider, setProvider] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [providerList, setProviderList] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    "Wound Qualification"
  );

  const [open, setOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [fileList, setFileList] = useState<FileWithStatus[]>([]);
  const [uploading, setUploading] = useState(false);

  const providerChange = (e: string) => {
    setSelectedProviderId(e);
    setZipCode(providerList.find((item) => item.id === e).zipCode);
  };

  const [selectedPatient, setSelectedPatient] = useState("");

  const patientChange = (e: string) => {
    setSelectedPatient(e);
  };

  const updateFileStatus = (
    index: number,
    status: FileWithStatus["status"]
  ) => {
    setFileList((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status } : f))
    );
  };

  const handleRemoveFile = (index: number) => {
    setFileList((prevList) => prevList.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        status: "pending" as const,
      }));

      setFileList((prev) => [...prev, ...newFiles]);
    }
  };

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
      formData.append("patientId", selectedPatient);

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

  const fetchPatients = async (ownerId: number) => {
    try {
      const prevPatient = patient;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patient/patient/${ownerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const patientsData = await res.json();
      const addedPatients = patientsData.filter(
        (np: any) => !prevPatient.some((pp) => pp.id === np.id)
      );
      setSelectedPatient(addedPatients[0].id);
      setPatient(patientsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.email || !user?.id) return;
    fetchProfiles(user.email);
    fetchProviders("Woundcare");
    fetchPatients(parseInt(user.id, 10));
  }, [user]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex-none h-[10vh]">
          <SubMenu />
        </div>
        <main className="flex-grow p-6 flex justify-center items-start">
          <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl">
            <CardContent className="p-8 space-y-10">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  New Audit
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Upload clinical documentation for compliance review.
                </p>
              </div>

              {/* Audit Details */}
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">
                  Audit Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audit Type */}
                  <div>
                    <Label className="text-gray-700 mb-2">
                      Audit Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedSpecialty}
                      onValueChange={(e) => {
                        setSelectedSpecialty(e);
                        fetchProviders(specialtyMap[e] || e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Provider */}
                  <div>
                    <Label className="text-gray-700 mb-2">
                      Provider <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProviderId}
                      onValueChange={providerChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider..." />
                      </SelectTrigger>
                      <SelectContent>
                        {providerList.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Patient */}
                  <div>
                    <Label className="text-gray-700">
                      Patient <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <div className="w-3/4">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {selectedPatient
                                ? `${patient.find((p) => p.id === selectedPatient)?.lastName}, ${
                                    patient.find(
                                      (p) => p.id === selectedPatient
                                    )?.firstName
                                  }`
                                : "Select patient..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput placeholder="Search patient..." />
                              <CommandList>
                                <CommandEmpty>No patient found.</CommandEmpty>
                                <CommandGroup>
                                  {patient.map((p) => (
                                    <CommandItem
                                      key={p.id}
                                      // ✅ Make the value searchable by name
                                      value={`${p.lastName}, ${p.firstName}`}
                                      onSelect={() => {
                                        setSelectedPatient(p.id);
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedPatient === p.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {p.lastName}, {p.firstName}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="w-1/4">
                        <Button
                          variant="outline"
                          className="flex items-center gap-1 whitespace-nowrap hover:bg-blue-50"
                          style={{ width: "100%" }}
                          onClick={() => setIsModalOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4" /> New
                        </Button>
                      </div>
                      <PatientModal
                        isOpen={isModalOpen}
                        onClose={() => {
                          setIsModalOpen(false);

                          fetchPatients(parseInt(user?.id ?? "0", 10));
                          // Removed forced reload - let the natural state update handle it
                        }}
                      />
                    </div>
                  </div>
                  {/* Zip Code */}
                  <div>
                    <Label className="text-gray-700">Zip Code</Label>
                    <Input
                      placeholder="e.g. 98765"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </section>

              {/* File Upload */}
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">
                  Upload Clinical Documents
                </h2>

                <div
                  {...getRootProps()}
                  className={`mt-10 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition"
                  >
                    <Upload className="w-10 h-10 text-blue-500 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Accepted: PDF, DOCX, TXT, RTF, PNG
                    </p>
                    <input {...getInputProps()} />
                  </label>
                </div>
                {fileList.length > 0 && (
                  <div className="mt-4 flex-grow overflow-y-auto bg-white border border-gray-300 rounded-lg p-3">
                    <ul className="space-y-2">
                      {fileList.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center text-sm border-b pb-1 p-2"
                        >
                          <span className="truncate max-w-[60%]">
                            {file.file.name}
                          </span>
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
              </section>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleUpload}
                  disabled={!fileList.length || uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            </CardContent>
          </Card>
        </main>
      </Card>
    </div>
  );
}
