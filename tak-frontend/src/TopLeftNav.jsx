import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from './AxiosInstance'
import Loader from './Loader'
import logo from './assets/takshilaLogo.png'


const TopLeftNav = () => {
    const { id } = useParams()

    const [UserName, setUserName] = useState()

    const [loader, setLoader] = useState(false)
    useEffect(() => {
        const fetchUser = async () => {
            setLoader(true)
            try {
                let logedInUser = await axiosInstance.get(`/UserTakshila-fetch-id/${id}`)
                if (logedInUser) {
                    setUserName(logedInUser.data.UserTakshila.name)
                } else {
                    alert('server side error')
                    setLoader(false)
                }
            } catch (error) {
                alert("server side error ", error)
                setLoader(false)
            }
            setLoader(false)
        }

        fetchUser()
    }, [id])
    return (
        <div>
            {loader === true ? (
                <Loader />
            ) : (
                <div className="top-left">


                    <div>
                        <div className="icon"><i className="fa-solid fa-hat-wizard"></i></div>
                        <div className="admin-text">
                            <h3>{UserName}</h3>
                            <p>Institute Management</p>
                        </div>
                    </div>
                </div>

            )}


        </div>
    )
}

export default TopLeftNav
