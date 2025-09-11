import * as React from "react"
import { cn } from "@/lib/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/20 bg-[#0b0f14]/50 px-3 py-2 text-sm text-[#E9F4FF] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A3AAB8]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8BDF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
