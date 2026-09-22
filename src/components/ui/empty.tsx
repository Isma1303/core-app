import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function Empty({ className, title, description, action, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center py-12",
        className
      )}
      {...props}
    >
      {title && (
        <div className="text-lg font-semibold text-foreground">{title}</div>
      )}
      {description && (
        <div className="text-muted-foreground">{description}</div>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { Empty }