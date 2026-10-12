
import { useState } from "react";

const steps = [
  "Basic Details",
  "Pricing & Availability",
  "Documents",
  "Review",
];

const features = [
  "USB Charging",
  "Large Storage",
  "Digital Meter",
  "Good Mileage",
  "ABS",
  "Bluetooth",
];

const fieldClass =
  "mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelClass = "text-xs font-medium text-gray-600";

function Field({ label, value, onChange, options, placeholder, type = "text" }) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>
        {label} <span className="text-red-400">*</span>
      </span>

      {options ? (
        <select
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={fieldClass}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export default function AddVehicle() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    vehicleType: "Scooter",
    brand: "Honda",
    model: "Activa 5G",
    registrationNumber: "KA 01 AB 1234",
    year: "2024",
    color: "Pearl White",
    fuelType: "Petrol",
    engineCC: "110",
    owners: "1",
    rcStatus: "Active",
    price: "",
    deposit: "",
    availableFrom: "",
    availableTo: "",
  });

  const [selectedFeatures, setSelectedFeatures] = useState([
    "USB Charging",
    "Large Storage",
    "Digital Meter",
    "Good Mileage",
  ]);

  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError("");
  };

  const next = () => {
    if (step === 0) {
      if (
        !form.vehicleType ||
        !form.brand.trim() ||
        !form.model.trim() ||
        !form.registrationNumber.trim() ||
        !form.year ||
        !form.color.trim() ||
        !form.engineCC ||
        Number(form.engineCC) <= 0
      ) {
        setError("Please complete all required vehicle details.");
        return;
      }
    }

    if (step === 1) {
      if (
        !form.price ||
        Number(form.price) <= 0 ||
        form.deposit === "" ||
        Number(form.deposit) < 0 ||
        !form.availableFrom ||
        !form.availableTo
      ) {
        setError("Please complete the pricing and availability details.");
        return;
      }

      if (form.availableTo < form.availableFrom) {
        setError("The end date must be on or after the start date.");
        return;
      }
    }

    if (step === 2 && documents.length === 0) {
      setError("Please upload at least one vehicle document.");
      return;
    }

    setError("");
    setStep((current) => Math.min(current + 1, 3));
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    );
  };

  const reset = () => {
    if (window.confirm("Clear this form and start again?")) {
      window.location.reload();
    }
  };

  const uploadPhotos = (event) => {
    const files = Array.from(event.target.files || []);
    const valid = files.filter((file) => file.type.startsWith("image/"));
    setPhotos((current) => [...current, ...valid].slice(0, 5));
    event.target.value = "";
  };

  
const uploadDocuments = (event) => {
  const selectedFiles = Array.from(event.target.files || []);

  if (selectedFiles.length === 0) {
    return;
  }

  const allowedExtensions = [
    "pdf", "jpg", "jpeg", "png", "doc", "docx",
    "xls", "xlsx", "ppt", "pptx", "txt", "csv", "zip",
  ];

  const validFiles = [];
  const rejectedFiles = [];

  selectedFiles.forEach((file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      rejectedFiles.push(file.name);
    } else if (file.size > 10 * 1024 * 1024) {
      rejectedFiles.push(`${file.name} (exceeds 10 MB)`);
    } else {
      validFiles.push(file);
    }
  });

  if (validFiles.length > 0) {
    setDocuments((previous) => {
      const existing = new Set(
        previous.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
      );

      const newFiles = validFiles.filter(
        (file) =>
          !existing.has(`${file.name}-${file.size}-${file.lastModified}`)
      );

      return [...previous, ...newFiles];
    });
  }

  setError(
    rejectedFiles.length > 0
      ? `Unsupported or oversized files: ${rejectedFiles.join(", ")}`
      : ""
  );

  // Allows selecting the same file again later.
  event.target.value = "";
};

  const panelClass = "rounded-lg border border-gray-200 bg-white p-5";
  const titleClass = "mb-5 text-sm font-bold text-gray-800";

  return (
    <main className="min-h-screen bg-[#f5f7f8] px-4 py-7 text-gray-800 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6">
          <p className="mb-2 text-xs text-gray-400">
            Vehicles / Add Vehicle
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Add New Vehicle
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add vehicle details, documents and set pricing.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Four-step progress bar */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 px-5 py-6 sm:px-8">
            {steps.map((name, index) => (
              <div
                key={name}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (index < step) {
                      setStep(index);
                      setError("");
                    }
                  }}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      index <= step
                        ? "bg-emerald-600 text-white"
                        : "border border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    {index < step ? "✓" : index + 1}
                  </span>
                  <span
                    className={`hidden whitespace-nowrap text-xs sm:block ${
                      index === step
                        ? "font-semibold text-emerald-800"
                        : "text-gray-500"
                    }`}
                  >
                    {name}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`h-px min-w-3 flex-1 ${
                      index < step ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="px-5 pt-6 sm:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">{steps[step]}</h2>
                <p className="mt-1 text-xs text-gray-400">
                  {[
                    "Enter the basic information about your vehicle.",
                    "Set rental prices and choose availability dates.",
                    "Upload the required vehicle documents.",
                    "Review your details before submitting.",
                  ][step]}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-bold tracking-wider text-gray-400">
                STEP {step + 1} OF 4
              </span>
            </div>

            {/* STEP 1: BASIC DETAILS */}
            {step === 0 && (
              <div className="grid grid-cols-1 items-start gap-5 pb-7 lg:grid-cols-[1.25fr_0.9fr]">
                <section className={panelClass}>
                  <h3 className={titleClass}>Vehicle Details</h3>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <Field
                      label="Vehicle Type"
                      value={form.vehicleType}
                      onChange={(v) => update("vehicleType", v)}
                      options={[
                        "Scooter",
                        "Commuter",
                        "Adventure",
                        "Cruiser",
                        "Sports",
                        "E-bike",
                      ]}
                    />
                    <Field
                      label="Brand"
                      value={form.brand}
                      onChange={(v) => update("brand", v)}
                      options={[
                        "Honda",
                        "TVS",
                        "Bajaj",
                        "Hero",
                        "Royal Enfield",
                        "Yamaha",
                        "Suzuki",
                        "Ather",
                        "Ola Electric",
                        "Other",
                      ]}
                    />
                    <Field
                      label="Model"
                      value={form.model}
                      onChange={(v) => update("model", v)}
                      placeholder="Enter model"
                    />
                    <Field
                      label="Registration Number"
                      value={form.registrationNumber}
                      onChange={(v) => update("registrationNumber", v)}
                      placeholder="KA 01 AB 1234"
                    />
                    <Field
                      label="Year of Purchase"
                      value={form.year}
                      onChange={(v) => update("year", v)}
                      options={Array.from(
                        { length: 25 },
                        (_, i) => String(new Date().getFullYear() - i)
                      )}
                    />
                    <Field
                      label="Color"
                      value={form.color}
                      onChange={(v) => update("color", v)}
                      options={[
                        "Pearl White",
                        "Black",
                        "Grey",
                        "Red",
                        "Blue",
                        "Silver",
                        "Other",
                      ]}
                    />
                    <Field
                      label="Fuel Type"
                      value={form.fuelType}
                      onChange={(v) => update("fuelType", v)}
                      options={["Petrol", "Diesel", "Electric", "Hybrid"]}
                    />
                    <Field
                      label="Engine CC"
                      value={form.engineCC}
                      onChange={(v) => update("engineCC", v)}
                      placeholder="110"
                      type="number"
                    />
                    <Field
                      label="No. of Owners"
                      value={form.owners}
                      onChange={(v) => update("owners", v)}
                      options={["1", "2", "3", "4", "5"]}
                    />
                    <Field
                      label="RC Status"
                      value={form.rcStatus}
                      onChange={(v) => update("rcStatus", v)}
                      options={["Active", "Pending", "Expired"]}
                    />
                  </div>
                </section>

                <div className="space-y-5">
                  <section className={panelClass}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold">Vehicle Photos</h3>
                      <span className="text-xs text-gray-400">
                        {photos.length}/5
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {photos.map((photo, index) => (
                        <div
                          key={`${photo.name}-${index}`}
                          className="relative h-36 overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={photo.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPhotos((current) =>
                                current.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-sm text-red-500 shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {photos.length < 5 && (
                        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-2 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30">
                          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-700">
                            ↑
                          </span>
                          <span className="text-xs font-semibold">
                            Upload Photos
                          </span>
                          <span className="mt-2 text-[10px] text-gray-400">
                            JPG, PNG · Max 5 images
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={uploadPhotos}
                          />
                        </label>
                      )}
                    </div>
                  </section>

                  <section className={panelClass}>
                    <h3 className={titleClass}>Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature) => {
                        const selected = selectedFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className={`rounded-md border px-3 py-2 text-xs transition ${
                              selected
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                            }`}
                          >
                            <span className="mr-1.5">
                              {selected ? "✓" : "+"}
                            </span>
                            {feature}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING */}
            {step === 1 && (
              <section className={`${panelClass} mb-7`}>
                <h3 className={titleClass}>Pricing & Availability</h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-3xl">
                  <Field
                    label="Rental Price Per Day (₹)"
                    value={form.price}
                    onChange={(v) => update("price", v)}
                    placeholder="599"
                    type="number"
                  />
                  <Field
                    label="Security Deposit (₹)"
                    value={form.deposit}
                    onChange={(v) => update("deposit", v)}
                    placeholder="2000"
                    type="number"
                  />
                  <Field
                    label="Available From"
                    value={form.availableFrom}
                    onChange={(v) => update("availableFrom", v)}
                    type="date"
                  />
                  <Field
                    label="Available Until"
                    value={form.availableTo}
                    onChange={(v) => update("availableTo", v)}
                    type="date"
                  />
                </div>
              </section>
            )}

            {/* STEP 3: DOCUMENTS */}
            {step === 2 && (
              <section className={`${panelClass} mb-7`}>
                <h3 className={titleClass}>Vehicle Documents</h3>
                <p className="mb-5 text-xs leading-6 text-gray-500">
                  Upload your vehicle RC, insurance, pollution certificate or
                  other supporting documents.
                </p>

                <label className="flex min-h-44 max-w-2xl cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/30">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-700">
                    ↑
                  </span>
                  <span className="text-sm font-semibold">
                    Click to upload documents
                  </span>
                  <span className="mt-2 text-xs text-gray-400">
                    PDF, JPG, PNG, DOC and DOCX
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={uploadDocuments}
                  />
                </label>

                <div className="mt-4 max-w-2xl space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={`${doc.name}-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <span className="text-xl text-emerald-700">▤</span>
                      <div className="min-w-0 flex-1">
                        <p className="break-all text-xs font-medium">
                          {doc.name}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-red-500"
                        onClick={() =>
                          setDocuments((current) =>
                            current.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 4: REVIEW */}
            {step === 3 && (
              <section className="mb-7 space-y-4">
                <div className={panelClass}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-sm font-bold">Vehicle Details</h3>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-xs font-semibold text-emerald-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                    {[
                      ["Vehicle Type", form.vehicleType],
                      ["Brand", form.brand],
                      ["Model", form.model],
                      ["Registration", form.registrationNumber],
                      ["Purchase Year", form.year],
                      ["Color", form.color],
                      ["Fuel Type", form.fuelType],
                      ["Engine CC", form.engineCC],
                      ["Owners", form.owners],
                      ["RC Status", form.rcStatus],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={panelClass}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold">Pricing & Availability</h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-emerald-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                    {[
                      ["Price per day", `₹${form.price}`],
                      ["Security deposit", `₹${form.deposit}`],
                      ["Available from", form.availableFrom],
                      ["Available until", form.availableTo],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={panelClass}>
                  <h3 className={titleClass}>Photos, Features & Documents</h3>
                  <p className="text-sm text-gray-600">
                    {photos.length} photos · {documents.length} documents
                  </p>
                  <p className="mt-3 text-xs leading-6 text-gray-500">
                    Features: {selectedFeatures.join(", ") || "None selected"}
                  </p>
                </div>
              </section>
            )}

            {error && (
              <p
                role="alert"
                className="mx-5 mb-4 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600 sm:mx-8"
              >
                {error}
              </p>
            )}
          </div>

          {/* Footer actions */}
          <footer className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep((current) => current - 1);
                    setError("");
                  }}
                  className="rounded-md border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-md bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Next <span className="ml-2">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    console.log({
                      ...form,
                      features: selectedFeatures,
                      photos,
                      documents,
                    });
                    alert(
                      "Review complete! Connect your backend API to save the vehicle."
                    );
                  }}
                  className="rounded-md bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Submit Vehicle ✓
                </button>
              )}
            </div>
          </footer>
        </section>

        <p className="mt-4 text-[10px] text-gray-400">
          WavyGo · Vehicle management
        </p>
      </div>
    </main>
  );
}
