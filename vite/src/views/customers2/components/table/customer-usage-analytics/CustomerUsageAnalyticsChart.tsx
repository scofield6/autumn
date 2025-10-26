"use client";

import type { Event } from "@autumn/shared";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export function CustomerUsageAnalyticsChart({
	events,
	daysToShow = 7,
}: {
	events: Event[];
	daysToShow?: number;
}) {

	const { chartData, chartConfig, eventNames } = useMemo(() => {
		console.log("Chart events:", events);

		// Get unique event names (even if no events, we need this for config)
		const uniqueEventNames =
			events && events.length > 0
				? Array.from(new Set(events.map((e: any) => e.event_name)))
				: [];

		// Create chart config
		const config: ChartConfig = {};
		uniqueEventNames.forEach((name: string, index: number) => {
			config[name] = {
				label: name,
				color: `var(--chart-${(index % 5) + 1})`,
			};
		});

		// Generate all dates in range
		const allDates: Record<string, Record<string, number>> = {};

		for (let i = daysToShow - 1; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dayKey = date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
			allDates[dayKey] = {};
		}

		// Group events by day
		if (events && events.length > 0) {
			events.forEach((event: any) => {
				// Handle both Unix timestamp (number) and ISO string formats
				const date =
					typeof event.timestamp === "number"
						? new Date(event.timestamp * 1000)
						: new Date(event.timestamp);

				const dayKey = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				if (allDates[dayKey] !== undefined) {
					const eventName = event.event_name;
					allDates[dayKey][eventName] = (allDates[dayKey][eventName] || 0) + 1;
				}
			});
		}

		// Transform to chart data format
		const data = Object.entries(allDates).map(([day, counts]) => ({
			date: day,
			...counts,
		}));

		console.log("Chart data:", data);
		console.log("Chart config:", config);
		console.log("Event names:", uniqueEventNames);

		return {
			chartData: data,
			chartConfig: config,
			eventNames: uniqueEventNames,
		};
	}, [events, daysToShow]);

	return (
		<ChartContainer config={chartConfig} className="max-h-[300px]">
			<BarChart accessibilityLayer data={chartData} barSize={60} maxBarSize={80}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="date"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
				/>
				<ChartTooltip content={<ChartTooltipContent hideLabel />} />
				<ChartLegend content={<ChartLegendContent />} />
				{eventNames.map((eventName: string, index: number) => (
					<Bar
						key={eventName}
						dataKey={eventName}
						stackId="a"
						fill={`var(--color-${eventName})`}
						radius={
							index === eventNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
						}
					/>
				))}
			</BarChart>
		</ChartContainer>
	);
}
