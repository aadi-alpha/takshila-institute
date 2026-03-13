import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from './Loader';
import { Link } from 'react-router-dom';
import axiosInstance from './AxiosInstance';
// aadi nagpal
// http://localhost:8000/api/web/batch-fetch
const RegForm = () => {

    const year = new Date().getFullYear()
    const [PaymentAmt, setPaymentAmt] = useState();
    const [PaymentStatus, setPaymentStatus] = useState('pending');
    const [loader, setLoader] = useState(false)
    const [loaderPara, setLoaderPara] = useState('uploading')

    const [stuPhoto, setStuPhoto] = useState()

    const statesOfIndia = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry"
    ];
    const [Branches, setAllBranches] = useState()
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const branches = await axiosInstance.get('/branch-fetch')
                if (branches) {
                    setAllBranches(branches.data.allBranches)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchBranches()
    }, [])
    const [Batches, setAllBatches] = useState()
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const batches = await axiosInstance.get('/batch-fetch')
                console.log(batches)
                if (batches) {
                    setAllBatches(batches.data.AllBatches)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchBatches()
    }, [])

    const [formData, setFormData] = useState({
        sessionYear: `${year}-${year + 1}`,
        batchDetails: '',
        batchId: '',
        centerLoc: '',
        branchId: '',
        entranceTestDate: '',
        st_subjects: [],
        // stuPhoto: null,
        st_firstName: '',
        st_middleName: '',
        st_lastName: '',
        st_DOB: '',
        st_gender: '',
        st_category: '',

        st_whatsappNo: '',
        f_name: '',
        f_occupation: '',
        f_contact: '',
        f_email: '',
        m_name: '',
        m_occupation: '',
        m_contact: '',
        m_email: '',
        st_res_address: '',
        st_res_city: '',
        st_res_state: '',
        st_res_pin: '',
        st_class: '',
        st_school_name: '',
        st_per_last_year: '',
        st_payment_mode: 'unpaid',
        st_payment_amount: PaymentAmt,
        st_payment_status: PaymentStatus,
        st_declaration: false
    });




    useEffect(() => {
        if (formData.batchDetails == 'jee' || formData.batchDetails == 'neet') {
            setPaymentAmt(3000);
            setFormData(prev => ({
                ...prev,
                st_payment_amount: PaymentAmt
            }));

        } else if (formData.batchDetails == '9' || formData.batchDetails == '10' || formData.batchDetails == '11' || formData.batchDetails == '12') {
            setPaymentAmt(formData.st_subjects.length * 300);
            setFormData(prev => ({
                ...prev,
                st_payment_amount: PaymentAmt
            }));



        } else {
            setPaymentAmt(0);
        }
    }, [formData.st_subjects, formData.batchDetails]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            st_payment_status: PaymentStatus
        }));
    }, [PaymentStatus]);
    async function submitHandler(e) {
        e.preventDefault();
        setLoader(true)
        setLoaderPara("checking conditions")
        if (
            formData.sessionYear &&
            (formData.batchDetails) &&
            (formData.centerLoc) &&
            formData.st_subjects.length > 0 &&

            formData.st_firstName &&
            formData.st_lastName &&
            formData.st_DOB &&
            (formData.st_gender == 'male' || formData.st_gender == 'female' || formData.st_gender == 'other') &&
            (formData.st_category && formData.st_category !== '') &&

            formData.st_whatsappNo &&
            formData.f_name &&
            formData.f_contact &&
            formData.m_name &&
            formData.st_res_address &&
            formData.st_res_city &&
            (formData.st_res_state != '') &&
            formData.st_res_pin &&
            (formData.st_class && formData.st_class !== '') &&
            formData.st_school_name &&
            formData.st_per_last_year &&
            (
                (formData.st_payment_mode === 'online' &&
                    formData.st_payment_amount > 0 &&
                    formData.st_payment_status === 'paid')
                ||
                formData.st_payment_mode === 'cash'
            )
            &&
            formData.st_declaration == true
        ) {
            try {
                setLoaderPara('checking image')

            
                setFormData(formData);
                setLoaderPara('registering student')
                console.log("registering student")
                // 4️⃣ Send final data to backend
                const dataUploadRes = await axiosInstance.post(
                    "/student-insert",
                    formData
                );
                setLoaderPara('student successfully registered')
                setLoader(false)
                alert(dataUploadRes.data.message)

            } catch (error) {
                setLoader(false)
                setLoaderPara('Failed in registering student.. Please check aadhar no ')

                alert(error);

            }


        } else {

            alert("Please fill all mandatory fields");
            setLoader(false)
        }
        setLoader(false)
    }

    return (
        <div>
            {loader == true ? (<Loader value={loaderPara} />) : <div />}

            <div className='reg-Form'>

                <section className="section-one-form">
                    <i className="fa-solid fa-circle-info"></i>
                    <div>
                        <h3>Please fill all the data carefully.</h3>
                        <p>Fields marked with <sup><span style={{ color: "red" }}>*</span></sup> are mandatory.</p>
                    </div>
                </section>

                <form action="" onSubmit={(e) => submitHandler(e)}>
                    {/* --------institute details-------- */}
                    <section className='section-general-form'>
                        <div className="sec-top">
                            <i className="fa-solid fa-building-columns"></i>
                            <p>INSTITUTE DETAILS</p>
                        </div>
                        <div className="sec-bottom">

                            <div className="form-fields">
                                <label htmlFor="">Session <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="text" value={`${year}-${year + 1}`} required readOnly />
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Batch <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <select name="" id="batch" required onChange={(e) => {
                                    const selectedOption = e.target.selectedOptions[0]
                                    setFormData((prev) => ({
                                        ...prev,
                                        batchId: e.target.value,
                                        batchDetails: selectedOption.dataset.batchName

                                    }))
                                }}>
                                    <option value="">Select Batch</option>
                                    {Batches ? (Batches.map((value, index) => {
                                        return <option key={index} value={`${value._id}`} data-batch-name={value.name}>{value.name.toUpperCase()}</option>
                                    })) : (<option>No batches exists</option>)}
                                </select>

                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Study Center <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <select name="" id="branch" required onChange={(e) => {
                                    const selectedOption = e.target.selectedOptions[0]
                                    setFormData((prev) => ({

                                        ...prev,
                                        branchId: e.target.value,
                                        centerLoc: selectedOption.dataset.branchName
                                    }))

                                }}>
                                    <option value="">Select Center</option>
                                    {Branches ? (Branches.map((value, index) => {
                                        return <option key={index} value={`${value._id}`} data-branch-name={value.name}>{value.name}</option>
                                    })) : (<option>No branches exists</option>)}
                                </select>
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Entrance Test Date </label>
                                <input type="date" onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        entranceTestDate: e.target.value.trim()

                                    }))

                                }} />
                            </div>
                            <div className=" form-fields-subjects">
                                <label htmlFor="">Select Subjects <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <div className="subjects-lists">
                                    <div className="subject-name">
                                        <input type="checkbox" value='math' checked={formData.st_subjects.includes("math")} onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                st_subjects: e.target.checked ? [...prev.st_subjects, e.target.value.trim()] : prev.st_subjects.filter(sub => sub !== e.target.value.trim())
                                            }))

                                        }} /><span style={{ cursor: "pointer" }}>Maths</span>
                                    </div>
                                    <div className="subject-name">
                                        <input type="checkbox" value='science' checked={formData.st_subjects.includes("science")} onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                st_subjects: e.target.checked ? [...prev.st_subjects, e.target.value.trim()] : prev.st_subjects.filter(sub => sub !== e.target.value.trim())
                                            }))

                                        }} /><span style={{ cursor: "pointer" }}>Science</span>
                                    </div>
                                </div>

                            </div>
                     

                        </div>
                    </section>
                    {/* --------student details-------- */}
                    <section className='section-general-form'>
                        <div className="sec-top">
                            <i className="fa-solid fa-user"></i>
                            <p>STUDENT DETAILS</p>
                        </div>
                        <div className="sec-bottom">

                            <div className="form-fields">
                                <label htmlFor="">First Name <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="text" value={formData.st_firstName} placeholder='First Name' required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_firstName: e.target.value.trim()
                                    }))

                                }} />
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Middle Name</label>
                                <input type="text" placeholder='Middle Name' value={formData.st_middleName} onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_middleName: e.target.value.trim()

                                    }))

                                }} />
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Last Name <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="text" placeholder='Last Name' value={formData.st_lastName} required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_lastName: e.target.value.trim()

                                    }))

                                }} />
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Date Of Birth <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="date" value={formData.st_DOB} required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_DOB: e.target.value.trim()

                                    }))

                                }} />
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Gender <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <div className='radio-div'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.st_gender === "male"}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    st_gender: e.target.value.trim()
                                                }))
                                            }}
                                        />
                                        Male
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.st_gender === "female"}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    st_gender: e.target.value.trim()

                                                }))

                                            }}
                                        />
                                        Female
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="other"
                                            checked={formData.st_gender === "other"}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    st_gender: e.target.value.trim()

                                                }))

                                            }}
                                        />
                                        Other
                                    </label>
                                </div>
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Category <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <select required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_category: e.target.value.trim()

                                    }))

                                }}>
                                    <option value="">Select Caste</option>
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-fields">
                                <label htmlFor="">Whatsapp No. <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="text" placeholder='Whatsapp no' value={formData.st_whatsappNo} minLength={10} maxLength={10} inputMode="numeric"
                                    pattern="[0-9]*" required onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            st_whatsappNo: e.target.value.trim().toString()

                                        }))

                                    }} />
                            </div>

                        </div>

                    </section>
                    {/* --------parent details-------- */}
                    <section className="section-general-form">
                        <div className="sec-top">
                            <i className="fa-solid fa-people-roof"></i>
                            <p>PARENTS DETAILS</p>
                        </div>
                        <div className="bottom-outer">
                            <div className="sec-bottom-left">
                                <div className="sec-top" style={{ color: "#223e9d" }}>
                                    <i className="fa-solid fa-mars"></i>
                                    <p>Father's Data</p>
                                </div>

                                <div className="sec-bottom">
                                    <div className='form-parents'>
                                        <div className="form-fields">
                                            <label htmlFor="">Full Name <sup><span style={{ color: "red" }}>*</span></sup></label>
                                            <input type="text" placeholder='Full Name' value={formData.f_name} required onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    f_name: e.target.value

                                                }))

                                            }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Occupation <sup><span style={{ color: "red" }}>*</span></sup></label>
                                            <input type="text" required placeholder='occupation' value={formData.f_occupation} onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    f_occupation: e.target.value

                                                }))

                                            }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Contact No. <sup><span style={{ color: "red" }}>*</span></sup></label>
                                            <input type="text" placeholder='Contact No.' required value={formData.f_contact} inputMode="numeric"
                                                pattern="[0-9]*" minLength={10} maxLength={10} onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        f_contact: e.target.value.trim().toString()

                                                    }))

                                                }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Email-id </label>
                                            <input type="email" placeholder='email-id' onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    f_email: e.target.value.trim()

                                                }))

                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sec-bottom-right" >
                                <div className="sec-top" style={{ color: "#223e9d" }}>
                                    <i className="fa-solid fa-venus"></i>
                                    <p>Mother's Data</p>
                                </div>
                                <div className="sec-bottom">
                                    <div className='form-parents'>
                                        <div className="form-fields">
                                            <label htmlFor="">Full Name <sup><span style={{ color: "red" }}>*</span></sup></label>
                                            <input type="text" placeholder='Full Name' value={formData.m_name} required onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    m_name: e.target.value

                                                }))

                                            }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Occupation <sup><span style={{ color: "red" }}>*</span></sup></label>
                                            <input type="text" placeholder='occupation' required onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    m_occupation: e.target.value

                                                }))

                                            }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Contact No. </label>
                                            <input type="text" placeholder='Contact No.' minLength={10} maxLength={10} inputMode="numeric"
                                                pattern="[0-9]*" onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        m_contact: e.target.value.trim().toString()

                                                    }))

                                                }} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor="">Email-id </label>
                                            <input type="email" placeholder='Email-id' onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    m_email: e.target.value.trim()

                                                }))

                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* --------resedential address-------- */}
                    <section className='section-general-form'>
                        <div className="sec-top">
                            <i className="fa-solid fa-house"></i>
                            <p>RESEDENTIAL ADDRESS</p>
                        </div>
                        <div className="sec-bottom-address">

                            <label htmlFor="" >Resedential Address <sup><span style={{ color: "red" }}>*</span></sup> </label>
                            <textarea name="address" id="address" placeholder='Enter your address' cols={5} required value={formData.st_res_address} onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    st_res_address: e.target.value

                                }))
                            }}></textarea>

                            <div className="address-bottom">
                                <div className="form-fields">
                                    <label htmlFor="" >City <sup><span style={{ color: "red" }}>*</span></sup> </label>
                                    <input type="text" placeholder='City' required value={formData.st_res_city} onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            st_res_city: e.target.value.trim()

                                        }))

                                    }} />
                                </div>
                                <div className="form-fields">
                                    <label htmlFor="" >State <sup><span style={{ color: "red" }}>*</span></sup> </label>
                                    <select required onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            st_res_state: e.target.value.trim()

                                        }))

                                    }}>
                                        <option value="">-- Select State --</option>
                                        {statesOfIndia.map((stateName, index) => (
                                            <option key={index} value={stateName}>
                                                {stateName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-fields">
                                    <label htmlFor="" >Pin Code <sup><span style={{ color: "red" }}>*</span></sup> </label>
                                    <input type="number" placeholder='Pin Code' minLength={6} maxLength={6} required onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            st_res_pin: e.target.value.trim()

                                        }))

                                    }} />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* --------academic details------- */}
                    <section className='section-general-form'>
                        <div className="sec-top">
                            <i className="fa-solid fa-square-poll-horizontal"></i>
                            <p>ACADEMIC DETAILS</p>
                        </div>
                        <div className="sec-bottom">
                            <div className="form-fields">
                                <label htmlFor="">Select Class<sup><span style={{ color: "red" }}>*</span></sup> </label>
                                <select name="" id="class-school" required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_class: e.target.value

                                    }))

                                }}>
                                    <option value="">Select Class</option>
                                    <option value="9th">9th</option>
                                    <option value="10th">10th</option>
                                    <option value="11th">11th</option>
                                    <option value="12th">12th</option>
                                </select>
                            </div>
                            <div className="form-fields">
                                <label htmlFor="">Enter school name <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="text" placeholder='School Name' value={formData.st_school_name} required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_school_name: e.target.value

                                    }))

                                }} />
                            </div>


                        </div>
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }} >
                            <div className="form-fields">
                                <label htmlFor="">Percentage of marks obtained last year <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <input type="number" placeholder='Percentage (96.5%)' value={formData.st_per_last_year} required style={{ width: "100%" }} onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_per_last_year: e.target.value.trim()

                                    }))

                                }} />
                            </div>
                        </div>
                    </section>
                    {/* st fees status */}
                    <section className='section-general-form' style={{ backgroundColor: "rgba(246, 246, 246, 0.72)", marginRight: "10px" }}>
                        <div className="sec-top">
                            <i className="fa-regular fa-money-bill-1"></i>
                            <p>REGISTRATION FEES</p>
                        </div>
                        <div className="sec-bottom">
                            <div className="form-fields-payment">
                                <label htmlFor="">Select Payment Mode <sup><span style={{ color: "red" }}>*</span></sup></label>
                                <div className='radio-div-payment'>

                                    <label className='radio-pay-label'>
                                        <input
                                            type="radio"
                                            name="payment-mode"
                                            value="online"
                                            checked={formData.st_payment_mode === "online"}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    st_payment_mode: e.target.value.trim()
                                                }))
                                            }}
                                        />
                                        &nbsp; Online
                                    </label>

                                    <label className='radio-pay-label'>
                                        <input
                                            type="radio"
                                            name="payment-mode"
                                            value="cash"
                                            checked={formData.st_payment_mode === "cash"}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    st_payment_mode: e.target.value.trim()
                                                }))
                                            }}
                                        />
                                        &nbsp; Cash
                                    </label>
                                </div>
                            </div>
                            
                                {formData.st_subjects.length == 0 ? (<p className="pay-online-fees">"Please select at least one subject "</p>) : (
                                    PaymentAmt > 0 ? (<div className="pay-online-fees">
                                        <p>Registraion fees:-&nbsp;&nbsp;&nbsp;&nbsp;₹{PaymentAmt}</p>
                                        <button type='button' onClick={() => {
                                            setPaymentStatus('paid')
                                        }}>Pay Now</button>
                                        <h5>Status:- {formData.st_payment_status}</h5>
                                    </div>) : (<p className="pay-online-fees">"Please select your batch  "</p>
                                )
                            )}


                        </div>

                    </section>
                    {/* --------declaration-------- */}
                    <section className='section-general-form'>
                        <div className="sec-top">
                            <i className="fa-solid fa-shield"></i>
                            <p>DECLARATION</p>
                        </div>
                        <div className="sec-bottom" style={{ backgroundColor: "rgba(246, 246, 246, 0.72)", marginInline: "10px", borderRadius: "5px" }}>
                            <div style={{ fontSize: "clamp(12px,1.5vw,15px", color: "#262626ff", padding: "10px" }}>

                                <p> I herey declare that the information provided in this application form is true and correct to the best of my knowledge and belief. I understand that any willful misrepresentation of facts will result in the rejection of my application or cancellation of my admission at any stage.</p>
                                <div className="dec-check" > <input type="checkbox" required onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        st_declaration: e.target.checked
                                    }))

                                }} /><span style={{ cursor: "pointer" }}>I Agree to the <a href=""> <u>Terms &amp; Conditions</u> </a>and Rules of Takshila Institute</span></div>
                            </div>
                        </div>
                    </section>
                    <div className="submit-form">
                        <button type='submit'><i className="fa-solid fa-arrow-right-from-bracket"></i> REGISTER NOW </button>
                    </div>
                </form>
                <p className='copyright'>  © 2026  Takshila Institute. All Rights Reserved.</p>
            </div></div>
    )
}

export default RegForm
