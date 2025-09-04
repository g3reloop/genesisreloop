"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)
    
    React.useEffect(() => {
      setIsChecked(checked || false)
    }, [checked])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }
    
    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-mythic-primary-500 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mythic-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isChecked && "bg-mythic-primary-500 text-white",
            className
          )}
          onClick={() => {
            const newChecked = !isChecked
            setIsChecked(newChecked)
            onCheckedChange?.(newChecked)
            // Create synthetic event for onChange
            const event = {
              target: { checked: newChecked },
              currentTarget: { checked: newChecked }
            } as React.ChangeEvent<HTMLInputElement>
            onChange?.(event)
          }}
        >
          {isChecked && (
            <Check className="h-3 w-3 absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
