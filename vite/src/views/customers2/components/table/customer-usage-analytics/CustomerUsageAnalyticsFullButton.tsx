import { ChartBarIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/v2/buttons/Button";
import { pushPage } from "@/utils/genUtils";

export function CustomerUsageAnalyticsFullButton() {
	const navigate = useNavigate();

	return (
		<Button
			variant="secondary"
			size="sm"
			className="flex items-center gap-1"
			onClick={() => {
				pushPage({ path: "/analytics", navigate });
			}}
		>
			<ChartBarIcon />
			Full Analytics
		</Button>
	);
}
