import { z } from "zod";
import restClient from "..";

const orderItemsValidator = z.object({
  product: z.number().positive(),
  quantity: z.number().positive(),
});

export const orderSchemaValidator = z.object({
  delivery_address: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  order_items: z
    .array(orderItemsValidator)
    .nonempty({ message: "No products in bag" }),
});

export type OrderSchema = z.infer<typeof orderSchemaValidator>;
export type OrderItemsSchema = z.infer<typeof orderItemsValidator>;

const serviceOrder = {
  async make(order: OrderSchema): Promise<OrderSchema> {
    const res = (await restClient.post(`/order/`, order)).data;
    const product = orderSchemaValidator.parse(res);
    return product;
  },
};

export default serviceOrder;
