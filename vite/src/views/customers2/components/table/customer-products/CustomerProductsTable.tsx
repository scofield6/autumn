import { PlusIcon } from "@phosphor-icons/react";
import {
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Delete } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Table } from "@/components/general/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/v2/buttons/Button";
import { useCusQuery } from "@/views/customers/customer/hooks/useCusQuery";
import { useFullCusSearchQuery } from "@/views/customers/hooks/useFullCusSearchQuery";
import { useSavedViewsQuery } from "@/views/customers/hooks/useSavedViewsQuery";
import { CustomerProductsTableColumns } from "./CustomerProductsTableColumns";
import { filterCustomerProducts } from "./customerProductsTableFilters";
import { ShowExpiredActionButton } from "./ShowExpiredActionButton";

export function CustomerProductsTable() {
	const { customer, isLoading } = useCusQuery();

	const [showExpired, setShowExpired] = useQueryState(
		"customerProductsShowExpired",
		parseAsBoolean.withDefault(true),
	);

	useSavedViewsQuery();
	useFullCusSearchQuery();

	const filteredCustomers = useMemo(
		() =>
			filterCustomerProducts({
				customer,
				showExpired: showExpired ?? true,
			}),
		[customer, showExpired],
	);

	const attachedProductsTableColumns = useMemo(
		() => CustomerProductsTableColumns,
		[],
	);

	const enableSorting = false;
	const table = useReactTable({
		data: filteredCustomers,
		columns: attachedProductsTableColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: "includesString",
		enableGlobalFilter: true,
		enableSorting,
		meta: {
			filterCustomerProducts,
		},
	});

	const dropdownMenuItems = useMemo(() => {
		return [
			<DropdownMenuItem
				key="delete"
				className="flex items-center gap-2 text-xs text-red-500"
				onClick={() => {
					console.log("delete");
				}}
			>
				<Delete size={16} /> Delete
			</DropdownMenuItem>,
		];
	}, []);

	return (
		<Table.Provider
			config={{
				table,
				numberOfColumns: attachedProductsTableColumns.length,
				enableSorting,
				dropdownMenuItems,
				isLoading,
			}}
		>
			<Table.Container>
				<Table.Toolbar>
					<Table.Heading>Attached Products</Table.Heading>
					<Table.Actions>
						<ShowExpiredActionButton
							showExpired={showExpired}
							setShowExpired={setShowExpired}
						/>
						<Button>
							<PlusIcon />
							Attach Product
						</Button>
					</Table.Actions>
				</Table.Toolbar>
				<Table.Content>
					<Table.Header />
					<Table.Body />
				</Table.Content>
			</Table.Container>
		</Table.Provider>
	);
}
