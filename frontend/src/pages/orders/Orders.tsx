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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import useAuth from "@/api/auth/useAuth";
import serviceOrder, {
  OrderSchema,
  orderSchemaValidator,
} from "@/api/rest/actions/orders";
import { useToast } from "@/components/ui/use-toast";
import Center from "@/routing/abstract/Center";
import { ERoutes } from "@/routing/routes/Routes.enum";
import useBag from "../products/useBag";

const Orders = () => {
  const { toast } = useToast();
  const { products, resetProducts } = useBag();
  const {
    user: { first_name, last_name },
  } = useAuth();
  const orderItems = Object.entries(products).map(([productId, quantity]) => ({
    product: parseInt(productId),
    quantity,
  }));

  const { mutate: makeOrderMutate, isLoading } = useMutation({
    mutationFn: async (order: OrderSchema) => {
      return serviceOrder.make(order);
    },
    onSuccess() {
      toast({
        title: "You make an order",
        description: "You order was successfully registered.",
      });
      resetProducts();
    },
    onError() {
      if (form) {
        form.reset();
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Can't make an order",
        description:
          "There was a problem with your request. Check your bag and try again.",
      });
    },
    onMutate() {
      form.reset();
    },
  });

  const form = useForm<OrderSchema>({
    resolver: zodResolver(orderSchemaValidator),
    defaultValues: {
      delivery_address: "",
      first_name: first_name,
      last_name: last_name,
      order_items: orderItems,
    },
  });

  async function onSubmit(values: OrderSchema) {
    makeOrderMutate(values);
  }

  return (
    <Center className="mt-32">
      <div className="grid grid-cols-2 gap-24">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-96"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery address</FormLabel>
                  <FormControl>
                    <Input placeholder="first name" {...field} />
                  </FormControl>
                  <FormDescription>This is your first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lasst name</FormLabel>
                  <FormControl>
                    <Input placeholder="last name" {...field} />
                  </FormControl>
                  <FormDescription>This is your last name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delivery_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery address</FormLabel>
                  <FormControl>
                    <Input placeholder="delivery address" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your delivery address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                disabled={orderItems.length <= 0}
                onClick={() => {
                  resetProducts();
                }}
              >
                Reset Bag
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || orderItems.length <= 0 || isLoading
                }
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
        {orderItems.length > 0 ? (
          <Table>
            <TableCaption>A list of your products in your bag </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((i) => (
                <TableRow key={i.product}>
                  <TableCell>
                    <a href={`${ERoutes.products}/${i.product}`}>{i.product}</a>
                  </TableCell>
                  <TableCell>{i.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>
            <p className="text-3xl mb-4">Empty bag</p>
            <p className="text-2xl">
              Go{" "}
              <a href={ERoutes.products}>
                <b>here</b>
              </a>{" "}
              and add some products to bag
            </p>
          </div>
        )}
      </div>
    </Center>
  );
};
export default Orders;
