import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

// 16px text on phones so iOS doesn't zoom on focus. Sharp; focus turns the edge white.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 border border-input bg-raised px-3 text-base text-fg transition-colors outline-none placeholder:text-faint focus-visible:border-act focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-alert md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
