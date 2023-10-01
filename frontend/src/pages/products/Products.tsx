import serviceProduct from "@/api/rest/actions/products";
import ProductTemplate from "@/components/feat/ProductTemplate";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";

const Products = () => {
  const { isLoading, error, data } = useQuery([EQueryKeys.products], () =>
    serviceProduct.get()
  );

  if (isLoading) return <p>Loading...</p>;

  if (error || !data) return `Error! ${error}`;

  return (
    <div>
      <div>Products</div>
      {data.map((p) => (
        <ProductTemplate product={p} key={p.id} />
      ))}
    </div>
  );
};

export default Products;
