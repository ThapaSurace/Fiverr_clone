import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import newRequest from "../../utils/newRequest";
import { userLoginValidation } from "../../utils/yup";
import show from "../../assests/eye_visible.png";
import hide from "../../assests/hide.png";
import { useModal } from "../../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import {RiLoginCircleFill} from "react-icons/ri"
import { Toast } from "../../utils/Toast";

const Login = () => {
  const { isLoading, error, dispatch } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { closeModal, setCurrentContent } = useModal();
  const navigate = useNavigate()
  const onSubmit = async (values) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { data } = await newRequest.post("/auth/login", values);
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      resetForm();
      Toast("User Login Successfully","text-green-400",<RiLoginCircleFill size={30} className="text-green-400" />)
    if(data?.isAdmin || data?.isSeller){
      closeModal();
      navigate("/dashboard")
    }else{
      closeModal();
    }  
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: userLoginValidation,
    onSubmit,
  });

  const tooglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="p-2">
        <h1 className="text-2xl text-darkteal mb-2 font-bold tracking-wide text-center uppercase">Login</h1>
        <div className="mb-6 text-sm">
          <p className="text-center text-stone-500 font-semibold">
            Don"t have an account yet?{" "}
            <span
              className="font-bold text-stone-800 hover:underline cursor-pointer"
              onClick={() => setCurrentContent("register")}
            >
              Register for free
            </span>
          </p>
        </div>
        {error && (
          <div className="bg-maroon w-full p-2 rounded-md">
            <span className="text-white"> {error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              className={`${
                errors.username && touched.username && "border-2 border-maroon"
              } border-x-0 border-t-0 rounded-none focus:ring-0`}
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
            />
            {errors.username && touched.username && (
              <span className="text-maroon">{errors.username}</span>
            )}
          </div>
          
          <div className="mb-6">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold text-white p-2 bg-darkteal cursor-pointer rounded-md disabled:opacity-40"
          >
            login
          </button>
        </form>
    </div>
  );
};

export default Login;
