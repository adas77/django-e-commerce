import { z } from "zod";
import restClient from "..";
import { IMAGE, PAGINATION } from "@/consts";
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
  price: z.string().min(1, {
    message: "Price must be positive number.",
  }),
  image: z
    .any()
    .optional()
    .refine(
      (file) => file.size <= IMAGE.max_file_size,
      `Max image size is ${IMAGE.max_file_size}.`
    )
    .refine(
      (file) => IMAGE.accepted_image_types.includes(file.type),
      `Only ${IMAGE.accepted_image_types.join(", ")} formats are supported.`
    ),
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
    console.log("updateProduct", updateProduct);
    const formData = new FormData();
    formData.append("name", updateProduct.name);
    formData.append("description", updateProduct.description);
    formData.append("price", updateProduct.price);

    formData.append("image", updateProduct.image);
    const res = await restClient.patch(`/product/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  },
};

export default serviceProduct;
