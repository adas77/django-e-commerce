import { z } from "zod";
import restClient from "..";

const productSchemaValidator = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string().url(),
  thumbnail: z.string().url(),
  category: z.number(),
});

export type ProductSchema = z.infer<typeof productSchemaValidator>;

const serviceProduct = {
  async get(): Promise<ProductSchema[]> {
    // const trimLimit = limit > 10 || limit < 1 ? 5 : limit;
    // const res = (await restClient.get(`/search?limit=${trimLimit}`)).data;
    const res = (await restClient.get(`/product`)).data;
    const products = z.array(productSchemaValidator).parse(res);
    return products;
  },

  async getByID(id: string): Promise<ProductSchema> {
    const res = (await restClient.get(`/product/${id}`)).data;
    const product = productSchemaValidator.parse(res);
    return product;
  },
};

export default serviceProduct;
