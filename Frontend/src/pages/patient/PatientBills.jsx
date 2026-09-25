import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/PatientBills.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";

export default function PatientBills() {
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // Fetch all bills for this patient
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["patient-bills"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/patient/myBills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch bills");
      }
      return (json?.data || [])
        .filter((bill) => bill.appointmentId != null)
        .sort((a, b) => {
          const dateA = new Date(a.appointmentId?.date || 0);
          const dateB = new Date(b.appointmentId?.date || 0);
          return dateA - dateB;
        });
    },
  });

  const handlePayConfirm = async (e) => {
    e.preventDefault();
    if (!selectedBillForPay) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/patient/payBill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          billId: selectedBillForPay._id,
          method: paymentMethod,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Payment failed");
      }

      setToast({ message: "Payment completed successfully!", type: "success" });
      setSelectedBillForPay(null);
      // Invalidate to refresh the table
      queryClient.invalidateQueries({ queryKey: ["patient-bills"] });
    } catch (err) {
      setToast({ message: err.message || "Payment error", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="patient-bills-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="patient-bills-header">
        <h2 className="patient-bills-title">Invoices & Bills</h2>
        <p className="patient-bills-subtitle">
          View your consultation bills, make simulated payments, and access receipts.
        </p>
      </div>

      <div className="patient-bills-table-wrap">
        <table className="patient-bills-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`bill-skeleton-${skeletonRow}`} className="patient-bills-row">
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                </tr>
              ))
            ) : bills.length > 0 ? (
              bills.map((bill, index) => {
                const doc = bill.appointmentId?.doctorId;
                const isPaid = bill.billStatus === "PAID";
                return (
                  <tr key={bill._id || index} className="patient-bills-row">
                    <td className="patient-bills-id">
                      INV-{String(index + 1).padStart(4, "0")}
                    </td>
                    <td>
                      <div className="patient-bills-doctor">
                        <span className="patient-bills-doc-name">{doc?.name || "Doctor"}</span>
                        <span className="patient-bills-doc-spec">
                          {doc?.specialization || "General"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {bill.appointmentId?.date
                        ? new Date(bill.appointmentId.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td>{bill.appointmentId?.time || "N/A"}</td>
                    <td className="patient-bills-amount">₹{bill.totalAmount}</td>
                    <td>
                      <span
                        className={`patient-bills-status patient-bills-status--${
                          isPaid ? "paid" : "unpaid"
                        }`}
                      >
                        {isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </td>
                    <td>
                      {isPaid ? (
                        <button
                          type="button"
                          className="patient-bills-btn patient-bills-btn--receipt"
                          onClick={() => setSelectedBillForReceipt(bill)}
                        >
                          Receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="patient-bills-btn patient-bills-btn--pay"
                          onClick={() => {
                            setSelectedBillForPay(bill);
                            setPaymentMethod("UPI");
                          }}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="patient-bills-empty">
                  No bills or invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pay Now Modal */}
      {selectedBillForPay && (
        <div
          className="patient-bills-modal-overlay"
          onClick={() => setSelectedBillForPay(null)}
        >
          <div
            className="patient-bills-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="patient-bills-modal-header">
              <h3>Complete Payment</h3>
              <button
                className="patient-bills-modal-close"
                onClick={() => setSelectedBillForPay(null)}
              >
                ✕
              </button>
            </div>

            <div className="patient-bills-modal-summary">
              <div className="patient-bills-modal-row">
                <span>Doctor Fee:</span>
                <strong>₹{(selectedBillForPay.totalAmount || 300) - 300}</strong>
              </div>
              <div className="patient-bills-modal-row">
                <span>Nominal Registration Charge:</span>
                <strong>₹300</strong>
              </div>
              <div className="patient-bills-modal-row">
                <span>GST (0%):</span>
                <strong>₹0</strong>
              </div>
              <div className="patient-bills-modal-row patient-bills-modal-row--total">
                <span>Total Amount Due:</span>
                <strong>₹{selectedBillForPay.totalAmount}</strong>
              </div>
            </div>

            <form onSubmit={handlePayConfirm} className="patient-bills-pay-form">
              <label className="patient-bills-pay-label">Select Payment Method</label>
              <div className="patient-bills-method-grid">
                <label
                  className={`patient-bills-method-card ${
                    paymentMethod === "UPI" ? "patient-bills-method-card--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>UPI</span>
                </label>

                <label
                  className={`patient-bills-method-card ${
                    paymentMethod === "CARD" ? "patient-bills-method-card--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Card</span>
                </label>

                <label
                  className={`patient-bills-method-card ${
                    paymentMethod === "CASH" ? "patient-bills-method-card--active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="CASH"
                    checked={paymentMethod === "CASH"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash / Desk</span>
                </label>
              </div>

              {paymentMethod === "UPI" && (
                <div className="patient-bills-method-detail">
                  <p className="patient-bills-demo-hint">
                    Demo Simulated Checkout: Instant transfer via UPI ID or QR.
                  </p>
                  <input
                    type="text"
                    readOnly
                    value="hospital@upi"
                    className="patient-bills-demo-input"
                  />
                </div>
              )}

              {paymentMethod === "CARD" && (
                <div className="patient-bills-method-detail">
                  <p className="patient-bills-demo-hint">
                    Demo Simulated Checkout: Visa / Mastercard test payment.
                  </p>
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Test Card)"
                    className="patient-bills-demo-input"
                  />
                </div>
              )}

              {paymentMethod === "CASH" && (
                <div className="patient-bills-method-detail">
                  <p className="patient-bills-demo-hint">
                     Hospital Counter Payment: Pay at the reception desk during visit.
                  </p>
                </div>
              )}

              <div className="patient-bills-modal-actions">
                <button
                  type="button"
                  className="patient-bills-modal-cancel"
                  onClick={() => setSelectedBillForPay(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="patient-bills-modal-confirm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Confirm Payment of ₹${selectedBillForPay.totalAmount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {selectedBillForReceipt && (
        <div
          className="patient-bills-modal-overlay"
          onClick={() => setSelectedBillForReceipt(null)}
        >
          <div
            className="patient-bills-receipt-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="patient-bills-receipt-header">
              <div className="patient-bills-receipt-brand">
                <h3>WellSpring Medical</h3>
                <p>Official Consultation Receipt</p>
              </div>
              <button
                className="patient-bills-modal-close"
                onClick={() => setSelectedBillForReceipt(null)}
              >
                ✕
              </button>
            </div>

            <div className="patient-bills-receipt-badge">PAID</div>

            <div className="patient-bills-receipt-body">
              <div className="patient-bills-receipt-row">
                <span>Receipt Number:</span>
                <strong>REC-{selectedBillForReceipt._id.slice(-6).toUpperCase()}</strong>
              </div>
              <div className="patient-bills-receipt-row">
                <span>Doctor:</span>
                <strong>{selectedBillForReceipt.appointmentId?.doctorId?.name || "Doctor"}</strong>
              </div>
              <div className="patient-bills-receipt-row">
                <span>Department:</span>
                <span>{selectedBillForReceipt.appointmentId?.doctorId?.specialization || "General"}</span>
              </div>
              <div className="patient-bills-receipt-row">
                <span>Appointment Date:</span>
                <span>
                  {selectedBillForReceipt.appointmentId?.date
                    ? new Date(selectedBillForReceipt.appointmentId.date).toLocaleDateString("en-IN")
                    : "N/A"}{" "}
                  {selectedBillForReceipt.appointmentId?.time || ""}
                </span>
              </div>
              <div className="patient-bills-receipt-row">
                <span>Date Paid:</span>
                <span>{new Date(selectedBillForReceipt.updatedAt).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="patient-bills-receipt-divider" />
              <div className="patient-bills-receipt-row patient-bills-receipt-row--total">
                <span>Total Amount Paid:</span>
                <strong>₹{selectedBillForReceipt.totalAmount}</strong>
              </div>
            </div>

            <div className="patient-bills-receipt-footer">
              <button
                type="button"
                className="patient-bills-print-btn"
                onClick={() => window.print()}
              >
                Print / Save Receipt
              </button>
              <button
                type="button"
                className="patient-bills-modal-cancel"
                onClick={() => setSelectedBillForReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
