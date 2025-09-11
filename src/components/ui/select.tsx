import * as React from "react"
import { cn } from "@/lib/cn"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-[#0b0f14]/50 px-3 py-2 text-sm text-[#E9F4FF] ring-offset-background placeholder:text-[#A3AAB8]/50 focus:outline-none focus:ring-2 focus:ring-[#5B8BDF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
