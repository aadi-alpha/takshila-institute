import React, { useEffect, useState } from 'react';
import { useBranchId } from '../Context/BranchContext';
import axiosInstance from '../AxiosInstance';
import Select from 'react-select';
import EditTest from './EditTest';
import UpdateTest from './UpdateTest';

const ViewTest = () => {
  const { BranchId } = useBranchId();

  // States
  const [BatchesList, setBatchesList] = useState([]);
  const [TestDropdownList, setTestDropdownList] = useState([]);
  const [studentsDropdown, setStudentsDropDown] = useState([]);
  const [TestData, setTestData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('byTest');
  const [scoreStatus, setScoreStatus] = useState('all');
  const [StudentViewMode, setStudentViewMode] = useState('off');
  const [TableLoader, setTableLoader] = useState(false);
  const [PerformanceViewStudentId, setPerformanceViewStudentId] = useState('');
  const [Performance, setPerformance] = useState(null);
  const [viewSubject, setviewSubject] = useState('all')
  const [editMode, setEditMode] = useState(false);
  const [editTestData, setEditTestData] = useState(null);

  // Query data
  const [queryData, setQueryData] = useState({
    batch: '',
    studentId: '',
    Testid: '',
  });

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const batches = await axiosInstance.get('/batch-fetch');
        setBatchesList(batches.data.AllBatches || []);
      } catch (err) {
        console.error('Failed to fetch batches', err);
      }
    };
    fetchBatches();
  }, []);

  // Fetch students for dropdown
  useEffect(() => {
    if (!BranchId || !queryData.batch) {
      setStudentsDropDown([]);
      return;
    }
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get(
          `/studentsForTestdropDown?branchId=${BranchId}&batchId=${queryData.batch}`
        );
        setStudentsDropDown(res.data.students || []);
      } catch (err) {
        console.error('Failed to fetch students', err);
        setStudentsDropDown([]);
      }
    };
    fetchStudents();
  }, [BranchId, queryData.batch]);

  // Fetch tests for dropdown
  useEffect(() => {
    if (!BranchId || !queryData.batch) {
      setTestDropdownList([]);
      return;
    }
    const fetchTests = async () => {
      try {
        const res = await axiosInstance.get(`/Test-list-dropdown?batchId=${queryData.batch}`);
        setTestDropdownList(res.data.TestSubjectsDetails || []);
      } catch (err) {
        console.error('Failed to fetch test list', err);
      }
    };
    fetchTests();
  }, [BranchId, queryData.batch]);

  // Fetch test records
  useEffect(() => {
    const fetchTestRecords = async () => {
      setTableLoader(true);
      if (!BranchId || !queryData.batch) {
        setTestData(null);
        setTableLoader(false);
        return;
      }
      try {
        let res;
        if (queryData.Testid) {
          res = await axiosInstance.get(
            `/TestsFetch?batchId=${queryData.batch}&testId=${queryData.Testid}`
          );
          setTestData(res.data.data || null);
        } else if (queryData.studentId) {
          res = await axiosInstance.get(
            `/TestsFetch?batchId=${queryData.batch}&studentId=${queryData.studentId}`
          );
          setTestData(res.data.data || null);
        } else {
          setTestData(null);
        }
      } catch (err) {
        console.error('Failed to fetch test data', err);
      }
      setTableLoader(false);
    };
    fetchTestRecords();
  }, [BranchId, queryData.batch, queryData.Testid, queryData.studentId]);

  // Fetch performance
  useEffect(() => {
    if (!PerformanceViewStudentId?.studentId) return;
    const fetchPerformance = async () => {
      try {
        const res = await axiosInstance.get(`/student--test-report/${PerformanceViewStudentId.studentId}`);
        const perfData = res.data.performanceData;
        setPerformance({
          userId: perfData.userId,
          userName: perfData.userName,
          scoringArray: Object.entries(perfData.scoring).map(([subject, marks]) => ({
            subject,
            maxMarks: marks.maxMarks,
            obtainedMarks: marks.obtainedMarks,
          })),
        });
      } catch (err) {
        console.error('Failed to fetch performance', err);
      }
    };
    fetchPerformance();
  }, [PerformanceViewStudentId]);

  // Filter radio
  const handleOptionChange = (event) => {
    const mode = event.target.value;
    setSelectedFilter(mode);
    setStudentViewMode('off');
    setQueryData({ batch: '', studentId: '', Testid: '' });
    setTestDropdownList([]);
    setStudentsDropDown([]);
    setTestData(null);
  };

  // Summary
  let TestSummaryByTest = { totalStudents: 0, pass: 0, fail: 0 };

  return (
    <div>
      {/* Filter Switch */}
      <div className="test-switch-outer">
        <div className="test-switch">
          <input
            type="radio"
            id="byTest"
            name="testFilter"
            value="byTest"
            checked={selectedFilter === 'byTest'}
            onChange={handleOptionChange}
          />
          <label htmlFor="byTest">By Batch</label>

          <input
            type="radio"
            id="byStudent"
            name="testFilter"
            value="byStudent"
            checked={selectedFilter === 'byStudent'}
            onChange={handleOptionChange}
          />
          <label htmlFor="byStudent">By Student</label>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters-test">
        <div className="filters-row">
          <label>SELECT BATCH</label>
          <select
            value={queryData.batch}
            onChange={(e) => setQueryData((prev) => ({ ...prev, batch: e.target.value, Testid: '', studentId: '' }))}
          >
            <option value="">Select Batch</option>
            {BatchesList.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {selectedFilter === 'byTest' && (
          <>
            <div className="filters-row">
              <label>SELECT TEST</label>
              <Select
                placeholder="Search test..."
                isClearable
                options={TestDropdownList.map((t) => ({
                  value: t._id,
                  label: `${t.subject} ${t.chapterName} ${t.testDate.slice(0, 10)}`,
                }))}
                onChange={(selected) =>
                  setQueryData((prev) => ({ ...prev, Testid: selected ? selected.value : '' }))
                }
                className='my-select'
                classNamePrefix='my-select'
              />
            </div>

            {TestData?.marks?.length > 0 && (
              <div className="filters-row">
                <label>SCORE STATUS</label>
                <select onChange={(e) => setScoreStatus(e.target.value)}>
                  <option value="all">All students</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                </select>
              </div>
            )}
          </>
        )}

        {selectedFilter === 'byStudent' && (
          <div className="filters-row">
            <label>SELECT STUDENT</label>
            <Select
              isClearable
              placeholder="Search student"
              options={studentsDropdown.map((s) => ({
                value: s.rollNo,
                label: `(${s.rollNo}) ${s.st_firstName} ${s.st_lastName}`,
              }))}
              onChange={(selected) => {
                const val = selected ? selected.value : '';
                setQueryData((prev) => ({ ...prev, studentId: val }));
                setPerformanceViewStudentId({ studentId: val });
                setStudentViewMode(val ? 'on' : 'off');
                setPerformance(null);
              }}
              className='my-select'
              classNamePrefix='my-select'
            />
          </div>
        )}
      </div>

      {/* Student Performance */}
      {StudentViewMode === 'on' &&
        Performance?.scoringArray?.map((data, index) => {
          const percent = (data.obtainedMarks / data.maxMarks) * 100;
          const isPass = percent >= 33;
          return (
            <div onClick={() => { setviewSubject(data.subject) }} key={index} className="performance-card">
              <div className="performance-left">
                <div className="avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="info-div">
                  <h2>{Performance.userName}</h2>
                  <p>Roll No: {Performance.userId}</p>
                </div>
              </div>
              <div className="performance-right">
                <div>
                  <p>OVERALL PERCENTAGE</p>
                  <h2>{percent.toFixed(2)}%</h2>
                  <p>SUBJECT: {data.subject.toUpperCase()}</p>
                </div>
                <div>
                  <p>
                    ACADEMIC STATUS    </p>
                  <span className={isPass ? 'academic-status academic-status-pass' : 'academic-status academic-status-fail'}>
                    {isPass ? 'Pass' : 'Fail'}
                  </span>

                </div>
              </div>
            </div>
          );
        })}

      {/* Table */}
      {/* {selectedFilter === 'byTest' && StudentViewMode === 'off' && TestData && (
          <div className="edit-actions">
            <button
              className="edit-test-btn"
              onClick={() => {
                setEditTestData(JSON.parse(JSON.stringify(TestData)));
                setEditMode(true);
              }}
            >
              Edit Test
            </button>
          </div>
        )} */}
      <div className="table-card-admin-test">
        {selectedFilter === 'byTest' && StudentViewMode === 'off' && TestData && (
          <div className="edit-actions">
            <button
              className="edit-test-btn"
              onClick={() => {
                setEditTestData(JSON.parse(JSON.stringify(TestData)));
                setEditMode(true);
              }}
            >
              Edit Test
            </button>
          </div>
        )}
        <table className="admin-table-list">
          <thead>
            <tr>
              <th>Roll.No.</th>
              <th className='fixed-cols'> STU_NAME</th>
              <th>F_NAME</th>
              <th>STATUS</th>
              <th>SUBJECT</th>
              <th>CHAPTER</th>
              <th>DATE</th>
              <th>MAX MARKS</th>
              <th>OBTAINED MARKS</th>
            </tr>
          </thead>

          <tbody>
            {TableLoader === false ? (
              <>
                {/* ================= BY TEST MODE ================= */}
                {StudentViewMode === 'off' && (
                  TestData && TestData.marks?.length > 0 ? (
                    (() => {
                      const filteredMarks = TestData.marks.filter(mark => {
                        if (scoreStatus === 'all') return true
                        const isPass = mark.obtainedMarks > TestData.maxMarks * 0.33
                        return scoreStatus === 'pass' ? isPass : !isPass
                      })

                      // reset summary
                      TestSummaryByTest.totalStudents = 0
                      TestSummaryByTest.pass = 0
                      TestSummaryByTest.fail = 0

                      return filteredMarks.length > 0 ? (
                        filteredMarks.map(mark => {
                          const isPass = mark.obtainedMarks > TestData.maxMarks * 0.33

                          TestSummaryByTest.totalStudents++
                          isPass
                            ? TestSummaryByTest.pass++
                            : TestSummaryByTest.fail++

                          return (
                            <tr key={mark.userId}>
                              <td>{mark.userId}</td>
                              <td className='fixed-cols'>{mark.userName}</td>
                              <td>{mark.userF_name}</td>
                              <td className={isPass ? 'pass' : 'fail'}>
                                <span
                                  style={{
                                    color: 'white',
                                    paddingInline: '15px',
                                    paddingBlock: '5px',
                                    backgroundColor: isPass ? '#11790b' : '#cb0c0c',
                                    borderRadius: '40px'
                                  }}
                                >
                                  {isPass ? 'Pass' : 'Fail'}
                                </span>
                              </td>
                              <td>{TestData.subject.toUpperCase()}</td>
                              <td>{TestData.chapterName.toUpperCase()}</td>
                              <td>{TestData.testDate.slice(0, 10)}</td>
                              <td>{TestData.maxMarks}</td>
                              <td>{mark.obtainedMarks}</td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={9}>No records found</td>
                        </tr>
                      )
                    })()
                  ) : (
                    <tr>
                      <td colSpan={9}>No records found</td>
                    </tr>
                  )
                )}

                {/* ================= BY STUDENT MODE ================= */}
                {StudentViewMode === 'on' && (
                  TestData?.length > 0 ? (
                    TestData.map((item, index) => {
                      const percentage = (item.obtainedMarks / item.maxMarks) * 100
                      const isPass = percentage >= 33
                      if (viewSubject == 'all') {
                        return <tr key={index}>
                          <td>{item.rollNo}</td>
                          <td className='fixed-cols'>{item.studentName}</td>
                          <td>{item.fatherName}</td>
                          <td className={isPass ? 'pass' : 'fail'}>
                            <span
                              style={{
                                color: 'white',
                                paddingInline: '15px',
                                paddingBlock: '5px',
                                backgroundColor: isPass ? '#11790b' : '#cb0c0c',
                                borderRadius: '40px'
                              }}
                            >
                              {isPass ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td>{item.subject.toUpperCase()}</td>
                          <td>{item.chapterName}</td>
                          <td>{item.testDate.slice(0, 10)}</td>
                          <td>{item.maxMarks}</td>
                          <td>{item.obtainedMarks}</td>
                        </tr>
                      }else if(viewSubject===item.subject){
                         return <tr key={index}>
                          <td>{item.rollNo}</td>
                          <td className='fixed-cols'>{item.studentName}</td>
                          <td>{item.fatherName}</td>
                          <td className={isPass ? 'pass' : 'fail'}>
                            <span
                              style={{
                                color: 'white',
                                paddingInline: '15px',
                                paddingBlock: '5px',
                                backgroundColor: isPass ? '#11790b' : '#cb0c0c',
                                borderRadius: '40px'
                              }}
                            >
                              {isPass ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td>{item.subject.toUpperCase()}</td>
                          <td>{item.chapterName}</td>
                          <td>{item.testDate.slice(0, 10)}</td>
                          <td>{item.maxMarks}</td>
                          <td>{item.obtainedMarks}</td>
                        </tr>
                      }

                    })
                  ) : (
                    <tr>
                      <td colSpan={9}>No student performance found</td>
                    </tr>
                  )
                )}
              </>
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>

          {selectedFilter === 'byTest' && (
            <tfoot>
              <tr>
                <td>Totals: {TestSummaryByTest.totalStudents}</td>
                <td style={{ color: 'green' }}>
                  Pass: {TestSummaryByTest.pass}
                </td>
                <td style={{ color: 'red' }}>
                  Fail: {TestSummaryByTest.fail}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>



      {/* Edit Modal */}
      {editMode && editTestData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UpdateTest
              testData={editTestData}
              onClose={() => setEditMode(false)}
              onUpdate={(updatedTest) => {
                setTestData(updatedTest);
                setEditMode(false);
              }}
            />
          </div>
        </div>
      )}
    {StudentViewMode==='on'?(  <div className="refresh" onClick={()=>{setviewSubject('all')}}><div><i class="fa-solid fa-arrows-rotate"></i></div></div>):('')}
    </div>
  );
};

export default ViewTest;



/* */