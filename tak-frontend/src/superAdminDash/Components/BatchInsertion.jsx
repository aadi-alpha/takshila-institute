import axios from 'axios'
import React, { useState } from 'react'
import axiosInstance from '../../AxiosInstance'
import FormBatchCreation from './FormBatchCreation'
import TableBatchList from './TableBatchList'



const BatchInsertion = () => {


  return (
    <>
   <FormBatchCreation />
   <TableBatchList />
    </>
  )
}

export default BatchInsertion
