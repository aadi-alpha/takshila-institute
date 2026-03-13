import React, { useEffect, useState } from 'react'
import { useBranchId } from '../Context/BranchContext'
import axiosInstance from '../AxiosInstance'

const EditTest = () => {
    const { BranchId } = useBranchId()
    const [BatchesList, setBatchesList] = useState()
    const [students, setStudents] = useState()
    const [TableLoader, setTableLoader] = useState(false)
    const [queryData, setQueryData] = useState({
        batch: '',
        subject: ''
    })
    const [testData, setTestData] = useState({
        branchId: BranchId,        // ObjectId (string)
        batchId: queryData?.batch,         // ObjectId (string)
        subject: queryData?.subject,
        testDate: "",
        maxMarks: "",
        chapterName: '',
        marks: [
            {
                userId: "",
                userName: '',
                userF_name: '',    // student _id
                obtainedMarks: ""
            }
        ]
    });
    useEffect(() => {
        setTestData((prev) => ({
            ...prev,
            branchId: BranchId,
            batchId: queryData.batch,
            subject: queryData.subject,
            marks: students?.map((stu) => ({
                userId: stu._id,
                obtainedMarks: ""
            })) || []
        }));
    }, [BranchId, queryData.batch, queryData.subject, students]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const batches = await axiosInstance.get('/batch-fetch');
                setBatchesList(batches.data.AllBatches || []);
            } catch (error) {
                console.error("Failed to fetch batches", error);
            }
        };
        fetchBatches();
    }, []);
    useEffect(() => {
        const fetchStudentsForTests = async () => {
            setTableLoader(true)
            if (queryData.batch && queryData.subject) {

                try {
                    const studentsLists = await axiosInstance.get(`/students-tests?branchId=${BranchId}&batchId=${queryData?.batch}&subject=${queryData?.subject}`)
                    if (studentsLists?.status == 200) {
                        setStudents(studentsLists?.data.students)
                    }
                } catch (error) {
                    alert(error)
                }
            }
            setTableLoader(false)
        }
        fetchStudentsForTests()
    }, [BranchId, queryData?.batch, queryData.subject])

    const handleMarksChange = (index, value) => {
        const updatedMarks = [...testData.marks];

        updatedMarks[index] = {
            userId: students[index].rollNo,
            username: students[index].st_firstName + " " + students[index].st_lastName,
            userF_name: students[index].f_name,
            obtainedMarks: value
        };

        setTestData((prev) => ({
            ...prev,
            marks: updatedMarks
        }));

    };

    const handleSaveTest = async (e) => {
        e.preventDefault();

        // basic validations
        if (!testData.batchId || !testData.subject) {
            return alert("Please select batch and subject");
        }

        if (!testData.testDate || !testData.maxMarks) {
            return alert("Please enter test date and max marks");
        }

        // validate marks
        for (let mark of testData.marks) {
            if (mark.obtainedMarks === "") {
                return alert("Please enter marks for all students");
            }

            if (Number(mark.obtainedMarks) > Number(testData.maxMarks)) {
                return alert("Obtained marks cannot exceed max marks");
            }
        }

        try {
            const payload = {
                ...testData,
                marks: testData.marks.map((m) => ({
                    userId: m.userId,
                    userName: m.username,   // include full name
                    userF_name: m.userF_name, // include father name
                    obtainedMarks: Number(m.obtainedMarks)
                }))
            };
            console.log(payload)

            const res = await axiosInstance.post("/test-insert", payload);

            if (res.status === 200 || res.status === 201) {
                alert("Test saved successfully ✅");
                window.location.reload()

                // optional reset
                setTestData((prev) => ({
                    ...prev,
                    testDate: "",
                    maxMarks: "",
                    marks: prev.marks.map((m) => ({
                        ...m,
                        obtainedMarks: ""
                    }))
                }));
            }

        } catch (error) {
            console.error(error);
            alert("Failed to save test");
        }
    };

    return (
        <div>

            <div className="admin-filters-test">

              
                <div className='filter-by'>
                    <div className='filters-row' >
                        <label >SELECT BATCH</label>
                        <select

                            onChange={(e) => {
                                setQueryData((prev) => ({
                                    ...prev,
                                    batch: e.target.value
                                }))
                            }}
                            className="batch-select"
                        >
                            <option value="">All Batches</option>

                            {BatchesList?.length > 0 ? (
                                BatchesList.map((batch) => (
                                    <option key={batch._id} value={batch._id}>
                                        {batch.name.toUpperCase()}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No Batches Available</option>
                            )}
                        </select>
                    </div>
               
               
                <div className='filters-row'>
                    <label>SUBJECT FILTER</label>
                    <select name="subject" id="subject" onChange={(e) => {
                        setQueryData((prev) => ({
                            ...prev,
                            subject: e.target.value
                        }))
                    }}>
                        <option value="">Select Subject</option>
                        <option value="math">Maths</option>
                        <option value="science">Science</option>
                    </select>
                    </div>
                      < div className='filters-head'>

                        <i class="fa-solid fa-filter"></i>&nbsp;Filters</div>
</div>
            </div>
            <form onSubmit={handleSaveTest} className="table-card-admin-test">
                <div className="top-inputs">
                    <div className="field-top-inputs">
                        <label>Enter Date</label>
                        <input
                            type="date"
                            required
                            onChange={(e) =>
                                setTestData((prev) => ({
                                    ...prev,
                                    testDate: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="field-top-inputs">
                        <label>Enter Max Marks</label>
                        <input
                            type="number"
                            placeholder="Max Marks"
                            required
                            onChange={(e) =>
                                setTestData((prev) => ({
                                    ...prev,
                                    maxMarks: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="field-top-inputs">
                        <label>Enter Chapter Name</label>
                        <input
                            type="text"
                            placeholder="Chapter Name here"
                            required
                            onChange={(e) =>
                                setTestData((prev) => ({
                                    ...prev,
                                    chapterName: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>


                <div>
                    <table className="admin-table-list">
                        <thead>
                            <tr>
                                <th>Roll.No.</th>

                                <th>NAME</th>
                                <th>F_NAME</th>
                                <th>CHAPTER</th>
                                <th>MAX MARKS</th>
                                <th>OBTAINED MARKS</th>

                            </tr>
                        </thead>

                        <tbody>
                            {TableLoader === false ? (
                                students?.length > 0 ? (students.map((value, index) => {
                                    return <tr key={value._id}>
                                        <td>{value.rollNo}</td>
                                        <td>{value.st_firstName} {value.st_lastName}</td>
                                        <td>{value.f_name}</td>
                                        <td>{testData?.chapterName}</td>
                                        <td>{testData?.maxMarks}</td>
                                        <td><input type="number" placeholder={`Marks of ${value.st_firstName}`} value={testData.marks[index]?.obtainedMarks || ""}
                                            onChange={(e) => handleMarksChange(index, e.target.value)}
                                            required /></td>
                                    </tr>
                                })) : (<tr><td colSpan={6} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>No students Exists</td></tr>)
                            ) : (<tr><td style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }} colSpan={6}>Loading...</td></tr>)}
                        </tbody>
                    </table>
                    <div className='save-btn-test'><button type='submit'  > Save </button></div>
                </div>
            </form>
        </div>
    )
}

export default EditTest
