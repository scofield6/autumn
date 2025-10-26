import type { FullCusProduct } from "@autumn/shared";
import type { Row } from "@tanstack/react-table";
import CopyButton from "@/components/general/CopyButton";
import { formatUnixToDateTimeString } from "@/utils/formatUtils/formatDateUtils";
import { CustomerProductsStatus } from "./CustomerProductsStatus";

export const CustomerProductsTableColumns = [
	{
		header: "Name",
		accessorKey: "name",
		cell: ({ row }: { row: Row<FullCusProduct> }) => {
			return <div className="font-semibold">{row.original.product.name}</div>;
		},
	},
	{
		header: "ID",
		accessorKey: "id",
		cell: ({ row }: { row: Row<FullCusProduct> }) => {
			return (
				<div className="font-mono">
					{row.original.id ? (
						<CopyButton
							text={row.original.id || ""}
							className="bg-transparent text-t3 border-none px-1 shadow-none max-w-full"
						>
							<span className="truncate">{row.original.id}</span>
						</CopyButton>
					) : (
						<span className="px-1 text-t3">NULL</span>
					)}
				</div>
			);
		},
	},
	{
		header: "Stauts",
		accessorKey: "status",
		cell: ({ row }: { row: Row<FullCusProduct> }) => {
			return <CustomerProductsStatus status={row.original.status} />;
		},
	},
	{
		header: "Created At",
		accessorKey: "created_at",
		cell: ({ row }: { row: Row<FullCusProduct> }) => {
			return <div>{formatUnixToDateTimeString(row.original.created_at)}</div>;
		},
	},
];
