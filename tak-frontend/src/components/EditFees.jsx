import React, { useEffect, useState } from "react";
import axiosInstance from "../AxiosInstance";

const EditFees = ({ feesId, studentName, onClose, refresh }) => {
  const [feesData, setFeesData] = useState({
    month: "",
    totalFees: 0,
    paidAmount: 0,
    dueAmount: 0,
  });
  const [newPayment, setNewPayment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch fees by ID
  useEffect(() => {
    if (!feesId) return;

    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/fees-by-id/${feesId}`);
        const { month, totalFees, paidAmount, dueAmount } = res.data.data;

        setFeesData({ month, totalFees, paidAmount, dueAmount });
      } catch (error) {
        console.error("Failed to fetch fees:", error);
        alert("Failed to load fees data");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [feesId]);

  const handleSave = async (e) => {
    e.preventDefault();

    const paymentAmount = Number(newPayment);

    if (!paymentAmount || paymentAmount <= 0) {
      return alert("Enter a valid amount");
    }

    if (paymentAmount > feesData.dueAmount) {
      return alert("Payment cannot exceed due amount");
    }

    try {
      const res = await axiosInstance.patch(`/fees-update/${feesId}`, {
        paidAmount: paymentAmount,
      });

      alert(res.data.message || "Fees updated successfully");
      refresh(); // Refresh parent table
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating fees:", error);
      alert(error.response?.data?.message || "Failed to update fees");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!feesData.month) return null;

  return (
    <div className="admin-creation">
      <form className="add-admin-card" onSubmit={handleSave}>
        <div className="top-add-admin">
          <i className="fa-solid fa-money-bill"></i>
          <p>Edit Fees of {studentName}</p>
        </div>

        <div className="middle-add-admin">
          <div className="form-fields">
            <label>Month</label>
            <input type="text" value={feesData.month.toUpperCase()} disabled />
          </div>

          <div className="form-fields">
            <label>Total Fees</label>
            <input type="number" value={feesData.totalFees} disabled />
          </div>

          <div className="form-fields">
            <label>Already Paid</label>
            <input type="number" value={feesData.paidAmount} disabled />
          </div>

          <div className="form-fields">
            <label>Due Amount</label>
            <input type="number" value={feesData.dueAmount} disabled />
          </div>

          {feesData.dueAmount > 0 && (
            <div className="form-fields">
              <label>Add Payment</label>
              <input
                type="number"
                placeholder={`Max ₹${feesData.dueAmount}`}
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <div className="bottom-add-admin">
          <button type="submit" className="btn-green">
            Update Payment
          </button>
          <button
            type="button"
            className="btn-red"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFees;
