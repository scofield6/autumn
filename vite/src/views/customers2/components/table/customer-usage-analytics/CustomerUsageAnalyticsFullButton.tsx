import { ChartBarIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { pushPage } from "@/utils/genUtils";

export function CustomerUsageAnalyticsFullButton() {
	const navigate = useNavigate();

	return (
		<Button
			variant="outline"
			className="h-7 flex items-center gap-1"
			onClick={() => {
				pushPage({ path: "/analytics", navigate });
			}}
		>
			<ChartBarIcon />
			Full Analytics
		</Button>
	);
}
