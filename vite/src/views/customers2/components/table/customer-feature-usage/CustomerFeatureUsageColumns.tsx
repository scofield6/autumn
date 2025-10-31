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
import { cn } from "@/lib/utils";
import { formatUnixToDateTime } from "@/utils/formatUtils/formatDateUtils";
import { getFeatureIcon } from "@/views/products/features/utils/getFeatureIcon";
import { CustomerFeatureUsageBar } from "./CustomerFeatureUsageBar";
import { calculateUsageMetrics } from "./calculateUsageMetrics";

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

interface SubRowData {
	isSubRow: boolean;
	meteredCusEnt?: FullCusEntWithFullCusProduct;
	feature?: any;
	credit_amount?: number;
}

const getSubRowData = (cusEnt: any): SubRowData | null => {
	if (!cusEnt.isSubRow) return null;
	return {
		isSubRow: true,
		meteredCusEnt: cusEnt.meteredCusEnt,
		feature: cusEnt.feature,
		credit_amount: cusEnt.credit_amount,
	};
};

export const CustomerFeatureUsageColumns = [
	{
		header: "Feature",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const subRowData = getSubRowData(cusEnt);
			let allowance: number;
			let balance: number;
			let quantity: number;
			let featureName: string;
			let className: string | undefined;

			if (subRowData) {
				const { meteredCusEnt, feature } = subRowData;
				allowance = cusEnt.entitlement?.allowance ?? 0;
				balance = meteredCusEnt?.balance ?? 0;
				quantity = meteredCusEnt?.customer_product.quantity ?? 1;
				featureName = feature.name;
				className = "pl-4";
			} else {
				allowance = cusEnt.entitlement?.allowance ?? 0;
				balance = cusEnt?.balance ?? 0;
				quantity = cusEnt.customer_product.quantity || 1;
				featureName = cusEnt.customer_product.product.name;
			}

			return (
				<div className={cn("flex items-center gap-2.5 py-2", className)}>
					<CustomerFeatureUsageBar
						allowance={allowance}
						balance={balance}
						quantity={quantity}
					/>
					<span>{featureName}</span>
				</div>
			);
		},
	},
	{
		header: "Usage",
		accessorKey: "usage",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const subRowData = getSubRowData(cusEnt);

			if (subRowData) {
				const { meteredCusEnt, credit_amount } = subRowData;

				if (!meteredCusEnt?.entitlement) {
					return <div className="text-sm text-t3">-</div>;
				}

				const ent = meteredCusEnt.entitlement;

				if (ent.allowance_type === AllowanceType.Unlimited) {
					return <div className="text-sm text-t3">Unlimited</div>;
				}

				const { used } = calculateUsageMetrics({
					allowance: ent.allowance || 0,
					balance: meteredCusEnt.balance || 0,
					quantity: meteredCusEnt.customer_product.quantity || 1,
				});
				const spent = used * (credit_amount || 0);

				return (
					<div className="text-sm flex items-center gap-1">
						{used} used <PokerChipIcon className="min-w-4" /> {spent} spent
					</div>
				);
			}

			const ent = cusEnt.entitlement;

			if (ent.feature.type === FeatureType.Boolean) {
				return <></>;
			}

			if (ent.allowance_type === AllowanceType.Unlimited) {
				return <div className="text-t3">Unlimited</div>;
			}

			if (ent.feature.type === FeatureType.CreditSystem) {
				const subRows = (cusEnt as any).subRows || [];
				let totalSpent = 0;

				for (const subRow of subRows) {
					const meteredCusEnt = subRow.meteredCusEnt;
					const creditCost = subRow.credit_amount;

					if (meteredCusEnt?.entitlement) {
						const subEnt = meteredCusEnt.entitlement;
						if (subEnt.allowance_type !== AllowanceType.Unlimited) {
							const { used } = calculateUsageMetrics({
								allowance: subEnt.allowance || 0,
								balance: meteredCusEnt.balance || 0,
								quantity: meteredCusEnt.customer_product.quantity || 1,
							});
							totalSpent += used * creditCost;
						}
					}
				}

				const total =
					(ent.allowance || 0) * (cusEnt.customer_product.quantity || 1);

				return (
					<div className="flex items-center gap-1">
						<PokerChipIcon className="min-w-4" /> {totalSpent}/{total} used
					</div>
				);
			}

			const { total, used } = calculateUsageMetrics({
				allowance: ent.allowance || 0,
				balance: cusEnt.balance || 0,
				quantity: cusEnt.customer_product.quantity || 1,
			});

			return (
				<div>
					{used}/{total} used
				</div>
			);
		},
	},
	{
		header: "Resets At",
		accessorKey: "resets_at",
		cell: ({ row }: { row: Row<FullCusEntWithFullCusProduct> }) => {
			const cusEnt = row.original;
			const subRowData = getSubRowData(cusEnt);

			if (subRowData) {
				const { meteredCusEnt } = subRowData;

				if (!meteredCusEnt?.next_reset_at) {
					return <div className="text-xs text-t3">-</div>;
				}

				const { date, time } = formatUnixToDateTime(
					meteredCusEnt.next_reset_at,
				);
				return (
					<div className="text-xs text-t3">
						{date} {time}
					</div>
				);
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
			const subRowData = getSubRowData(cusEnt);

			const feature = subRowData
				? subRowData.feature
				: cusEnt.entitlement.feature;

			if (!feature) return <div>-</div>;

			return (
				<div>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex">{getFeatureIcon({ feature })}</span>
						</TooltipTrigger>
						<TooltipContent>{getFeatureTypeLabel(feature.type)}</TooltipContent>
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
