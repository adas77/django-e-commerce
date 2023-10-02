import { z } from "zod";
import restClient from "..";
import { PAGINATION } from "@/consts";
import { Filter, Sorting } from "@/components/DataTable";
import { AxiosResponse } from "axios";

const productSchemaValidator = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string().url(),
  thumbnail: z.string().url(),
  category: z.string(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 character.",
  }),
  price: z.number().positive({
    message: "Price must be positive number.",
  }),
});

const requestSchemaValidator = z.object({
  count: z.number(),
  next: z.union([z.string(), z.null()]),
  previous: z.union([z.string(), z.null()]),
  results: z.array(productSchemaValidator),
});

export type ProductSchema = z.infer<typeof productSchemaValidator>;
export type RequestSchema = z.infer<typeof requestSchemaValidator>;
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;

const serviceProduct = {
  async get(
    offset: number,
    filter: Filter = { key: "name", value: "" },
    sorting: Sorting = { key: "name", asc: true },
    limit = PAGINATION.limit
  ): Promise<RequestSchema> {
    const res = (
      await restClient.get(
        `/product/?limit=${limit}&offset=${offset}&${filter.key}=${
          filter.value
        }&ordering=${sorting.asc ? "" : "-"}${sorting.key}`
      )
    ).data;
    const req = requestSchemaValidator.parse(res);
    return req;
  },

  async getByID(id: string): Promise<ProductSchema> {
    const res = (await restClient.get(`/product/${id}`)).data;
    const product = productSchemaValidator.parse(res);
    return product;
  },

  async delete(id: string): Promise<AxiosResponse> {
    const res = await restClient.delete(`/product/${id}/`);
    return res;
  },

  async update(
    id: string,
    updateProduct: ProductUpdateSchema
  ): Promise<AxiosResponse> {
    const res = await restClient.patch(`/product/${id}/`, updateProduct);
    return res;
  },
};

export default serviceProduct;
