import {
	AllowanceType,
	FeatureType,
	type FullCusEntWithFullCusProduct,
} from "@autumn/shared";
import {
	CaretDownIcon,
	CaretRightIcon,
	PokerChipIcon,
} from "@phosphor-icons/react";
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
			const cusEnt = row.original;
			const isSubRow = (cusEnt as any).isSubRow;

			if (isSubRow) {
				const subRowData = cusEnt as any;
				return (
					<div className="flex items-center gap-2 pl-4">
						<span>{subRowData.feature?.name || "Unknown Feature"}</span>
					</div>
				);
			}

			return <div>{cusEnt.customer_product.product.name}</div>;
		},
	},
	{
		header: "Usage",
		accessorKey: "usage",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const isSubRow = (cusEnt as any).isSubRow;

			if (isSubRow) {
				const subRowData = cusEnt as any;
				const creditCost = subRowData.credit_amount;
				const meteredCusEnt = subRowData.meteredCusEnt;

				// If we have usage data for this metered feature, display it
				if (meteredCusEnt && meteredCusEnt.entitlement) {
					const ent = meteredCusEnt.entitlement;

					if (ent.allowance_type === AllowanceType.Unlimited) {
						return <div className="text-sm text-t3">Unlimited</div>;
					}

					const total =
						(ent.allowance || 0) *
						(meteredCusEnt.customer_product.quantity || 1);
					const remaining = meteredCusEnt.balance || 0;
					const used = total - remaining;
					const spent = used * creditCost;

					return (
						<div className="text-sm flex items-center gap-1">
							{used} used <PokerChipIcon className="min-w-4" /> {spent} spent
						</div>
					);
				}

				// Fallback if no usage data available
				return <div className="text-sm text-t3">-</div>;
			}

			const ent = cusEnt.entitlement;

			if (ent.feature.type === FeatureType.Boolean) {
				return <></>;
			}

			if (ent.allowance_type === AllowanceType.Unlimited) {
				return <div className="text-t3">Unlimited</div>;
			}

			const total =
				(ent.allowance || 0) * (cusEnt.customer_product.quantity || 1);
			const remaining = cusEnt.balance || 0;

			return (
				<div>
					{remaining}/{total} used
				</div>
			);
		},
	},
	{
		header: "Resets At",
		accessorKey: "resets_at",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const isSubRow = (cusEnt as any).isSubRow;

			if (isSubRow) {
				const subRowData = cusEnt as any;
				const meteredCusEnt = subRowData.meteredCusEnt;

				// If we have the metered feature entitlement, show its reset date
				if (meteredCusEnt && meteredCusEnt.next_reset_at) {
					const { date, time } = formatUnixToDateTime(
						meteredCusEnt.next_reset_at,
					);
					return (
						<div className="text-xs text-t3">
							{date} {time}
						</div>
					);
				}

				return <div className="text-xs text-t3">-</div>;
			}

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
			const isSubRow = (cusEnt as any).isSubRow;

			if (isSubRow) {
				const subRowData = cusEnt as any;
				const feature = subRowData.feature;
				if (!feature) return <div>-</div>;

				return (
					<div>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="inline-flex">
									{getFeatureIcon({ feature })}
								</span>
							</TooltipTrigger>
							<TooltipContent>
								{getFeatureTypeLabel(feature.type)}
							</TooltipContent>
						</Tooltip>
					</div>
				);
			}

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
	{
		id: "expander",
		header: "",
		size: 40,
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const canExpand = row.getCanExpand();
			const isExpanded = row.getIsExpanded();
			const isSubRow = "isSubRow" in cusEnt && cusEnt.isSubRow;

			if (isSubRow || !canExpand) {
				return <div className="w-0" />;
			}

			return (
				<div className="flex justify-end pr-4">
					<button
						type="button"
						onClick={row.getToggleExpandedHandler()}
						className="text-t3 hover:text-t2"
					>
						{isExpanded ? (
							<CaretDownIcon size={16} weight="bold" />
						) : (
							<CaretRightIcon size={16} weight="bold" />
						)}
					</button>
				</div>
			);
		},
	},
];
