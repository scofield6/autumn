import {
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import { Table } from "@/components/general/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCusEventsQuery } from "@/views/customers/customer/hooks/useCusEventsQuery";
import { CustomerUsageAnalyticsChart } from "./CustomerUsageAnalyticsChart";
import { CustomerUsageAnalyticsColumns } from "./CustomerUsageAnalyticsColumns";

const DAY_OPTIONS = [7, 14, 21, 28];

export function CustomerUsageAnalyticsTable() {
	const { events, isLoading } = useCusEventsQuery();

	const [selectedDays, setSelectedDays] = useQueryState(
		"analyticsTimeRange",
		parseAsInteger.withDefault(7),
	);

	const filteredEvents = useMemo(() => {
		console.log("Raw events:", events);
		console.log("Selected days:", selectedDays);

		if (!events || !selectedDays) return events ?? [];

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - selectedDays);
		const cutoffTime = cutoffDate.getTime();

		const filtered = events.filter((event: any) => {
			// Handle both Unix timestamp (number) and ISO string formats
			const eventTime =
				typeof event.timestamp === "number"
					? event.timestamp * 1000
					: new Date(event.timestamp).getTime();
			return eventTime >= cutoffTime;
		});

		console.log("Filtered events:", filtered);
		console.log("Cutoff date:", cutoffDate);

		return filtered;
	}, [events, selectedDays]);

	const enableSorting = false;
	const table = useReactTable({
		data: filteredEvents,
		columns: CustomerUsageAnalyticsColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableSorting,
	});

	return (
		<Table.Provider
			config={{
				table,
				numberOfColumns: CustomerUsageAnalyticsColumns.length,
				enableSorting,
				isLoading,
			}}
		>
			<Table.Container>
				<Table.Toolbar>
					<Table.Heading>Usage Analytics</Table.Heading>
					<Table.Actions>
						<Select
							value={selectedDays?.toString()}
							onValueChange={(value) => setSelectedDays(Number.parseInt(value))}
						>
							<SelectTrigger className="w-[140px] h-7.5 text-sm">
								<SelectValue placeholder="Select days" />
							</SelectTrigger>
							<SelectContent>
								{DAY_OPTIONS.map((days) => (
									<SelectItem key={days} value={days.toString()}>
										Last {days} days
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Table.Actions>
				</Table.Toolbar>
				<CustomerUsageAnalyticsChart
					events={filteredEvents}
					daysToShow={selectedDays ?? 7}
				/>
				<Table.Content>
					<Table.Header />
					<Table.Body />
				</Table.Content>
			</Table.Container>
		</Table.Provider>
	);
}
