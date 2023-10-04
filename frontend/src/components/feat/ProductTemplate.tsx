import * as z from "zod";

import { UserRole } from "@/api/auth/authStorage";
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
import Center from "@/routing/abstract/Center";

type Props = {
  product: ProductSchema;
  role: UserRole;
};

const ProductTemplate = ({
  product: { id, description, name, price, image, quantity },
  role,
}: Props) => {
  // TODO: as client add product of quantity, validate quantity
  const { toast } = useToast();
  const { setProductQuantity } = useBag();
  const navigate = useNavigate();

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
      quantity: 0,
    },
  });

  async function onSubmitBag(values: z.infer<typeof productAddToBagSchema>) {
    const quantityToBag = values.quantity;
    setProductQuantity(id, quantityToBag);
    toast({
      variant: "default",
      title: "Added product",
      description: `${quantityToBag} of ${name} added to bag`,
    });
  }

  return (
    <div className="flex gap-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
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
                    disabled={role !== "Seller"}
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
                    disabled={role !== "Seller"}
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
                    disabled={role !== "Seller"}
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
                    disabled={role !== "Seller"}
                    placeholder="quantity"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Number of available froducts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {role === "Seller" && (
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

      {role === "Client" && (
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
