import serviceOrder from "@/api/rest/actions/orders";
import OrderTemplate from "@/components/feat/OrderTemplate";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Order = () => {
  const { orderId } = useParams();
  const { isLoading, error, data } = useQuery([EQueryKeys.orders], () =>
    serviceOrder.getByID(orderId!)
  );

  if (isLoading) return <p>Loading...</p>;

  if (error || !data) return `Error! ${error}`;
  return <OrderTemplate order={data} />;
};

export default Order;
