import { ArrowSquareOutIcon, FingerprintIcon } from "@phosphor-icons/react";
import { ArrowUpRightFromSquare } from "lucide-react";
import { Button } from "@/components/v2/buttons/Button";
import { CopyButton } from "@/components/v2/buttons/CopyButton";
import { useCustomerContext } from "./CustomerContext";

const mutedDivClassName =
	"py-0.5 px-1.5 bg-muted rounded-lg text-t3 text-tiny flex items-center justify-center gap-1 h-6";

export const CustomerPageDetails = () => {
	const { customer } = useCustomerContext();
	return (
		<div className="flex gap-2">
			<CopyButton text={customer.id ?? "NULL"} size="sm" />
			<div className={mutedDivClassName}>{customer.email}</div>
			<div className={mutedDivClassName}>
				<FingerprintIcon size={12} />
				{customer.fingerprint ?? "NULL"}
			</div>
			<Button variant="muted" size="sm">
				stripe
				<ArrowSquareOutIcon size={12} />
			</Button>
		</div>
	);
};
