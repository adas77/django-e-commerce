import { z } from "zod";
import restClient from "..";

// TODO
const orderSchemaValidator = z.object({
  id: z.number(),
  //   name: z.string(),
  //   description: z.string(),
  //   price: z.number(),
  //   image: z.string().url(),
  //   thumbnail: z.string().url(),
  //   category: z.number(),
});

export type OrderSchema = z.infer<typeof orderSchemaValidator>;

const serviceOrder = {
  async get(): Promise<OrderSchema[]> {
    // const trimLimit = limit > 10 || limit < 1 ? 5 : limit;
    // const res = (await restClient.get(`/search?limit=${trimLimit}`)).data;
    const res = (await restClient.get(`/order/stats`)).data;
    const products = z.array(orderSchemaValidator).parse(res);
    return products;
  },

  async getByID(id: string): Promise<OrderSchema> {
    const res = (await restClient.get(`/order/${id}`)).data;
    const product = orderSchemaValidator.parse(res);
    return product;
  },
};

export default serviceOrder;
