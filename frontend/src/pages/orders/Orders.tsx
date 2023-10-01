import serviceProduct from "@/api/rest/actions/products";
import OrderTemplate from "@/components/feat/OrderTemplate";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";

const Products = () => {
  const { isLoading, error, data } = useQuery([EQueryKeys.orders], () =>
    serviceProduct.get()
  );

  if (isLoading) return <p>Loading...</p>;

  if (error || !data) return `Error! ${error}`;

  return (
    <div>
      <div>Orders</div>
      {data.map((o) => (
        <OrderTemplate order={o} key={o.id} />
      ))}
    </div>
  );
};

export default Products;
