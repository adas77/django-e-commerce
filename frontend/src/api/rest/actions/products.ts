import { Filter, Sorting } from "@/components/DataTable";
import { IMAGE, PAGINATION } from "@/consts";
import { AxiosResponse } from "axios";
import { z } from "zod";
import restClient from "..";

const productSchemaValidator = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string().url(),
  thumbnail: z.string().url(),
  category: z.string(),
  quantity: z.number(),
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
  quantity: z.number().positive({
    message: "Quantity must be positive number.",
  }),
  image: z.optional(
    z
      .any()
      .refine(
        (file) => file.size <= IMAGE.max_file_size,
        `Max image size is ${IMAGE.max_file_size}.`
      )
      .refine(
        (file) => IMAGE.accepted_image_types.includes(file.type),
        `Only ${IMAGE.accepted_image_types.join(", ")} formats are supported.`
      )
  ),
});

export const createProductAddToBagSchema = (quantityAvailable: number) =>
  z.object({
    quantity: z
      .number()
      .min(1)
      .max(quantityAvailable, {
        message: `Should be between 0-${quantityAvailable}`,
      }),
  });

const requestSchemaValidator = z.object({
  count: z.number(),
  next: z.union([z.string(), z.null()]),
  previous: z.union([z.string(), z.null()]),
  results: z.array(productSchemaValidator),
});

const formatDate = (date: Date) => {
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date`);
  }

  const dateString = date.toISOString().slice(0, 10);
  return dateString;
};

const isValidDate = (date: Date) => {
  const dateString = formatDate(date);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateString);
};

const statsRequestSchemaValidator = z.object({
  date_from: z.date().refine(isValidDate, {
    message: "Invalid date format. Use yyyy-mm-dd.",
  }),
  date_to: z.date().refine(isValidDate, {
    message: "Invalid date format. Use yyyy-mm-dd.",
  }),
  num_products: z.number(),
});

const statsResponseSchemaValidator = z.object({
  product_id: z.number(),
  total_quantity_ordered: z.number(),
});

export type ProductSchema = z.infer<typeof productSchemaValidator>;
export type RequestSchema = z.infer<typeof requestSchemaValidator>;
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;
export type StatsRequestSchema = z.infer<typeof statsRequestSchemaValidator>;
export type StatsResponseSchema = z.infer<typeof statsResponseSchemaValidator>;

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
    const formData = new FormData();
    formData.append("name", updateProduct.name);
    formData.append("description", updateProduct.description);
    formData.append("price", updateProduct.price);
    if (updateProduct.image) {
      formData.append("image", updateProduct.image);
    }
    const res = await restClient.patch(`/product/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  },

  async getStats(data: StatsRequestSchema): Promise<StatsResponseSchema[]> {
    const date_from = formatDate(data.date_from);
    const date_to = formatDate(data.date_to);

    const res = (
      await restClient.get(
        `/order/stats/?date_from=${date_from}&date_to=${date_to}&num_products=${data.num_products}`
      )
    ).data;
    const products = z.array(statsResponseSchemaValidator).parse(res);
    return products;
  },
};

export default serviceProduct;
