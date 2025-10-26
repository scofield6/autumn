import {
	AllowanceType,
	FeatureType,
	type FullCusEntWithFullCusProduct,
} from "@autumn/shared";
import type { Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatUnixToDateTime } from "@/utils/formatUtils/formatDateUtils";
import { CusEntBalance } from "./CustomerFeatureBalance";

export const CustomerFeatureUsageColumns = [
	{
		header: "Feature",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			return <div>{row.original.customer_product.product.name}</div>;
		},
	},
	{
		header: "Usage",
		accessorKey: "usage",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const ent = cusEnt.entitlement;

			if (ent.feature.type === FeatureType.Boolean) {
				return <div className="text-t3">N/A</div>;
			}

			if (ent.allowance_type === AllowanceType.Unlimited) {
				return <div className="text-t3">Unlimited</div>;
			}

			const total = ent.allowance || 0;
			const remaining = cusEnt.balance || 0;
			const used = total - remaining;

			return (
				<div className="font-mono">
					{used}/{total}
				</div>
			);
		},
	},
	{
		header: "Resets At",
		accessorKey: "resets_at",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const { date, time } = formatUnixToDateTime(cusEnt.next_reset_at);
			return (
				<div className="text-xs text-t3">
					{date} {time}
				</div>
			);
		},
	},
	{
		header: "Configuration",
		accessorKey: "configuration",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const { date, time } = formatUnixToDateTime(cusEnt.next_reset_at);
			return (
				<div className="text-xs text-t3">
					{date} {time}
				</div>
			);
		},
	},
];
