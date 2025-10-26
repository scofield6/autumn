import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const DAY_OPTIONS = [7, 14, 21, 28];

export function CustomerUsageAnalyticsSelectDays({
	selectedDays,
	setSelectedDays,
}: {
	selectedDays: number;
	setSelectedDays: (days: number) => void;
}) {
	return (
		<Select
			value={selectedDays?.toString()}
			onValueChange={(value) => setSelectedDays(Number.parseInt(value))}
		>
			<SelectTrigger className="w-[140px] h-7.5 text-sm rounded-lg">
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
	);
}
