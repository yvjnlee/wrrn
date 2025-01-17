"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "../types";
import { TransactionDrawer } from "./transaction-drawer";
import { deleteTransaction } from "./actions";

interface TransactionTableProps {
  data: Transaction[] | null;
}

export function TransactionTable({ data }: TransactionTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<string | null>(null);

  const handleDeleteSelected = async () => {
    const selectedRowIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    const selectedTransactions = selectedRowIds.map((id) =>
      table.getRow(id)?.original?.id
    );
  
    if (selectedTransactions.length > 0) {
      for (const transaction of selectedTransactions) { // Corrected loop
        await deleteTransaction(transaction); // Call the delete function
      }
      window.location.reload(); // Reload to reflect the changes
    }
  };  

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center h-full">
          <Checkbox
            checked={row.getIsSelected()}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4">{new Date(row.getValue("date")).toLocaleDateString()}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="truncate ml-4">{row.getValue("description")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const textColor = row.getValue("type") === "INCOME" ? "text-green-600" : "text-red-600";
        return (
          <div className={`capitalize rounded-md inline-block bg-opacity-90 ${textColor}`}>
            {String(row.getValue("type")).toLowerCase()}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
        }).format(amount);
        return <div className="ml-4 font-medium w-full">{formatted}</div>;
      },
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: React.useCallback(setSorting, []),
    onColumnFiltersChange: React.useCallback(setColumnFilters, []),
    onColumnVisibilityChange: React.useCallback(setColumnVisibility, []),
    onRowSelectionChange: React.useCallback(setRowSelection, []),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter transactions..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Container for Columns and Delete buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns <ChevronDown /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => setIsDrawerOpen(row.original.id)}
                    className="cursor-pointer"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={
                          cell.column.id === "select" ? (e) => e.stopPropagation() : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <TransactionDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </>
  );
}
