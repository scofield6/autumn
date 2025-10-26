import { createContext, useContext } from "react";

export const CustomerContext = createContext<any>(null);

export const useCustomerContext = () => {
	const context = useContext(CustomerContext);
	console.log("context", context);

	if (context === undefined) {
		throw new Error(
			"useCustomerContext must be used within a CustomerContextProvider",
		);
	}

	return context;
};
