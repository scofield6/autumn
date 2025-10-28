import type {
	FullCusEntWithFullCusProduct,
	FullCusProduct,
	FullCustomerEntitlement,
} from "@autumn/shared";
import { FeatureType } from "@autumn/shared";
import {
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { Table } from "@/components/general/table";
import { useCusQuery } from "@/views/customers/customer/hooks/useCusQuery";
import { ShowExpiredActionButton } from "../customer-products/ShowExpiredActionButton";
import { CustomerFeatureUsageColumns } from "./CustomerFeatureUsageColumns";

export function CustomerFeatureUsageTable() {
	const { customer, features, isLoading } = useCusQuery();

	const [showExpired, setShowExpired] = useQueryState(
		"customerFeatureUsageShowExpired",
		parseAsBoolean.withDefault(true),
	);

	const [expanded, setExpanded] = useState<ExpandedState>({});

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

	const featuresMap = useMemo(() => {
		if (!features) return new Map();
		return new Map(features.map((f) => [f.id, f]));
	}, [features]);

	const nonBooleanEnts = useMemo(() => {
		// Create a map of feature id to customer entitlements for quick lookup
		const featureIdToCusEnt = new Map(
			cusEnts.map((ent: FullCusEntWithFullCusProduct) => [
				ent.entitlement.feature.id,
				ent,
			]),
		);

		return cusEnts
			.filter(
				(ent: FullCusEntWithFullCusProduct) =>
					ent.entitlement.feature.type !== FeatureType.Boolean,
			)
			.map((ent: FullCusEntWithFullCusProduct) => {
				if (ent.entitlement.feature.type === FeatureType.CreditSystem) {
					const creditSchema = ent.entitlement.feature.config?.schema || [];
					const subRows = creditSchema.map((schemaItem: any) => {
						const meteredFeature = featuresMap.get(
							schemaItem.metered_feature_id,
						);
						// Find the customer entitlement for this metered feature
						const meteredCusEnt = featureIdToCusEnt.get(
							schemaItem.metered_feature_id,
						);

						return {
							metered_feature_id: schemaItem.metered_feature_id,
							credit_amount: schemaItem.credit_amount,
							feature_amount: schemaItem.feature_amount,
							feature: meteredFeature,
							meteredCusEnt, // Include the customer entitlement with usage data
							isSubRow: true,
							// Copy parent data for table context
							entitlement: ent.entitlement,
							customer_product: ent.customer_product,
							next_reset_at: ent.next_reset_at,
						};
					});
					return { ...ent, subRows };
				}
				return ent;
			});
	}, [cusEnts, featuresMap]);

	const booleanEnts = useMemo(
		() =>
			cusEnts.filter(
				(ent: FullCusEntWithFullCusProduct) =>
					ent.entitlement.feature.type === FeatureType.Boolean,
			),
		[cusEnts],
	);

	const enableSorting = false;
	const table = useReactTable({
		data: nonBooleanEnts,
		columns: CustomerFeatureUsageColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSubRows: (row: FullCusEntWithFullCusProduct) => row.subRows,
		getRowCanExpand: (row) =>
			row.original.entitlement?.feature?.type === FeatureType.CreditSystem,
		enableSorting,
		state: {
			expanded,
		},
		onExpandedChange: setExpanded,
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
					<Table.Container className="!pt-0">
						<Table.Content>
							<Table.Body />
						</Table.Content>
					</Table.Container>
				</Table.Provider>
			)}
		</>
	);
}
