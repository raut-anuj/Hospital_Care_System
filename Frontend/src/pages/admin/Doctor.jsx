import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/Doctor.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  specialization: "Gynecologist",
  qualification: "",
  fee: "",
  age: "",
  sex: "Male",
  address: "",
};

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const queryClient = useQueryClient();

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/admin/doctorsList?name=Admin`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch doctors");
      return data?.data || [];
    },
  });

  const filteredDoctors = list
    .filter((doc) => doc.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.fee ||
      !formData.qualification.trim() ||
      !formData.address.trim() ||
      !formData.age ||
      !formData.specialization.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }

    if (Number(formData.age) <= 0) {
      setFormError("Age must be greater than 0.");
      return;
    }

    if (Number(formData.fee) < 0) {
      setFormError("Fee cannot be negative.");
      return;
    }

    if (!/[0-9]/.test(formData.password) || !/[^A-Za-z0-9\s]/.test(formData.password)) {
      setFormError("Password must contain at least 1 number and 1 special character.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/doctors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          fee: Number(formData.fee),
          qualification: formData.qualification.trim(),
          address: formData.address.trim(),
          age: Number(formData.age),
          specialization: formData.specialization.trim(),
          sex: formData.sex,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Failed to add doctor.");
      }

      setToast({ message: "Doctor registered successfully!", type: "success" });
      setIsAddOpen(false);
      setFormData(INITIAL_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    } catch (err) {
      setFormError(err.message || "Failed to register doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="doctor-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="doctor-page__header">
        <h2 className="doctor-page__title">Doctor List</h2>
        <button
          className="doctor-page__add-btn"
          onClick={() => {
            setIsAddOpen(true);
            setFormError("");
          }}
        >
          <svg
            className="doctor-page__add-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add New Doctor</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="doctor-page__search"
      />

      <div className="doctor-page__table-wrap">
        <table className="doctor-page__table">
          <thead className="doctor-page__thead">
            <tr>
              <th>ID</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Qualification</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`doctor-skeleton-${skeletonRow}`} className="doctor-page__row">
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                </tr>
              ))
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <tr key={doc._id || index} className="doctor-page__row">
                  <td>{index + 1}</td>
                  <td>
                    <button
                      className="admin-drawer-name-btn"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      {doc.name}
                    </button>
                  </td>
                  <td>{doc.specialization || "N/A"}</td>
                  <td>{doc.qualification || "N/A"}</td>
                  <td>{doc.fee != null ? `₹${doc.fee}` : "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="doctor-page__empty">
                  No Doctor found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Doctor Detail Drawer */}
      {selectedDoctor && (
        <>
          <div
            className="admin-drawer-overlay"
            onClick={() => setSelectedDoctor(null)}
          />
          <div className="admin-drawer">
            <div className="admin-drawer__header">
              <h3 className="admin-drawer__title">Doctor Details</h3>
              <button
                className="admin-drawer__close"
                onClick={() => setSelectedDoctor(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-drawer__content">
              <div className="admin-drawer__info-grid">
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Name</span>
                  <span className="admin-drawer__value">{selectedDoctor.name || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Email</span>
                  <span className="admin-drawer__value">{selectedDoctor.email || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Specialization</span>
                  <span className="admin-drawer__value">{selectedDoctor.specialization || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Qualification</span>
                  <span className="admin-drawer__value">{selectedDoctor.qualification || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Age</span>
                  <span className="admin-drawer__value">{selectedDoctor.age || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Gender</span>
                  <span className="admin-drawer__value">{selectedDoctor.sex || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Fee</span>
                  <span className="admin-drawer__value">
                    {selectedDoctor.fee != null ? `₹${selectedDoctor.fee}` : "N/A"}
                  </span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Address</span>
                  <span className="admin-drawer__value">{selectedDoctor.address || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Joined</span>
                  <span className="admin-drawer__value">
                    {selectedDoctor.createdAt
                      ? new Date(selectedDoctor.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add New Doctor Modal */}
      {isAddOpen && (
        <div className="add-doctor-overlay" onClick={() => setIsAddOpen(false)}>
          <div
            className="add-doctor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="add-doctor-modal__header">
              <h3 className="add-doctor-modal__title">➕ Add New Doctor</h3>
              <button
                className="add-doctor-modal__close"
                onClick={() => setIsAddOpen(false)}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="add-doctor-modal__error">{formError}</div>
            )}

            <form onSubmit={handleAddDoctor} className="add-doctor-form">
              <div className="add-doctor-form__grid">
                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. rajesh@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Temporary Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 1 num & 1 symbol (e.g. Doc@123)"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Specialization *</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="add-doctor-form__select"
                    required
                  >
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Dermatologist">Dermatologist</option>
                  </select>
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="e.g. MBBS, MD"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Consultation Fee (₹) *</label>
                  <input
                    type="number"
                    name="fee"
                    placeholder="e.g. 500"
                    min="0"
                    value={formData.fee}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Age *</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="e.g. 38"
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>

                <div className="add-doctor-form__group">
                  <label className="add-doctor-form__label">Gender / Sex *</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="add-doctor-form__select"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="add-doctor-form__group add-doctor-form__group--full">
                  <label className="add-doctor-form__label">Cabin / Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g. Room 204, OPD Block A"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="add-doctor-form__input"
                    required
                  />
                </div>
              </div>

              <div className="add-doctor-form__actions">
                <button
                  type="button"
                  className="add-doctor-form__cancel-btn"
                  onClick={() => setIsAddOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="add-doctor-form__submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Register Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
