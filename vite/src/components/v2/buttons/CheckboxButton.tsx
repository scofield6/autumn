import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const CheckboxButton = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, onCheckedChange, checked, ...props }, ref) => {
	const handleClick = () => {
		const newChecked = !checked;
		onCheckedChange?.(newChecked);
	};

	return (
		<Button
			variant="secondary"
			onClick={handleClick}
			className={cn("flex items-center gap-2", className)}
		>
			<Checkbox
				checked={checked}
				ref={ref}
				onClick={(e) => e.preventDefault()}
				className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
			/>
			{props.children}
		</Button>
	);
});
