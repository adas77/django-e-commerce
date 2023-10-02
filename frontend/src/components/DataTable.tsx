import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGINATION } from "@/consts";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
export type Filter = {
  key: "name" | "category" | "description" | "price";
  value: string;
  setValue?: (value: Filter) => void;
};

export type Sorting = {
  key: "name" | "price" | "category";
  asc: boolean;
};

type Pagination = {
  offset: number;
  setOffset: (value: number) => void;
  prev: string | null;
  next: string | null;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: Pagination;
  filter: Filter;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination: { offset, setOffset, prev, next },
  filter: { key, value, setValue },
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Input
          type={key === "price" ? "number" : "text"}
          placeholder={`Filter by ${key}...`}
          value={value}
          onChange={(event) =>
            setValue && setValue({ key: key, value: event.target.value })
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter key</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["name", "category", "description", "price"].map((label) => (
              <DropdownMenuCheckboxItem
                key={label}
                checked={value === label}
                onCheckedChange={() =>
                  setValue && setValue({ key: label, value: value })
                }
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOffset(offset - PAGINATION.offset)}
          disabled={prev === null}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOffset(offset + PAGINATION.offset)}
          disabled={next === null}
        >
          Next
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
