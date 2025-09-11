import * as React from "react"
import { cn } from "@/lib/cn"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12"
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent text-[#5B8BDF]",
            sizeClasses[size]
          )}
        />
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
