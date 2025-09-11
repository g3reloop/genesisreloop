import * as React from "react"
import { cn } from "@/lib/cn"

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
}

const Tooltip = ({ children, content, side = "top", delayDuration = 700 }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delayDuration)
  }

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  }

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 rounded-md bg-[#0b0f14] px-3 py-1.5 text-xs text-[#E9F4FF] shadow-md animate-in fade-in-0 zoom-in-95",
            sideClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip }
