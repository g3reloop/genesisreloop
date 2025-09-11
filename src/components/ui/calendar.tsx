import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, disabled, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()
      
      const days: (Date | null)[] = []
      
      // Add empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
      }
      
      // Add days of month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i))
      }
      
      return days
    }

    const formatMonthYear = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const goToPreviousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const goToNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const isToday = (date: Date) => {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }

    const isSelected = (date: Date) => {
      return selected && date.toDateString() === selected.toDateString()
    }

    const days = getDaysInMonth(currentMonth)
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    return (
      <div ref={ref} className={cn("p-3", className)} {...props}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={goToPreviousMonth}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-[#E9F4FF]">
              {formatMonthYear(currentMonth)}
            </div>
            <Button
              onClick={goToNextMonth}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {weekDays.map((day, i) => (
              <div key={i} className="text-[#A3AAB8] font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              if (!date) {
                return <div key={i} />
              }
              
              const isDisabled = disabled?.(date) ?? false
              
              return (
                <button
                  key={i}
                  onClick={() => !isDisabled && onSelect?.(date)}
                  disabled={isDisabled}
                  className={cn(
                    "h-9 w-9 p-0 font-normal hover:bg-white/10 inline-flex items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8BDF]",
                    isDisabled && "text-[#A3AAB8]/30 pointer-events-none",
                    isToday(date) && "bg-white/5 text-[#5B8BDF] font-medium",
                    isSelected(date) && "bg-[#5B8BDF] text-white hover:bg-[#4A7AD0]",
                    !isSelected(date) && !isDisabled && "text-[#E9F4FF]"
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
