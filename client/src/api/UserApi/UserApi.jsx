import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

//get users
export function useGetAllUsers(userType) {
  return useQuery({
    queryKey: ["allusers", userType],
    queryFn: async () =>
      newRequest
        .get(`/users${userType ? `?userType=${userType}` : ""}`)
        .then((res) => {
          return res.data;
        }),
  });
}

//get single user
export function useSingleUserQuery(userId) {
  return useQuery({
    queryKey: [userId],
    queryFn: () =>
      newRequest.get(`/user/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });
}

//compare user to previous month
export function useCompareUserQuery() {
  return useQuery({
    queryKey: ["usernumbers"],
    queryFn: async () =>
      newRequest.get("/compareusercount").then((res) => {
        return res.data;
      }),
  });
}

