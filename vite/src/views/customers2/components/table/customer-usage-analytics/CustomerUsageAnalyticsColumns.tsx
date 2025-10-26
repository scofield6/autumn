import type { Event } from "@autumn/shared";
import type { Row } from "@tanstack/react-table";
import { formatUnixToDateTime } from "@/utils/formatUtils/formatDateUtils";

export const CustomerUsageAnalyticsColumns = [
	{
		header: "Event Name",
		accessorKey: "event_name",
		cell: ({ row }: { row: Row<Event> }) => {
			return <div className="font-mono">{row.original.event_name}</div>;
		},
	},
	{
		header: "Value",
		accessorKey: "value",
		cell: ({ row }: { row: Row<Event> }) => {
			const event = row.original;
			return (
				<div className="font-mono">
					{event.value || event.properties?.value || 1}
				</div>
			);
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }: { row: Row<Event> }) => {
			return (
				<div className="font-mono">
					<span className="text-t3">POST </span>
					<span className="text-lime-600">200</span>
				</div>
			);
		},
	},
	{
		header: "Timestamp",
		accessorKey: "timestamp",
		cell: ({ row }: { row: Row<Event> }) => {
			const event = row.original;
			const { date, time } = formatUnixToDateTime(event.timestamp);
			return (
				<div className="text-xs text-t3">
					{date} {time}
				</div>
			);
		},
	},
];
