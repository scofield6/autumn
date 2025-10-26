import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTableContext } from "./table-context";

export function TablePagination() {
	const { table } = useTableContext();
	const id = useId();
	return (
		<div className="flex items-center justify-between gap-4 pt-2">
			<div className="flex items-center gap-3">
				<Label
					className="max-sm:sr-only text-xs text-muted-foreground"
					htmlFor={id}
				>
					Rows per page
				</Label>
				<Select
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
					value={table.getState().pagination.pageSize.toString()}
				>
					<SelectTrigger
						className="w-fit whitespace-nowrap rounded-lg p-1 text-xs"
						id={id}
					>
						<SelectValue placeholder="Select number of results" />
					</SelectTrigger>
					<SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
						{[5, 10, 25, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={pageSize.toString()}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-sm">
				<p
					aria-live="polite"
					className="flex gap-1 whitespace-nowrap text-muted-foreground text-sm"
				>
					<span className="text-foreground">
						{table.getState().pagination.pageIndex *
							table.getState().pagination.pageSize +
							1}
						-
						{Math.min(
							Math.max(
								table.getState().pagination.pageIndex *
									table.getState().pagination.pageSize +
									table.getState().pagination.pageSize,
								0,
							),
							table.getRowCount(),
						)}
					</span>{" "}
					of
					<span className="text-foreground">
						{table.getRowCount().toString()}
					</span>
				</p>
			</div>

			<div>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<Button
								aria-label="Go to first page"
								className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
								disabled={!table.getCanPreviousPage()}
								onClick={() => table.firstPage()}
								size="iconSmall"
								variant="outline"
							>
								<ChevronFirstIcon aria-hidden="true" size={16} />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								aria-label="Go to previous page"
								className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
								disabled={!table.getCanPreviousPage()}
								onClick={() => table.previousPage()}
								size="iconSmall"
								variant="outline"
							>
								<ChevronLeftIcon aria-hidden="true" size={16} />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								aria-label="Go to next page"
								className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
								disabled={!table.getCanNextPage()}
								onClick={() => table.nextPage()}
								size="iconSmall"
								variant="outline"
							>
								<ChevronRightIcon aria-hidden="true" size={16} />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								aria-label="Go to last page"
								className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
								disabled={!table.getCanNextPage()}
								onClick={() => table.lastPage()}
								size="iconSmall"
								variant="outline"
							>
								<ChevronLastIcon aria-hidden="true" size={16} />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
