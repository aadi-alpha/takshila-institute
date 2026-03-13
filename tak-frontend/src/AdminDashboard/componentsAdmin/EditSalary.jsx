import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";


const EditSalary = ({ SalaryId, UserName }) => {
    const [editSalaryData, setEditSalaryData] = useState({
        role: "",
        month: "",
        totalSalary: "",
        paidAmount: "",
    });

    useEffect(() => {
        if (!SalaryId) return;

        const fetchSalary = async () => {
            try {
                const res = await axiosInstance.get(
                    `/SalaryTakshila-fetch-id/${SalaryId}`
                );


                if (res.data.SalaryTakshila) {
                    const { role, month, totalSalary, paidAmount } =
                        res.data.SalaryTakshila;

                    setEditSalaryData({
                        role,
                        month,
                        totalSalary,
                        paidAmount,
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load salary data");
            }
        };

        fetchSalary();
    }, [SalaryId]);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.put(
                `/update-salary/${SalaryId}`,
                editSalaryData
            );

            alert(res.data.message);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error updating salary");
        }
    };

    return (
        <div className="admin-creation">
            <form className="add-admin-card" onSubmit={handleSave}>
                <div className="top-add-admin">
                    <i className="fa-solid fa-money-bill"></i>
                    <p>Edit Salary of {UserName}</p>
                </div>

                <div className="middle-add-admin">


                    {/* Month */}
                    <div className="form-fields">
                        <label>Month</label>
                        <select
                            value={editSalaryData.month}
                            required
                            onChange={(e) =>
                                setEditSalaryData((prev) => ({
                                    ...prev,
                                    month: e.target.value,
                                }))
                            }
                        >
                            <option value="">Select Month</option>
                            {[
                                "january", "february", "march", "april", "may", "june",
                                "july", "august", "september", "october", "november", "december"
                            ].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Total Salary */}
                    <div className="form-fields">
                        <label>Total Salary</label>
                        <input
                            type="number"
                            value={editSalaryData.totalSalary}
                            required
                            onChange={(e) =>
                                setEditSalaryData((prev) => ({
                                    ...prev,
                                    totalSalary: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Paid Amount */}
                    <div className="form-fields">
                        <label>Paid Amount</label>
                        <input
                            type="number"
                            value={editSalaryData.paidAmount}
                            onChange={(e) =>
                                setEditSalaryData((prev) => ({
                                    ...prev,
                                    paidAmount: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="bottom-add-admin">
                    <button type="submit">Update Salary</button>
                </div>
            </form>
        </div>
    );
};

export default EditSalary;
