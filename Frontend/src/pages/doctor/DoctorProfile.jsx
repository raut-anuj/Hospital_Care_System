import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/PatientProfile.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";
import { Mail, Phone, Briefcase, IndianRupee, Save } from "lucide-react";

export default function DoctorProfile() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    sex: "",
    contactNumber: "",
    address: "",
    specialization: "",
    qualification: "",
    fee: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["doctor-profile"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch profile");
      return json?.data || {};
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        age: profile.age !== undefined && profile.age !== null ? profile.age : "",
        sex: profile.sex || "",
        contactNumber: profile.contactNumber || "",
        address: profile.address || "",
        specialization: profile.specialization || "",
        qualification: profile.qualification || "",
        fee: profile.fee !== undefined && profile.fee !== null ? profile.fee : "",
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
    setToast(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/doctor/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");
      setToast({ message: "Profile updated successfully!", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...formData }));
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="patient-profile-page" style={{ padding: "2rem" }}>
        <p style={{ color: "#6b7280" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="patient-profile-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="patient-profile-header">
        <h2 className="patient-profile-title">Doctor Profile</h2>
        <p className="patient-profile-subtitle">
          Manage your personal information, specialization, and consultation fees.
        </p>
      </div>

      <div className="patient-profile-grid">

        {/* Left Col: Read Only Summary */}
        <div className="patient-profile-card">
          <div className="patient-profile-avatar-wrap">
            <div className="patient-profile-avatar">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "D"}
            </div>
            <h3>Dr. {formData.name || "Doctor"}</h3>
            <p>{formData.specialization || "General"}</p>
          </div>

          <div className="patient-profile-info-list">
            <div className="patient-profile-info-item">
              <Mail className="patient-profile-icon" size={18} />
              <div>
                <span>Email</span>
                <strong>{formData.email || "Not provided"}</strong>
              </div>
            </div>
            <div className="patient-profile-info-item">
              <Phone className="patient-profile-icon" size={18} />
              <div>
                <span>Phone</span>
                <strong>{formData.contactNumber || "Not provided"}</strong>
              </div>
            </div>
            <div className="patient-profile-info-item">
              <Briefcase className="patient-profile-icon" size={18} />
              <div>
                <span>Qualification</span>
                <strong>{formData.qualification || "Not provided"}</strong>
              </div>
            </div>
            <div className="patient-profile-info-item">
              <IndianRupee className="patient-profile-icon" size={18} />
              <div>
                <span>Consultation Fee</span>
                <strong>{formData.fee ? `Rs.${formData.fee}` : "Not provided"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Edit Form */}
        <div className="patient-profile-form-wrap">
          <h3>Edit Personal Details</h3>

          <form onSubmit={handleSubmit}>
            <div className="patient-form-grid">

              <div className="patient-form-group">
                <label>Full Name</label>
                <div className="patient-input-wrap">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Email Address</label>
                <div className="patient-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Phone Number</label>
                <div className="patient-input-wrap">
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Age</label>
                <div className="patient-input-wrap">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 35"
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Gender</label>
                <div className="patient-input-wrap">
                  <select name="sex" value={formData.sex} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="patient-form-group">
                <label>Specialization</label>
                <div className="patient-input-wrap">
                  <select name="specialization" value={formData.specialization} onChange={handleChange}>
                    <option value="">Select Specialization</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Cardiologist">Cardiologist</option>
                  </select>
                </div>
              </div>

              <div className="patient-form-group">
                <label>Qualification</label>
                <div className="patient-input-wrap">
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. MBBS, MD"
                  />
                </div>
              </div>

              <div className="patient-form-group">
                <label>Consultation Fee (Rs.)</label>
                <div className="patient-input-wrap">
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="patient-form-group patient-form-group--full">
                <label>Address</label>
                <div className="patient-input-wrap">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full residential or clinic address"
                    rows="3"
                  />
                </div>
              </div>

            </div>

            <div className="patient-profile-actions">
              <button type="submit" className="patient-profile-save-btn" disabled={isSubmitting}>
                <Save size={18} />
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
