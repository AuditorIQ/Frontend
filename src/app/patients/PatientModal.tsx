import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthStore } from "@/stores/useAuthStore";
import { successToast } from "@/lib/toast";

type PatientInfo = {
  id: string;
  firstName: string;
  lastName: string;
  dateofBirth: Date | null;
  gender: string;
};

type Errors = {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateofBirth?: string;
  gender?: string;
  general?: string; // Added for server errors
};

type PatientModalProps = {
  isOpen: boolean;
  id?: string;
  firstName?: string;
  lastName?: string;
  dateofBirth?: string;
  gender?: string;
  onClose: () => void;
  onUpdatePatient?: (updatedPatient: any) => void; // Added callback for updating patient
};

const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  id,
  firstName,
  lastName,
  dateofBirth,
  gender,
  onClose,
  onUpdatePatient,
}) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    id: id || "",
    firstName: firstName || "",
    lastName: lastName || "",
    dateofBirth: dateofBirth ? new Date(dateofBirth) : null,
    gender: gender || "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const setFieldError = (field: keyof PatientInfo, message?: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const validate = (values: PatientInfo): Errors => {
    const e: Errors = {};
    if (!values.firstName.trim()) e.firstName = "This field is required.";
    if (!values.lastName.trim()) e.lastName = "This field is required.";
    if (!values.gender.trim()) e.gender = "This field is required.";
    if (!values.dateofBirth) e.dateofBirth = "This field is required.";
    return e;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof PatientInfo;
      value: string;
    };
    if (!value.trim()) {
      setFieldError(name, "This field is required.");
    } else {
      setFieldError(name, undefined);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setPatientInfo((prev) => ({ ...prev, dateofBirth: date }));
    if (!date) {
      setFieldError("dateofBirth", "This field is required.");
    } else {
      setFieldError("dateofBirth", undefined);
    }
  };

  const handleSubmit = async () => {
    const currentErrors = validate(patientInfo);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    try {
      setSubmitting(true);
      const ownerId = useAuthStore.getState().user?.id;

      let res;
      if (id) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/patient/edit-patient`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: patientInfo.id,
              firstName: patientInfo.firstName.trim(),
              lastName: patientInfo.lastName.trim(),
              gender: patientInfo.gender,
              dateofBirth: patientInfo.dateofBirth
                ? patientInfo.dateofBirth.toISOString()
                : null,
              ownerId,
            }),
          }
        );
      } else {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/patient/add-patient`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: patientInfo.firstName.trim(),
              lastName: patientInfo.lastName.trim(),
              gender: patientInfo.gender,
              dateofBirth: patientInfo.dateofBirth
                ? patientInfo.dateofBirth.toISOString()
                : null,
              ownerId,
            }),
          }
        );
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to add patient. Please try again."
        );
      } else {
        const updatedPatient = {
          id: patientInfo.id,
          firstName: patientInfo.firstName.trim(),
          lastName: patientInfo.lastName.trim(),
          gender: patientInfo.gender,
          dateofBirth: patientInfo.dateofBirth
            ? patientInfo.dateofBirth.toISOString()
            : null,
          ownerId,
        };
        if (id) {
          successToast("Patient updated successfully.");
          onUpdatePatient && onUpdatePatient(updatedPatient); // Update patient in parent state
        } else {
          successToast("New Patient is added.");
        }
        setTimeout(() => {
          window.location.href = "/patients";
        }, 1000);
      }
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
      setErrors({ general: err instanceof Error ? err.message : String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey-200 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[480px] max-h-[90vh] flex flex-col relative">
        <div className="bg-gray-800 text-white py-4 px-6 rounded-t-lg">
          <h2 className="text-lg font-bold">Patient Information</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Last Name Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="lastName"
              className="block font-medium text-gray-700 w-32 text-right"
            >
              Last Name
            </label>
            <div className="flex-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={patientInfo.lastName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`border rounded-md px-3 py-2 w-full focus:ring-gray-500 focus:border-gray-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* First Name Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="firstName"
              className="block font-medium text-gray-700 w-32 text-right"
            >
              First Name
            </label>
            <div className="flex-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={patientInfo.firstName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`border rounded-md px-3 py-2 w-full focus:ring-gray-500 focus:border-gray-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
          </div>

          {/* Date of Birth Field */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="dateofBirth"
              className="font-medium text-gray-700 w-32 text-right shrink-0"
            >
              Date of Birth
            </label>
            <div className="flex-1">
              <DatePicker
                id="dateofBirth"
                selected={patientInfo.dateofBirth}
                onChange={(date) => {
                  if (date) {
                    handleDateChange(date); // Update the state with the selected date
                    setFieldError("dateofBirth", ""); // Clear any existing error if the date is valid
                  } else {
                    setFieldError("dateofBirth", "Invalid date format."); // Set an error if the date is invalid
                  }
                }}
                onChangeRaw={(e) => {
                  const input = e?.target as HTMLInputElement; // Cast the event target to HTMLInputElement
                  if (input) {
                    const inputValue = input.value; // Get the value typed in the input field
                    const parsedDate = new Date(inputValue); // Parse the input value into a Date object
                    if (!isNaN(parsedDate.getTime())) {
                      handleDateChange(parsedDate); // Update state if the date is valid
                      setFieldError("dateofBirth", ""); // Clear any error
                    } else {
                      setFieldError("dateofBirth", "Invalid date format."); // Set an error if the date is invalid
                    }
                  }
                }}
                dateFormat="MM/dd/yyyy" // Ensure the date format is consistent
                wrapperClassName="w-full"
                className={`border rounded-md px-3 py-2 w-full focus:ring-gray-500 focus:border-gray-500 ${
                  errors.dateofBirth ? "border-red-500" : "border-gray-300"
                }`}
                onCalendarClose={() => {
                  if (!patientInfo.dateofBirth) {
                    setFieldError("dateofBirth", "This field is required.");
                  }
                }}
              />
              {errors.dateofBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateofBirth}
                </p>
              )}
            </div>
          </div>

          {/* Gender Field */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="gender"
              className="block font-medium text-gray-700 w-32 text-right"
            >
              Gender
            </label>
            <div className="flex-1">
              <select
                id="gender"
                name="gender"
                value={patientInfo.gender}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`border rounded-md px-3 py-2 w-full focus:ring-gray-500 focus:border-gray-500 ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <p className="mt-4 text-sm text-red-600">{errors.general}</p>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              } bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md`}
            >
              {id && submitting ? "Updating..." : ""}
              {!id && submitting ? "Creating..." : ""}
              {id && !submitting ? "Update" : ""}
              {!id && !submitting ? "Add" : ""}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PatientModal;
