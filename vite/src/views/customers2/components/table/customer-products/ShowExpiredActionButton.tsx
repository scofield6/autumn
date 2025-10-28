import { CheckboxButton } from "@/components/v2/buttons/CheckboxButton";

export function ShowExpiredActionButton({
	showExpired,
	setShowExpired,
}: {
	showExpired: boolean;
	setShowExpired: (showExpired: boolean) => Promise<URLSearchParams>;
}) {
	const handleToggle = async (checked: boolean) => {
		console.log("handleToggle", checked);
		await setShowExpired(checked);
	};

	return (
		<CheckboxButton
			className=""
			checked={showExpired}
			onCheckedChange={handleToggle}
		>
			Show expired
		</CheckboxButton>
	);
}
