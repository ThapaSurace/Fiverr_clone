import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

export function useCountRreview(gigId) {
  return useQuery({
    queryKey: ["gigcount", gigId],
    queryFn: async () =>
     await newRequest
        .get(`/countreview/${gigId}`)
        .then((res) => {
          return res.data;
        }),
  });
}
