import serviceProduct from "@/api/rest/actions/products";
import { Calendar } from "@/components/ui/calendar";
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
import Center from "@/routing/abstract/Center";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const ProductsStats = () => {
  const currentMonth = new Date().getMonth();
  const DATE_START = new Date(2023, currentMonth, 1);
  const DATE_STOP = new Date(2023, currentMonth, 28);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(DATE_START);
  const [dateTo, setDateTo] = useState<Date | undefined>(DATE_STOP);
  const [numProducts, setNumProducts] = useState(6);

  const { data } = useQuery({
    queryKey: [EQueryKeys.products_stats, dateFrom, dateTo, numProducts],
    queryFn: () =>
      serviceProduct.getStats({
        date_from: dateFrom || DATE_START,
        date_to: dateTo || DATE_STOP,
        num_products: numProducts,
      }),
  });

  return (
    <Center className="mt-20">
      <div className="flex gap-20">
        <div>
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={setDateFrom}
            className="rounded-md border"
          />
        </div>
        <div>
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={setDateTo}
            className="rounded-md border"
          />
        </div>
        <div>
          <label htmlFor="numProducts">Number of Products</label>
          <Input
            className="mt-2"
            type="number"
            id="numProducts"
            value={numProducts}
            onChange={(e) => setNumProducts(e.currentTarget.valueAsNumber)}
          />
        </div>
      </div>
      <Center className="mt-12">
        {data && (
          <Table className="w-80">
            <TableCaption>A list of most frequent ordered items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Total quantity ordered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.product_id}>
                  <TableCell>
                    <a href={`${ERoutes.products}/${d.product_id}`}>
                      {d.product_id}
                    </a>
                  </TableCell>
                  <TableCell>{d.total_quantity_ordered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Center>
    </Center>
  );
};

export default ProductsStats;
