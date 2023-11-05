import React from 'react'
import { useGetReportQuery } from '../../api/ReportApi/ReportApi'
import DashboardLayout from "../../utils/DashboardLayout";
import ReportLists from '../../components/Dashboard/ReportList';

const ReportList = () => {
    const {data,isLoading,error} = useGetReportQuery()
  return (
    <DashboardLayout>
     <h1 className="text-xl mb-6 text-teal font-bold text-center">
        Report Lists
      </h1>
      {isLoading ? (
        "loading..."
      ) : error ? (
        "Something went wrong!!"
      ) : (
       <ReportLists data={data} />
      )}
     </DashboardLayout>
  )
}

export default ReportList