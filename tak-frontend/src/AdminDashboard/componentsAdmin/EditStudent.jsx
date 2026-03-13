import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from '../../Loader'
import axiosInstance from "../../AxiosInstance";

const EditStudent = () => {
  const { idSt } = useParams();
  const navigate = useNavigate();

  const year = new Date().getFullYear();
  const [loader, setLoader] = useState(false);
  const [loaderPara, setLoaderPara] = useState("loading student");

  const statesOfIndia = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Delhi"
  ];

  const [formData, setFormData] = useState({
    sessionYear: `${year}-${year + 1}`,
    batchDetails: "",
    centerLoc: "",
    entranceTestDate: "",
    st_subjects: [],
    st_firstName: "",
    st_middleName: "",
    st_lastName: "",
    st_DOB: "",
    st_gender: "",
    st_category: "",

    st_whatsappNo: "",
    f_name: "",
    f_occupation: "",
    f_contact: "",
    f_email: "",
    m_name: "",
    m_occupation: "",
    m_contact: "",
    m_email: "",
    st_res_address: "",
    st_res_city: "",
    st_res_state: "",
    st_res_pin: "",
    st_class: "",
    st_school_name: "",
    st_per_last_year: ""
  });

  /* ================= FETCH STUDENT ================= */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoader(true);
        const res = await axiosInstance.get(
          `/fetchById-student/${idSt}`
        );
        setFormData(prev => ({ ...prev, ...res.data.StudentDetails }));
        setLoader(false);
      } catch (err) {
        setLoader(false);
        alert("Failed to fetch student");
      }
    };
    fetchStudent();
  }, [idSt]);

  /* ================= UPDATE ================= */
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      setLoaderPara("updating student");

      await axiosInstance.put(
        `/student-update/${idSt}`,
        formData
      );

      alert("Student updated successfully");
      navigate(-1); // back to student view
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoader(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      {loader && <Loader value={loaderPara} />}
<button onClick={ ()=>{navigate(-1)}}  style={{marginTop:"100px",backgroundColor:"tranparent" , border:"0" , fontSize:"clamp(16px,2vw,18px)",fontWeight:"bold",paddingInline:"3vw",color:"#073856"}}> Back</button>
      <div className="reg-Form" style={{marginTop:"10px"}}>
        <form onSubmit={submitHandler}>

          {/* -------- INSTITUTE DETAILS -------- */}
          <section className="section-general-form">
            <div className="sec-top">
              <p>INSTITUTE DETAILS</p>
            </div>
            <div className="sec-bottom">
              <div className="form-fields">
                <label>Session</label>
                <input type="text" value={formData.sessionYear} readOnly />
              </div>
              <div className="form-fields">
                <label>Batch</label>
                <select
                  value={formData.batchDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, batchDetails: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="neet">NEET</option>
                  <option value="jee">JEE</option>
                  <option value="9">9th</option>
                  <option value="10">10th</option>
                  <option value="11">11th</option>
                  <option value="12">12th</option>
                </select>
              </div>
              <div className="form-fields">
                <label>Center</label>
                <select
                  value={formData.centerLoc}
                  onChange={(e) =>
                    setFormData({ ...formData, centerLoc: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="jagadhri">Jagadhri</option>
                </select>
              </div>
              <div className="form-fields">
                <label>Entrance Test Date</label>
                <input
                  type="date"
                  value={formData.entranceTestDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, entranceTestDate: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* -------- STUDENT DETAILS -------- */}
          <section className="section-general-form">
            <div className="sec-top">
              <p>STUDENT DETAILS</p>
            </div>
            <div className="sec-bottom">
              <input
                placeholder="First Name"
                value={formData.st_firstName}
                onChange={(e) =>
                  setFormData({ ...formData, st_firstName: e.target.value })
                }
              />
              <input
                placeholder="Middle Name"
                value={formData.st_middleName}
                onChange={(e) =>
                  setFormData({ ...formData, st_middleName: e.target.value })
                }
              />
              <input
                placeholder="Last Name"
                value={formData.st_lastName}
                onChange={(e) =>
                  setFormData({ ...formData, st_lastName: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.st_DOB}
                onChange={(e) =>
                  setFormData({ ...formData, st_DOB: e.target.value })
                }
              />
              <select
                value={formData.st_gender}
                onChange={(e) =>
                  setFormData({ ...formData, st_gender: e.target.value })
                }
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          {/* -------- PARENT DETAILS -------- */}
          <section className="section-general-form">
            <div className="sec-top">
              <p>PARENT DETAILS</p>
            </div>
            <div className="sec-bottom">
              {/* Father */}
              <input
                placeholder="Father Name"
                value={formData.f_name}
                onChange={(e) =>
                  setFormData({ ...formData, f_name: e.target.value })
                }
              />
              <input
                placeholder="Father Occupation"
                value={formData.f_occupation}
                onChange={(e) =>
                  setFormData({ ...formData, f_occupation: e.target.value })
                }
              />
              <input
                placeholder="Father Contact"
                value={formData.f_contact}
                onChange={(e) =>
                  setFormData({ ...formData, f_contact: e.target.value })
                }
              />
              <input
                placeholder="Father Email"
                value={formData.f_email}
                onChange={(e) =>
                  setFormData({ ...formData, f_email: e.target.value })
                }
              />

              {/* Mother */}
              <input
                placeholder="Mother Name"
                value={formData.m_name}
                onChange={(e) =>
                  setFormData({ ...formData, m_name: e.target.value })
                }
              />
              <input
                placeholder="Mother Occupation"
                value={formData.m_occupation}
                onChange={(e) =>
                  setFormData({ ...formData, m_occupation: e.target.value })
                }
              />
              <input
                placeholder="Mother Contact"
                value={formData.m_contact}
                onChange={(e) =>
                  setFormData({ ...formData, m_contact: e.target.value })
                }
              />
              <input
                placeholder="Mother Email"
                value={formData.m_email}
                onChange={(e) =>
                  setFormData({ ...formData, m_email: e.target.value })
                }
              />
            </div>
          </section>

          {/* -------- ADDRESS -------- */}
          <section className="section-general-form">
            <div className="sec-top">
              <p>ADDRESS</p>
            </div>
            <textarea
              value={formData.st_res_address}
              onChange={(e) =>
                setFormData({ ...formData, st_res_address: e.target.value })
              }
            />
            <input
              placeholder="City"
              value={formData.st_res_city}
              onChange={(e) =>
                setFormData({ ...formData, st_res_city: e.target.value })
              }
            />
            <select
              value={formData.st_res_state}
              onChange={(e) =>
                setFormData({ ...formData, st_res_state: e.target.value })
              }
            >
              <option value="">Select State</option>
              {statesOfIndia.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              placeholder="Pin Code"
              value={formData.st_res_pin}
              onChange={(e) =>
                setFormData({ ...formData, st_res_pin: e.target.value })
              }
            />
          </section>

          {/* -------- ACADEMIC -------- */}
          <section className="section-general-form">
            <div className="sec-top">
              <p>ACADEMIC DETAILS</p>
            </div>
            <select
              value={formData.st_class}
              onChange={(e) =>
                setFormData({ ...formData, st_class: e.target.value })
              }
            >
              <option value="">Select Class</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
            <input
              placeholder="School Name"
              value={formData.st_school_name}
              onChange={(e) =>
                setFormData({ ...formData, st_school_name: e.target.value })
              }
            />
            <input
              placeholder="Last Year %"
              value={formData.st_per_last_year}
              onChange={(e) =>
                setFormData({ ...formData, st_per_last_year: e.target.value })
              }
            />
          </section>

          <div className="submit-form">
            <button type="submit">UPDATE STUDENT</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditStudent;
