import { OrderSchema } from "@/api/rest/actions/orders";

type Props = {
  order: OrderSchema;
};

const OrderTemplate = ({ order }: Props) => {
  return (
    <div key={order.id}>
      <p>{order.id}</p>
    </div>
  );
};

export default OrderTemplate;
