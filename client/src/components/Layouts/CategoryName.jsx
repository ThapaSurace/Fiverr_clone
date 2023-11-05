import React from 'react'
import { cats } from '../../data'
import { Link } from 'react-router-dom'

const CategoryName = () => {
  return (
   <div className='border-b-[0.2px] border-stone-400 py-2 px-1 md:px-0  bg-white'>
     <div className=' max-w-6xl mx-auto flex gap-2 justify-between'>
        {
          cats?.map(cat=>(
            <Link to={`/gigs?cat=${cat.title}`}>
            <span key={cat.id} className='font-bold text-stone-400 cursor-pointer text-sm hover:text-stone-500'>{cat.title}</span>
            </Link>
          ))
        }
    </div>
   </div>
  )
}

export default CategoryName