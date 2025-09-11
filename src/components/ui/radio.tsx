import * as React from "react"
import { cn } from "@/lib/cn"

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-full border border-white/20 bg-[#0b0f14]/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8BDF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#5B8BDF] data-[state=checked]:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Radio.displayName = "Radio"

export { Radio }
