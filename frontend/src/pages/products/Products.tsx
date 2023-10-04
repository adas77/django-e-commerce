import serviceProduct, { ProductSchema } from "@/api/rest/actions/products";
import { DataTable, Filter, Sorting } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ERoutes } from "@/routing/routes/Routes.enum";
import { EQueryKeys } from "@/utils/queryClient/QueryKeys.enum";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
const Products = () => {
  const [offset, setOffset] = useState(0);
  const [sorting, setSorting] = useState<Sorting>({ key: "name", asc: true });
  const [filter, setFilter] = useState<Filter>({ key: "name", value: "" });

  const columns: ColumnDef<ProductSchema>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => (
        <Link to={`${ERoutes.products}/${row.getValue("id")}`}>
          <img width={50} height={50} src={row.getValue("thumbnail")} />
        </Link>
      ),
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => setSorting({ key: "name", asc: !sorting.asc })}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "price",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => setSorting({ key: "price", asc: !sorting.asc })}
          >
            Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      accessorKey: "category",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => setSorting({ key: "category", asc: !sorting.asc })}
          >
            Category
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const { isLoading, error, data } = useQuery({
    queryKey: [EQueryKeys.products, offset, filter, sorting],
    queryFn: () => serviceProduct.get(offset, filter, sorting),
    keepPreviousData: true,
  });
  if (isLoading) return <p>Loading...</p>;

  if (error || !data) return `Error! ${error}`;

  return (
    <div className="container mx-auto py-10 mt-0">
      <DataTable
        columns={columns}
        data={data.results}
        pagination={{
          offset,
          setOffset,
          prev: data.previous,
          next: data.next,
        }}
        filter={{
          key: filter.key,
          value: filter.value,
          setValue: setFilter,
        }}
      />
    </div>
  );
};

export default Products;
