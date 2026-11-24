import { type ReactTable, type RowData } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"
import { formatLabel } from "@/lib/format-label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type DataTableFeatures } from "@/components/data-table/features"

export function DataTableViewOptions<TData extends RowData>({ table }: {table: ReactTable<DataTableFeatures, TData>}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
            return (
              <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} 
                onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                {formatLabel(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
