import { CopyButton } from "@/components/v2/buttons/CopyButton";
import { useCustomerContext } from "./CustomerContext";

export const CustomerPageDetails = () => {
	const { customer } = useCustomerContext();
	return (
		<div className="flex gap-2">
			<CopyButton text={customer.id ?? "NULL"} />
			<CopyButton text={customer.email ?? "NULL"} />
			<CopyButton text={customer.fingerprint ?? "NULL"} />
		</div>
	);
};
