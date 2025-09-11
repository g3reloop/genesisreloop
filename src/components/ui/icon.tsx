import * as React from "react"
import { cn } from "@/lib/cn"
import { LucideIcon } from "lucide-react"

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info"
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, icon: IconComponent, size = "md", color, ...props }, ref) => {
    const sizeClasses = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8"
    }

    const colorClasses = {
      primary: "text-[#5B8BDF]",
      secondary: "text-[#A3AAB8]",
      success: "text-green-500",
      warning: "text-yellow-500",
      error: "text-red-500",
      info: "text-blue-500"
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <IconComponent 
          className={cn(
            sizeClasses[size],
            color && colorClasses[color]
          )}
        />
      </div>
    )
  }
)
Icon.displayName = "Icon"

export { Icon }
