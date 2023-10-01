import { ProductSchema } from "@/api/rest/actions/products";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  product: ProductSchema;
};

const ProductTemplate = ({ product }: Props) => {
  return (
    <div key={product.id}>
      <p>{product.id}</p>
      <p>{product.name}</p>
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <Button>Click me</Button>
      <Link to={`${ERoutes.products}/${product.id}`}>
        <img src={product.thumbnail} />
      </Link>
    </div>
  );
};

export default ProductTemplate;
