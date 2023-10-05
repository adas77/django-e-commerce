import useAuth from "@/api/auth/useAuth";
import serviceProduct from "@/api/rest/actions/products";
import ProductTemplate from "@/components/feat/ProductTemplate";
import Center from "@/routing/abstract/Center";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Product = () => {
  const { productId } = useParams();
  const { isLoading, error, data } = useQuery([EQueryKeys.products], () =>
    serviceProduct.getByID(productId!)
  );

  if (isLoading) return <p>Loading...</p>;

  if (error || !data) return `Error! ${error}`;
  return (
    <Center className="mt-24">
      <ProductTemplate product={data} />
    </Center>
  );
};

export default Product;
