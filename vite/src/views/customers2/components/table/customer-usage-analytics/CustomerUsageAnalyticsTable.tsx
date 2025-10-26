import {
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	useQueryState,
} from "nuqs";
import { useMemo } from "react";
import { Table } from "@/components/general/table";
import { useCusEventsQuery } from "@/views/customers/customer/hooks/useCusEventsQuery";
import { CustomerUsageAnalyticsChart } from "./CustomerUsageAnalyticsChart";
import { CustomerUsageAnalyticsColumns } from "./CustomerUsageAnalyticsColumns";
import { CustomerUsageAnalyticsSelectDays } from "./CustomerUsageAnalyticsSelectDays";
import { CustomerUsageAnalyticsSelectFeatures } from "./CustomerUsageAnalyticsSelectFeatures";

export function CustomerUsageAnalyticsTable() {
	const { events, isLoading } = useCusEventsQuery();

	const [selectedDays, setSelectedDays] = useQueryState(
		"analyticsTimeRange",
		parseAsInteger.withDefault(7),
	);

	const [selectedFeatures, setSelectedFeatures] = useQueryState(
		"analyticsFeatures",
		parseAsArrayOf(parseAsString).withDefault([]),
	);

	const availableFeatures = useMemo(() => {
		if (!events || events.length === 0) return [];
		return Array.from(new Set(events.map((e: any) => e.event_name)));
	}, [events]);

	const filteredEvents = useMemo(() => {
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

			const withinTimeRange = eventTime >= cutoffTime;

			// Filter by selected features if any are selected
			const matchesFeature =
				selectedFeatures.length === 0 ||
				selectedFeatures.includes(event.event_name);

			return withinTimeRange && matchesFeature;
		});

		return filtered;
	}, [events, selectedDays, selectedFeatures]);

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
						<CustomerUsageAnalyticsSelectFeatures
							availableFeatures={availableFeatures}
							selectedFeatures={selectedFeatures}
							setSelectedFeatures={setSelectedFeatures}
						/>
						<CustomerUsageAnalyticsSelectDays
							selectedDays={selectedDays}
							setSelectedDays={setSelectedDays}
						/>
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
