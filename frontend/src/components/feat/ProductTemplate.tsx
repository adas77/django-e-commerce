import * as z from "zod";

import serviceProduct, {
  ProductSchema,
  ProductUpdateSchema,
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
  product: { id, description, name, price },
}: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: () => serviceProduct.delete(`${id}`),
    onSuccess() {
      navigate(ERoutes.products, { replace: true });
      toast({
        variant: "default",
        title: "Product deleted",
        description: `Product successfully deleted`,
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
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
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const form = useForm<ProductUpdateSchema>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      description,
      name,
      price: 43,
    },
  });
  async function onSubmit(values: z.infer<typeof productUpdateSchema>) {
    updateMutation(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
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
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>This is product name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit">Update</Button>
          <Button type="button" onClick={() => deleteMutation()}>
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ProductTemplate;
