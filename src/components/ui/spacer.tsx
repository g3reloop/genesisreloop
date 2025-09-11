import * as React from "react"
import { cn } from "@/lib/cn"

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  axis?: "horizontal" | "vertical"
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = "md", axis = "vertical", ...props }, ref) => {
    const sizeClasses = {
      xs: {
        vertical: "h-2",
        horizontal: "w-2"
      },
      sm: {
        vertical: "h-4",
        horizontal: "w-4"
      },
      md: {
        vertical: "h-6",
        horizontal: "w-6"
      },
      lg: {
        vertical: "h-8",
        horizontal: "w-8"
      },
      xl: {
        vertical: "h-12",
        horizontal: "w-12"
      },
      "2xl": {
        vertical: "h-16",
        horizontal: "w-16"
      },
      "3xl": {
        vertical: "h-24",
        horizontal: "w-24"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          axis === "vertical" ? "w-full" : "h-full",
          sizeClasses[size][axis],
          className
        )}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
Spacer.displayName = "Spacer"

// Divider component as a bonus
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "bg-white/10",
        orientation === "horizontal"
          ? "h-[1px] w-full"
          : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Divider.displayName = "Divider"

// Stack component for vertical/horizontal stacking with spacing
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal"
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  align?: "start" | "center" | "end" | "stretch"
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      children,
      direction = "vertical",
      spacing = "md",
      align = "stretch",
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8"
    }

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "vertical" ? "flex-col" : "flex-row",
          spacingClasses[spacing],
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Stack.displayName = "Stack"

export { Spacer, Divider, Stack }
