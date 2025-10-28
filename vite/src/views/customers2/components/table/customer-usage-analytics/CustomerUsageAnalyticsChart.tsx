"use client";

import type { Event } from "@autumn/shared";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
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
	const { chartData, chartConfig, eventNames, maxValue } = useMemo(() => {
		console.log("Chart events:", events);

		// Get unique event names (even if no events, we need this for config)
		const uniqueEventNames =
			events && events.length > 0
				? Array.from(new Set(events.map((e: Event) => e.event_name)))
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
			events.forEach((event: Event) => {
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

		// Calculate max stacked value
		const max = Math.max(
			...data.map((day) =>
				uniqueEventNames.reduce(
					(sum, eventName) => sum + (day[eventName] || 0),
					0,
				),
			),
			0,
		);

		return {
			chartData: data,
			chartConfig: config,
			eventNames: uniqueEventNames,
			maxValue: max,
		};
	}, [events, daysToShow]);

	return (
		<ChartContainer
			config={chartConfig}
			className="max-h-[300px] border pl-0 mb-4 p-2 rounded-2xl"
		>
			<BarChart
				accessibilityLayer
				data={chartData}
				barSize={128}
				maxBarSize={128}
				className="[&_.recharts-cartesian-grid-bg]:fill-white [&_.recharts-cartesian-grid-bg]:stroke-border [&_.recharts-cartesian-grid-bg]:stroke-1 [&_.recharts-cartesian-grid-bg]:[rx:8px]"
			>
				<CartesianGrid vertical={false} fill="white" />
				<XAxis
					dataKey="date"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
				/>
				<YAxis
					domain={[0, Math.round(maxValue * 1.2)]}
					tickCount={5}
					tickLine={false}
					axisLine={false}
					width={16}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
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
