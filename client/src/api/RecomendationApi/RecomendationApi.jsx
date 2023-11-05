import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

export function useGetUserRecomendationQuery(id) {
  return useQuery({
    queryKey: ["recomm"],
    queryFn: async () => {
      if(id) {
        return await newRequest.get(`/userrecomm/${id}`);
      }else {
        return []
      }
    },
    enabled: !!id,
  });
}

export function useGetItemRecomendationQuery(gigId, user) {
  return useQuery({
    queryKey: [gigId],
    queryFn: async () => {
      if (user) {
        const response = await newRequest.get(`/itemrecomendations/${gigId}`);
        return response.data;
      } else {
        return [];
      }
    },
    enabled: !!user, // Fetch recommendations only if there is a user
  });
}
