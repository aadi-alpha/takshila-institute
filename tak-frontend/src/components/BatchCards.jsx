import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../AxiosInstance';

const BatchCards = () => {
    const [BatchesList, setBatchesList] = useState([]);
    const [activeBatch, setActiveBatch] = useState("all");
    const navigate = useNavigate();

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

    const handleBatchChange = (e) => {
        const selectedBatch = e.target.value;
        setActiveBatch(selectedBatch);
        navigate(`?q=${selectedBatch}`);
    };

    return (
        <div className="batchDropdown">
            <select
                value={activeBatch}
                onChange={handleBatchChange}
                className="batch-select"
            >
                <option value="all">All Batches</option>

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
    );
};

export default BatchCards;
