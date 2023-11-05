import newRequest from "../../utils/newRequest";
import { useQuery } from '@tanstack/react-query';

export function useGetReportQuery() {
    return useQuery({
      queryKey: ["reports"],
      queryFn: async () =>
        newRequest.get("/reports").then((res) => {
          return res.data;
        }),
    });
  }