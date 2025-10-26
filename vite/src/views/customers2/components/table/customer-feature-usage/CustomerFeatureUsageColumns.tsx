import {
	AllowanceType,
	FeatureType,
	type FullCusEntWithFullCusProduct,
} from "@autumn/shared";
import type { Row } from "@tanstack/react-table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/v2/tooltips/Tooltip";
import { formatUnixToDateTime } from "@/utils/formatUtils/formatDateUtils";
import { getFeatureIcon } from "@/views/products/features/utils/getFeatureIcon";

const getFeatureTypeLabel = (type: FeatureType): string => {
	switch (type) {
		case FeatureType.Boolean:
			return "Boolean";
		case FeatureType.Metered:
			return "Metered";
		case FeatureType.CreditSystem:
			return "Credit System";
		default:
			return "Feature";
	}
};

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
				return <></>;
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
			const ent = cusEnt.entitlement;
			return (
				<div>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex">
								{getFeatureIcon({ feature: ent.feature })}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							{getFeatureTypeLabel(ent.feature.type)}
						</TooltipContent>
					</Tooltip>
				</div>
			);
		},
	},
];
