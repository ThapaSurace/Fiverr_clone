import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

export function useSingleGigQuery(id) {
  return useQuery({
    queryKey: ["singlegig"],
    queryFn: async () =>
     await newRequest.get(`/gig/single/${id}`).then((res) => {
        return res.data;
      }),
  });
}

export function useRelatedGigsQuery(id) {
  return useQuery({
    queryKey: ["relatedgig"],
    queryFn: async () =>
     await newRequest.get(`/relatedgigs/${id}`).then((res) => {
        return res.data;
      }),
  });
}

export function useWishlistGigsQuery(user) {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      if (user) {
        const response = await newRequest.get(`/wishlists`);
        return response.data;
      } else {
        return [];
      }
    },
    enabled: !!user,
  });
}
