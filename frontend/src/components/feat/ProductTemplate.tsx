import * as z from "zod";

import useAuth from "@/api/auth/useAuth";
import serviceProduct, {
  ProductSchema,
  ProductUpdateSchema,
  createProductAddToBagSchema,
  productUpdateSchema,
} from "@/api/rest/actions/products";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useBag from "@/pages/products/useBag";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

type Props = {
  product: ProductSchema;
};

const ProductTemplate = ({
  product: { id, description, name, price, image, quantity },
}: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { products, setProductQuantity } = useBag();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: () => serviceProduct.delete(`${id}`),
    onSuccess() {
      navigate(ERoutes.products, { replace: true });
      toast({
        variant: "default",
        title: "Product deleted",
        description: `Product successfully deleted`,
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const { mutate: updateMutation } = useMutation({
    mutationFn: (updateProduct: ProductUpdateSchema) =>
      serviceProduct.update(`${id}`, updateProduct),
    onSuccess() {
      navigate(ERoutes.products, { replace: true });
      toast({
        variant: "default",
        title: "Product updated",
        description: `Product successfully updated`,
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const form = useForm<ProductUpdateSchema>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      description,
      name,
      price,
      quantity,
      image: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof productUpdateSchema>) {
    updateMutation(values);
  }

  const productAddToBagSchema = createProductAddToBagSchema(quantity);
  type ProductAddToBagSchema = z.infer<typeof productAddToBagSchema>;

  const formBag = useForm<ProductAddToBagSchema>({
    resolver: zodResolver(productAddToBagSchema),
    defaultValues: {
      quantity: products[id],
    },
  });

  async function onSubmitBag(values: z.infer<typeof productAddToBagSchema>) {
    const quantityToBag = values.quantity;
    setProductQuantity(id, quantityToBag);
    navigate(ERoutes.products, { replace: true });
    toast({
      variant: "default",
      title: "Added product",
      description: `${quantityToBag} of ${name} added to bag`,
    });
  }

  return (
    <div className="flex gap-10 mb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-96 "
        >
          <div className="flex items-center justify-center">
            <img width={150} height={150} src={image} />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    disabled={user && user.role_name !== "Seller"}
                    placeholder="description"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is product description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={user && user.role_name !== "Seller"}
                    placeholder="name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is product name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    disabled={user && user.role_name !== "Seller"}
                    placeholder="price"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange(value.toFixed(2));
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>This is product price</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    disabled={user && user.role_name !== "Seller"}
                    placeholder="quantity"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Number of available froducts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {user && user.role_name === "Seller" && (
            <>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.currentTarget.files?.[0]) {
                            field.onChange(e.currentTarget.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>This is the product image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="submit" disabled={!form.formState.isDirty}>
                  Update
                </Button>
                <Button type="button" onClick={() => deleteMutation()}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      {user && user.role_name === "Client" && (
        <div className="grid place-items-end">
          <Form {...formBag}>
            <form
              onSubmit={formBag.handleSubmit(onSubmitBag)}
              className="space-y-8 w-96 "
            >
              <p className="text-3xl">
                Add <b>{name}</b> to bag
              </p>
              <FormField
                control={formBag.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to bag</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="quantity"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Quantity you want to order
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    setProductQuantity(id, 0);
                    formBag.reset();
                  }}
                >
                  Remove from Bag
                </Button>
                <Button type="submit">Add to bag</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
export default ProductTemplate;
