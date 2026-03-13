import React, { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const UpdateTest = ({ testData, onClose, onUpdate }) => {
    const [editData, setEditData] = useState({ ...testData });
    const [loading, setLoading] = useState(false);

    const handleMarksChange = (index, value) => {
        const updatedMarks = [...editData.marks];
        updatedMarks[index] = { ...updatedMarks[index], obtainedMarks: value };
        setEditData((prev) => ({ ...prev, marks: updatedMarks }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // validation
        for (let m of editData.marks) {
            if (m.obtainedMarks === '') return alert('Please enter marks for all students');
            if (Number(m.obtainedMarks) > Number(editData.maxMarks))
                return alert('Obtained marks cannot exceed max marks');
        }

        setLoading(true);
        try {
            const payload = {
                testId: editData._id,
                marks: editData.marks.map((m) => ({
                    userId: m.userId,
                    obtainedMarks: Number(m.obtainedMarks),
                })),
            };
            const res = await axiosInstance.put('/TestsUpdate', payload);

            if (res.status === 200) {
                alert('Test updated successfully ✅');
                onUpdate(res.data.updatedTest);
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update test');
        }
        setLoading(false);
    };

    return (
        <>

            <div >
                <h4 >Update Test</h4>
                <br />
                <form onSubmit={handleSave} >
                    <div className="filter-by">
                        <div className="filters-row">
                            <label>Subject</label>
                            <input type="text" value={editData.subject} readOnly />
                        </div>
                        <div className="filters-row">
                            <label>Chapter</label>
                            <input type="text" value={editData.chapterName} readOnly />
                        </div>
                        <div className="filters-row">
                            <label>Test Date</label>
                            <input type="date" value={editData.testDate.slice(0, 10)} readOnly />
                        </div>
                        <div className="filters-row">
                            <label>Max Marks</label>
                            <input type="number" value={editData.maxMarks} readOnly />
                        </div>
                    </div>
                    <div className="table-card-admin-test">
                        <table className="admin-table-list">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Father Name</th>
                                    <th>Obtained Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editData.marks.length > 0 ? (
                                    editData.marks.map((m, i) => (
                                        <tr key={m.userId}>
                                            <td>{m.userId}</td>
                                            <td>{m.userName}</td>
                                            <td>{m.userF_name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={editData.maxMarks}
                                                    value={m.obtainedMarks}
                                                    onChange={(e) => handleMarksChange(i, e.target.value)}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center' }}>
                                            No students found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="edit-actions">
                        <button type="submit" disabled={loading} >
                            {loading ? 'Saving...' : ' Save Changes'}
                        </button>


                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>


    );
};

export default UpdateTest;
