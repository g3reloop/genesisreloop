import * as React from "react"
import { cn } from "@/lib/cn"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-white/20 bg-[#0b0f14]/50 px-3 py-2 text-sm text-[#E9F4FF] ring-offset-background placeholder:text-[#A3AAB8]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8BDF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
