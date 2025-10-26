import { flexRender } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	TableBody as ShadcnTableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import SmallSpinner from "../SmallSpinner";
import { useTableContext } from "./table-context";

export const TableRowDropdownMenu = () => {
	const { dropdownMenuItems } = useTableContext();
	if (!dropdownMenuItems) return null;
	return (
		<TableCell className="p-1 w-[50px]">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="p-0 size-4">
						<EllipsisVertical size={16} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{dropdownMenuItems.map((item) => item)}
				</DropdownMenuContent>
			</DropdownMenu>
		</TableCell>
	);
};

export function TableBody() {
	const {
		table,
		numberOfColumns,
		enableSelection,
		dropdownMenuItems,
		isLoading,
	} = useTableContext();
	const rows = table.getRowModel().rows;
	const hasDropdownMenuItems = !!dropdownMenuItems;
	const numberOfColumnsWithDropdownMenuItems =
		numberOfColumns + (hasDropdownMenuItems ? 1 : 0);

	if (!rows.length) {
		return (
			<ShadcnTableBody>
				<TableRow>
					<TableCell
						className="h-24 text-center"
						colSpan={numberOfColumnsWithDropdownMenuItems}
					>
						{isLoading ? (
							<div className="flex justify-center items-center">
								<SmallSpinner />
							</div>
						) : (
							"No results"
						)}
					</TableCell>
				</TableRow>
			</ShadcnTableBody>
		);
	}

	return (
		<ShadcnTableBody>
			{rows.map((row) => (
				<TableRow
					className="h-14 hover:bg-muted/50"
					data-state={row.getIsSelected() && "selected"}
					key={row.id}
				>
					{enableSelection && (
						<TableCell className="w-[50px]">
							<Checkbox
								aria-label="Select row"
								checked={row.getIsSelected()}
								onCheckedChange={(checked) => row.toggleSelected(!!checked)}
							/>
						</TableCell>
					)}
					{row.getVisibleCells().map((cell, index) => (
						<TableCell
							className={cn("px-2 h-4", index === 0 && "pl-4")}
							key={cell.id}
						>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
					))}
					<TableRowDropdownMenu />
				</TableRow>
			))}
		</ShadcnTableBody>
	);
}
