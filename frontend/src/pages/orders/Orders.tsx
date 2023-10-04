import useAuth from "@/api/auth/useAuth";
import serviceOrder, {
  OrderSchema,
  orderSchemaValidator,
} from "@/api/rest/actions/orders";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, useForm } from "react-hook-form";
import useBag from "../products/useBag";
const Products = () => {
  const { products } = useBag();
  const { data: sessionData } = useAuth();
  const { mutate: orderMutate, isLoading } = useMutation({
    mutationFn: (order: OrderSchema) => serviceOrder.make(order),
  });
  // FIXME
  const form = useForm<OrderSchema>({
    resolver: zodResolver(orderSchemaValidator),
    defaultValues: {
      // first_name: sessionData?.first_name || "",
      // last_name: sessionData?.last_name || "",
      // delivery_address: "",
      // order_items: undefined,
      first_name: "ddd",
      last_name: "dddd",
      delivery_address: "sssss",
      // order_items: undefined,
    },
  });
  async function onSubmit(values: OrderSchema) {
    orderMutate(values);
  }
  return (
    <div>
      {/* <div>Orders</div>
      {Object.entries(products).map((p) => (
        <div key={p[0]}>
          <p>
            {p[0]} - {p[1]}{" "}
          </p>
        </div>
      ))} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
          <FormField
            control={form.control}
            name="delivery_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="delivery_address" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="last_name" {...field} />
                </FormControl>
                <FormDescription>Your last name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delivery_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="dealivery address" {...field} />
                </FormControl>
                <FormDescription>Your address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button disabled={isLoading} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Products;
