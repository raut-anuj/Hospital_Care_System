import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/PatientProfile.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";
import { User, Mail, Phone, MapPin, Calendar, Heart, Save } from "lucide-react";

export default function PatientProfile() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    bloodgroup: "",
    contactNumber: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch Patient Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["patient-profile"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch profile");
      }
      return json?.data || {};
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        age: profile.age !== undefined && profile.age !== null ? profile.age : "",
        gender: profile.gender || "",
        bloodgroup: profile.bloodgroup || "",
        contactNumber: profile.contactNumber || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/patient/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age ? Number(formData.age) : undefined,
          gender: formData.gender,
          bloodgroup: formData.bloodgroup,
          contactNumber: formData.contactNumber ? Number(formData.contactNumber) : undefined,
          address: formData.address,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update profile");
      }

      // Update local user storage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const updated = { ...parsed, ...json.data };
          localStorage.setItem("user", JSON.stringify(updated));
        } catch (err) {
          console.error("Failed updating stored user:", err);
        }
      }

      // Invalidate queries so components re-render immediately
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });

      setToast({
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err.message || "Error updating profile",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const patientId = profile?._id
    ? `#PAT-${profile._id.slice(-4).toUpperCase()}`
    : "#PAT-8821";

  if (isLoading) {
    return (
      <div className="patient-profile-page">
        <div className="patient-profile-loading">Loading profile details...</div>
      </div>
    );
  }

  return (
    <div className="patient-profile-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="patient-profile-header">
        <h2>Profile Settings</h2>
        <p>View and manage your personal healthcare information</p>
      </div>

      <div className="patient-profile-grid">
        {/* Left Side: Summary Card */}
        <div className="patient-profile-card">
          <div className="patient-profile-avatar-wrap">
            <div className="patient-profile-avatar">
              <User size={36} />
            </div>
            <h3>{formData.name || "Patient Name"}</h3>
            <span className="patient-profile-id-badge">{patientId}</span>
          </div>

          <div className="patient-profile-info-list">
            <div className="patient-profile-info-item">
              <Mail size={16} />
              <div>
                <span>Email Address</span>
                <strong>{formData.email || "N/A"}</strong>
              </div>
            </div>

            <div className="patient-profile-info-item">
              <Phone size={16} />
              <div>
                <span>Phone Number</span>
                <strong>{formData.contactNumber || "Not specified"}</strong>
              </div>
            </div>

            <div className="patient-profile-info-item">
              <Heart size={16} />
              <div>
                <span>Blood Group</span>
                <strong>{formData.bloodgroup || "Not specified"}</strong>
              </div>
            </div>

            <div className="patient-profile-info-item">
              <MapPin size={16} />
              <div>
                <span>Address</span>
                <strong>{formData.address || "Not specified"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="patient-profile-form-wrap">
          <h3>Edit Personal Details</h3>
          <form onSubmit={handleSubmit} className="patient-profile-form">
            <div className="patient-form-grid">
              <div className="patient-form-group">
                <label>Full Name</label>
                <div className="patient-input-wrap">
                  <User size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Email Address (Read-only)</label>
                <div className="patient-input-wrap patient-input-wrap--disabled">
                  <Mail size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Age</label>
                <div className="patient-input-wrap">
                  <Calendar size={16} />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 24"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Gender</label>
                <div className="patient-input-wrap">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="patient-form-group">
                <label>Blood Group</label>
                <div className="patient-input-wrap">
                  <Heart size={16} />
                  <select
                    name="bloodgroup"
                    value={formData.bloodgroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="patient-form-group">
                <label>Contact Number</label>
                <div className="patient-input-wrap">
                  <Phone size={16} />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              <div className="patient-form-group patient-form-group--full">
                <label>Address</label>
                <div className="patient-input-wrap">
                  <MapPin size={16} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your residential address"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="patient-profile-actions">
              <button
                type="submit"
                className="patient-profile-save-btn"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
