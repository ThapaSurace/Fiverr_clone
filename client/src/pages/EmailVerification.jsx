import React, {useState} from 'react'
import { useMutation } from "@tanstack/react-query";
import newRequest from '../utils/newRequest';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [showOtpField,setShowOtpField] = useState(false)
    const [otp,setOtp] = useState("")
    const [userEmail,setUserEmail] = useState("")

    const navigate = useNavigate()
   
    const {mutate,loading} = useMutation({
        mutationFn: async (data) => {
          return newRequest.post("/auth/verifyEmail",data)
        },
        onSuccess: () => {
          navigate("/")
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
    
  return (
    <div className='h-[100vh] flex justify-center items-center'>
         <div className='max-w-xl mx-auto'>
         <h1 className="text-2xl font-bold text-center capitalize text-darkteal">verify your email</h1>
         <p className="text-center mt-2 text-sm font-bold text-slate-500">Enter the OTP sent to your email.</p>
         <input type="text" id="otp" name="otp" className="mt-3" placeholder='Enter your email' value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} />
         <input type="text" id="otp" name="otp" className="mt-3" placeholder='Enter the otp code' value={otp} onChange={(e)=>setOtp(e.target.value)} />
         <div>
         <button disabled={loading} onClick={submitOtp} className="btn bg-teal hover:bg-darkteal text-white mt-2 w-full py-2">
          Verify
          </button>
         </div>
         </div>
    </div>
  )
}

export default EmailVerification