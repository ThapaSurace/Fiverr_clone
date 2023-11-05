import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import Loading from "../../utils/loading";


const Success = () => {
    const {search} = useLocation()
    const naviagte = useNavigate()
    const params = new URLSearchParams(search)
    const payment_intent = params.get("payment_intent")

    useEffect(()=>{
      const makeRequest = async () => {
        try {
            await newRequest.put("/orders",{payment_intent})
            setTimeout(()=>{
                naviagte(`/order/requirement/${payment_intent}`)
            },5000)
        } catch (err) {
            console.log(err)
        }
      }
      makeRequest()
    },[naviagte,payment_intent])
    
  return (
    <div className='flex h-screen justify-center items-center border-y border-gray'>
         <Loading type={"bubbles"} color={"#264348 "} height={'20%'} width={'20%'} />
    </div>
  )
}

export default Success