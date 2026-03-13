import React, { useEffect, useState } from 'react'
import { useBranchId } from '../../Context/BranchContext'
import axiosInstance from '../../AxiosInstance'
import EditSalary from './EditSalary'

const TableSalaryInfo = () => {
    const { BranchId } = useBranchId()
    const [salaryList, setSalaryList] = useState()
    const [TableLoader, setTableLoader] = useState(false)
    const [allEmployees, setAllEmployees] = useState()
    const [EditUserDisplay, setEditUserDisplay] = useState({
        display: false,
        userId: "",
        name: ''
    })
    const [filters, setFilters] = useState({
        userId: "",
        month: "",
        year: "2026",
    });
    useEffect(() => {
        if (!BranchId) return;

        const fetchSalaryList = async () => {
            setTableLoader(true)
            try {

                let query = `?BranchId=${BranchId}`;
                if (filters.userId) query += `&userId=${filters.userId}`;
                if (filters.month) query += `&month=${filters.month}`;
                if (filters.year) query += `&year=${filters.year}`;

                const res = await axiosInstance.get(`/get-salaries${query}`);

                setSalaryList(res.data.data);
                setTableLoader(false)

            } catch (error) {
                console.error("Failed to fetch salaries", error);
                setTableLoader(false)
            }
            setTableLoader(false)
        };


        fetchSalaryList();
    }, [BranchId, filters]);
    useEffect(() => {
        const fetchAllStaff = async () => {
            let users = await axiosInstance.get(`/role-based-users?role=teacher,receptionist&branch=${BranchId}`)
            setAllEmployees(users.data.Users)

        }
        fetchAllStaff()
    }, [BranchId])

    return (
        <div >
            <div className="admin-filters" style={{ marginInline: "3vw" }}>
                <div className="filter-by ">

                  
                    <div className='filters-row'>
                        <label >MONTH SELECT</label>
                        <select
                            name="month"
                            id="month"


                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    month: e.target.value,
                                }))
                            }
                        >
                            <option value="">Filter by month</option>

                            <option value="january">January</option>
                            <option value="february">February</option>
                            <option value="march">March</option>
                            <option value="april">April</option>
                            <option value="may">May</option>
                            <option value="june">June</option>
                            <option value="july">July</option>
                            <option value="august">August</option>
                            <option value="september">September</option>
                            <option value="october">October</option>
                            <option value="november">November</option>
                            <option value="december">December</option>
                        </select>

                    </div>

                    <div className='filters-row'>
                        <label >USER SELECT</label>
                        <select name="user" id="user" onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                userId: e.target.value.trim()
                            }))

                        }}>
                            <option value=''>Filter By User</option>
                            {allEmployees?.length > 0 ? (allEmployees.map((emp, index) => {
                                return <option key={emp._id} value={emp._id}>{emp.name.toUpperCase()} ({emp.mobile})</option>
                            })) : (<option disabled>No users Exists</option>)}
                        </select>
                    </div>
                    <div className='filters-row'>
                        <label >YEAR SELECT</label>
                        <select
                            id="year"
                            name="year"
                            value={filters.year || ""}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    year: e.target.value,
                                }))
                            }
                        >
                            <option value="">Filter by year</option>

                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                      < div className='filters-head'>

                        <i class="fa-solid fa-filter"></i>&nbsp;Filters</div>

                </div>

            </div>
            <div >
                <div className="table-card-admin">
                    <table className="admin-table-list">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>NAME</th>
                                <th>ROLE</th>
                                <th>TOTAL SALARY</th>
                                <th>PAID AMT.</th>
                                <th>DUE AMT.</th>
                                <th>STATUS</th>
                                <th>MONTH</th>
                                <th>YEAR</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {TableLoader === false ? (
                                salaryList?.length > 0 ? (salaryList.map((item, index) => {
                                    return <tr key={item._id} >
                                        <td>{index + 1}</td>


                                        <td className="name-cell">{item.name}</td>

                                        <td className="role-cell">
                                            {item.role.toUpperCase()}
                                        </td>

                                        <td>{item.totalSalary}</td>
                                        <td>
                                            {item.paidAmount}
                                        </td>

                                        <td>
                                            {item.dueAmount}
                                        </td>
                                        {item.dueAmount === 0 ? (
                                            <td className="salary-status ">
                                                <p className="paid">Paid</p>
                                            </td>
                                        ) : item.dueAmount < 0 ? (
                                            <td className="salary-status">
                                                <p className="lend">Lend</p>
                                            </td>
                                        ) : (
                                            <td className="salary-status">
                                                <p className="partial">Partial</p>
                                            </td>
                                        )}

                                        <td>{item.month.toUpperCase()}</td>
                                        <td>{item.year}</td>
                                        <td>     <button onClick={() => {
                                            setEditUserDisplay(prev => ({
                                                ...prev,
                                                display: true,
                                                userId: item._id,
                                                name: item.name
                                            }))
                                        }}
                                            className='icon-blue'><i className="fa-solid fa-pen-to-square"></i></button>
                                        </td>


                                    </tr>
                                })) : <tr><td colSpan={10} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>No records exists</td></tr>
                            ) : (<tr><td colSpan={10} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>Laoding...</td></tr>)}
                        </tbody>
                    </table>

                </div>
                {EditUserDisplay.display === true && EditUserDisplay.userId ? (<EditSalary SalaryId={EditUserDisplay.userId} UserName={EditUserDisplay.name} />) : (<p></p>)}
            </div>
        </div>


    )
}

export default TableSalaryInfo
