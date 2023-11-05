import newRequest from "../../utils/newRequest";
import { useQuery } from '@tanstack/react-query';

export function useGetConservationQuery() {
   return useQuery({
        queryKey: ["conversations"],
        queryFn: () =>
          newRequest.get("/conversations").then((res) => {
            return res.data;
          }),
      });
  }