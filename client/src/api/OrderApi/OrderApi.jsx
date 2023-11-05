import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

//get orders
export function useGetOrderQuery() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get("/orders").then((res) => {
        return res.data;
      }),
  });
}

//get single order
export function useGetSingleOrderQuery(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      newRequest.get(`/order/${id}`).then((res) => {
        return res.data;
      }),
  });
}

//compare income compared to last month
export function useCompareIncomeQuery() {
  return useQuery({
    queryKey: ["income"],
    queryFn: async () =>
      newRequest.get("/compareincome").then((res) => {
        return res.data;
      }),
  });
}

//compare number of incomes compared to last month
export function useCompareOrderQuery() {
  return useQuery({
    queryKey: ["ordernumbers"],
    queryFn: async () =>
      newRequest.get("/noOfOrder").then((res) => {
        return res.data;
      }),
  });
}


//get orders total income
export function useTotalIncomeQuery() {
  return useQuery({
    queryKey: ["totalincomes"],
    queryFn: () =>
      newRequest.get("/totalincome").then((res) => {
        return res.data;
      }),
  });
}


//get remaning number of orders and icome of that orders
export function useRemaningOrderQuery() {
  return useQuery({
    queryKey: ["remaningsorder"],
    queryFn: () =>
      newRequest.get("/remaningorders").then((res) => {
        return res.data;
      }),
  });
}