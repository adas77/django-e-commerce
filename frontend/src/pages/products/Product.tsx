import serviceProduct from "@/api/rest/actions/products";
import ProductTemplate from "@/components/feat/ProductTemplate";
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
  return <ProductTemplate product={data} />;
};

export default Product;
