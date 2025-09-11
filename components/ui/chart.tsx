import * as React from "react"
import { cn } from "@/lib/cn"

// Chart container that can wrap any chart library (recharts, chartjs, etc)
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full",
      className
    )}
    {...props}
  />
))
ChartContainer.displayName = "ChartContainer"

// Chart wrapper with glass morphism background
const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-white/10 bg-[#0b0f14]/50 backdrop-blur-sm p-6",
      className
    )}
    {...props}
  />
))
Chart.displayName = "Chart"

// Chart header for title and description
const ChartHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4 space-y-1", className)}
    {...props}
  />
))
ChartHeader.displayName = "ChartHeader"

// Chart title
const ChartTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-[#E9F4FF]",
      className
    )}
    {...props}
  />
))
ChartTitle.displayName = "ChartTitle"

// Chart description
const ChartDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#A3AAB8]", className)}
    {...props}
  />
))
ChartDescription.displayName = "ChartDescription"

// Chart content area
const ChartContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
ChartContent.displayName = "ChartContent"

// Chart legend container
const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center gap-4 mt-4 text-sm",
      className
    )}
    {...props}
  />
))
ChartLegend.displayName = "ChartLegend"

// Chart legend item
const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: string
    label: string
  }
>(({ className, color, label, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    <div
      className="h-3 w-3 rounded-full"
      style={{ backgroundColor: color || "#5B8BDF" }}
    />
    <span className="text-[#A3AAB8]">{label}</span>
  </div>
))
ChartLegendItem.displayName = "ChartLegendItem"

// Chart tooltip wrapper
const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-white/20 bg-[#0b0f14] p-3 text-sm shadow-lg",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

// Empty state for charts with no data
const ChartEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-[200px] items-center justify-center text-[#A3AAB8]",
      className
    )}
    {...props}
  >
    {children || "No data available"}
  </div>
))
ChartEmpty.displayName = "ChartEmpty"

export {
  ChartContainer,
  Chart,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartEmpty,
}
