import React from 'react'
import {GiCardboardBox} from "react-icons/gi"

const NoItemsFound = () => {
  return (
    <div className="h-[60vh] flex justify-center items-center">
    <div className="flex flex-col gap-2 items-center">
    <GiCardboardBox className="text-[200px] text-primary" />
    <span className="text-3xl text-[#008b8b] font-bold tracking-wide">No items found !</span>
    </div>
  </div>
  )
}

export default NoItemsFound