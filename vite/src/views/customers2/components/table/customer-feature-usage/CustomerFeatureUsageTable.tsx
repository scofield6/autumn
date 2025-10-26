import type { FullCusProduct, FullCustomerEntitlement } from "@autumn/shared";
import { FeatureType } from "@autumn/shared";
import {
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Table } from "@/components/general/table";
import { useCusQuery } from "@/views/customers/customer/hooks/useCusQuery";
import { ShowExpiredActionButton } from "../customer-products/ShowExpiredActionButton";
import { CustomerFeatureUsageColumns } from "./CustomerFeatureUsageColumns";

export function CustomerFeatureUsageTable() {
	const { customer, isLoading } = useCusQuery();

	const [showExpired, setShowExpired] = useQueryState(
		"customerFeatureUsageShowExpired",
		parseAsBoolean.withDefault(true),
	);

	const cusEnts = useMemo(
		() =>
			customer?.customer_products.flatMap((cp: FullCusProduct) =>
				cp.customer_entitlements.map((e: FullCustomerEntitlement) => ({
					...e,
					customer_product: cp,
				})),
			) ?? [],
		[customer],
	);

	const nonBooleanEnts = useMemo(
		() =>
			cusEnts.filter(
				(ent) => ent.entitlement.feature.type !== FeatureType.Boolean,
			),
		[cusEnts],
	);

	const booleanEnts = useMemo(
		() =>
			cusEnts.filter(
				(ent) => ent.entitlement.feature.type === FeatureType.Boolean,
			),
		[cusEnts],
	);

	const enableSorting = false;
	const table = useReactTable({
		data: nonBooleanEnts,
		columns: CustomerFeatureUsageColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableSorting,
	});

	const booleanTable = useReactTable({
		data: booleanEnts,
		columns: CustomerFeatureUsageColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableSorting,
	});

	return (
		<>
			<Table.Provider
				config={{
					table,
					numberOfColumns: CustomerFeatureUsageColumns.length,
					enableSorting,
					isLoading,
				}}
			>
				<Table.Container>
					<Table.Toolbar>
						<Table.Heading>Feature Usage</Table.Heading>
						<Table.Actions>
							<ShowExpiredActionButton
								showExpired={showExpired}
								setShowExpired={setShowExpired}
							/>
						</Table.Actions>
					</Table.Toolbar>
					<Table.Content>
						<Table.Header />
						<Table.Body />
					</Table.Content>
				</Table.Container>
			</Table.Provider>
			{booleanEnts.length > 0 && (
				<Table.Provider
					config={{
						table: booleanTable,
						numberOfColumns: CustomerFeatureUsageColumns.length,
						enableSorting,
						isLoading,
					}}
				>
					<Table.Container className="pt-0!">
						<Table.Content>
							<Table.Body />
						</Table.Content>
					</Table.Container>
				</Table.Provider>
			)}
		</>
	);
}
