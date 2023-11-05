import React from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'


const CategoryCard = ({item}) => {
  return (
  <Link to={`/gigs?cat=${item.title}`}>
     <div className='w-full md:w-52 h-80 relative cursor-pointer'>
       <LazyLoadImage src={item.img} alt={item.title} className='h-full w-full object-cover rounded-md' />
       <div className='absolute top-2 left-4 text-white'>
        <h1 className='text-sm'>{item.title}</h1>
        <span className=' font-bold uppercase text-xl'>{item.desc}</span>
       </div>
    </div>
  </Link>
  )
}

export default CategoryCard