import React from 'react'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    "Active User": 4000,
  },
  {
    name: 'Feb',
    "Active User": 3000,
  },
  {
    name: 'Mar',
    "Active User": 2000,
  },
  {
    name: 'Apr',
    "Active User": 2780,
  },
  {
    name: 'May',
    "Active User": 1890,
  },
  {
    name: 'jun',
    "Active User": 2390,
  },
  {
    name: 'Jul',
    "Active User": 3490,
  },
  {
    name: 'Aug',
    "Active User": 2780,
  },
  {
    name: 'Sept',
    "Active User": 1890,
  },
  {
    name: 'Nov',
    "Active User": 2390,
  },
  {
    name: 'Dec',
    "Active User": 0,
  },
];
const Chart = () => {
  return (

       <div className='shadow-custom mt-8 p-6'>
        <h1 className='text-xl text-teal font-bold mb-4'>User Analystics</h1>
         <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#002147 " />
          <Line type="monotone" dataKey="Active User" stroke="#002147 " activeDot={{ r: 8 }} />
          <Tooltip />
          <CartesianGrid stroke='#e0dfdd' strokeDasharray='5 5' />
        </LineChart>
      </ResponsiveContainer>
       </div>

  )
}

export default Chart