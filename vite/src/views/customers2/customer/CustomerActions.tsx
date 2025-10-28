import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/v2/buttons/Button";

export function CustomerActions() {
	return (
		<div className="flex items-center gap-2">
			<Button size="sm" variant="secondary">
				<PencilIcon />
				Customer details
			</Button>
			<Button size="icon" variant="secondary">
				<TrashIcon />
			</Button>
		</div>
	);
}
