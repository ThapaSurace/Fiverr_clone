import React, { useState, useMemo } from "react";
import upload from "../../utils/upload";
import { userRegisterValidationSchema } from "../../utils/yup";
import { useFormik } from "formik";
import newRequest from "../../utils/newRequest";
import Loading from "../../utils/loading";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useModal } from "../../context/AuthModalContext";
import show from "../../assests/eye_visible.png";
import hide from "../../assests/hide.png";
import { useMutation } from "@tanstack/react-query";

const Register = () => {
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [showOtpField,setShowOtpField] = useState(false)
  const [otp,setOtp] = useState("")
  const [userEmail,setUserEmail] = useState("")
 

  const tooglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const { setCurrentContent } = useModal();

  const onSubmit = async (values) => {
    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...values,
        img: url,
      });
      setError("");
      setUserEmail(values.email)
      setShowOtpField(true)
  
    } catch (err) {
      setError(err.response.data.error);
      console.log(err.response.data.error);
    }
  };

  const {mutate,loading} = useMutation({
    mutationFn: async (data) => {
      return newRequest.post("/auth/verifyEmail",data)
    },
    onSuccess: () => {
      setCurrentContent("login")
    },
  })

  const submitOtp = () => {
    const otpData = {
      otp,
      email: userEmail
    }
    mutate(otpData)
    console.log(otpData)
  }

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setFieldValue("country", value.label);
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      country: "",
      img: "",
    },
    validationSchema: userRegisterValidationSchema,
    onSubmit,
  });


  return (
   <>
    {
      showOtpField ? (
        <>
         <h1 className="text-2xl font-bold text-center capitalize text-darkteal">verify your email</h1>
         <p className="text-center mt-2 text-sm font-bold text-slate-500">Enter the OTP sent to your email.</p>
         <input type="text" id="otp" name="otp" className="mt-3" value={otp} onChange={(e)=>setOtp(e.target.value)} />
         <div>
         <button disabled={loading} onClick={submitOtp} className="btn bg-teal hover:bg-darkteal text-white mt-2 w-full py-2">
          Verify
          </button>
         </div>
        </>
      ) : (
        <div className="my-1">
        <div className="mb-4 text-sm">
          <h1 className="text-2xl text-darkteal mb-2 font-bold tracking-wide text-center uppercase">
            Create a new account
          </h1>
          <p className="text-center text-stone-500 font-semibold">
            Already have an account?{" "}
            <span 
            className="font-bold text-stone-800 hover:underline cursor-pointer"
            onClick={()=>setCurrentContent("login")}
            >
              {loading ? (
              <>
                <Loading type={"spin"} color={"white"} height={20} width={20} />
                <span>processing</span>
              </>
            ) : (
              "verify"
            )}
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-maroon w-full p-2 rounded-md">
              <span className="text-white"> {error}</span>
            </div>
          )}
          <div className="mb-2 flex flex-col">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              className={`${
                errors.username && touched.username && "border-2 border-maroon"
              } border-x-0 border-t-0 rounded-none focus:ring-0`}
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && touched.username && (
              <span className="text-maroon">{errors.username}</span>
            )}
          </div>
          <div className="mb-4 flex flex-col">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              className={`${
                errors.email && touched.email && "border-2 border-maroon"
              } border-x-0 border-t-0 rounded-none focus:ring-0`}
              onChange={handleChange}
              value={values.email}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <span className="text-maroon">{errors.email}</span>
            )}
          </div>
          <div className="mb-2">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  className={`
                  ${
                    errors.password &&
                    touched.password &&
                    "border-2 border-maroon"
                  } border-x-0 border-t-0 rounded-none focus:ring-0 `}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                />
                <span
                  className="absolute right-1 top-2"
                  onClick={tooglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <span>
                      <img src={show} alt="show" className="w-8 h-8" />
                    </span>
                  ) : (
                    <span>
                      <img src={hide} alt="hide" className="w-8 h-8" />
                    </span>
                  )}
                </span>
              </div>
  
              {errors.password && touched.password && (
                <span className="text-maroon">{errors.password}</span>
              )}
            </div>
  
          <div className="mb-2 flex flex-col">
            <label className="label" htmlFor="profile">
              Upload profile pic
            </label>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="mb-6 flex flex-col">
            <label className="label" htmlFor="country">
              Country
            </label>
            <Select
              classNamePrefix="custom-select"
              options={options}
              onChange={changeHandler}
            />
          </div>
          <button
            disabled={isSubmitting}
            className="h-11 w-full bg-darkteal text-white rounded-md flex justify-center items-center gap-2 disabled:bg-opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loading type={"spin"} color={"white"} height={20} width={20} />
                <span>processing</span>
              </>
            ) : (
              "register"
            )}
          </button>
        </form>
      </div>
      )
    }
   </>
  );
};

export default Register;
