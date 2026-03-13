import React, { useEffect, useState } from 'react'
import axios from 'axios'
import axiosInstance from '../../AxiosInstance'



const TableBatchList = () => {
    const [BatchList, setBatchList] = useState([])
    const [EditBatchDisplay, setEditBatchDisplay] = useState({
        display: false,
        BatchId: ""
    })
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await axiosInstance.get('/batch-fetch')
                console.log(res)
                if (res && res.data?.AllBatches?.length) {
                    setBatchList(res.data.AllBatches)
                }
            } catch (error) {

            }
        }
        fetchBatches()
    }, [])

    return (
        <div>
            <div className='table-card-admin'>
                <div className="table-card-admin-top">
                    <p>Batch Directory</p>
                </div>
                <table className='admin-table-list'>
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>BATCH NAME</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>

                    <tbody>
                        {BatchList?.length > 0 ? (
                            BatchList.map((value, index) => (
                                <tr key={value._id}>
                                    <td>{index + 1}</td>
                                    <td>{value.name.toUpperCase()}</td>
                                    <td>{value?.createdAt?.slice(0, 10)}</td>

                                    <td>
                                        <button
                                            onClick={async () => {
                                                const res = await axiosInstance.delete(
                                                   
                                                    `/batch-delete/${value._id}`
                                                )
                                                 
                                                alert(res.data.message)
                                                window.location.reload()
                                            }}
                                            className='icon-red'
                                        >
                                            <i className="fa-solid fa-circle-minus"></i>
                                        </button>
                                        
                                       
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No Batches Exists</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {EditBatchDisplay.display === true && EditBatchDisplay.BatchId ? (<EditBatch BatchId={EditBatchDisplay.BatchId} />) : (<p></p>)}
        </div>
    )
}

export default TableBatchList
