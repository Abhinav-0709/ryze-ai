import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'bar' | 'line' | 'pie';
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
    ({ className, type = 'bar', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex h-[300px] w-full items-end justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm",
                    className
                )}
                {...props}
            >
                {/* Mock Graphic: Simple CSS bars */}
                {type === 'bar' && (
                    <>
                        <div className="h-[40%] w-8 rounded-t bg-primary/20" />
                        <div className="h-[70%] w-8 rounded-t bg-primary/40" />
                        <div className="h-[50%] w-8 rounded-t bg-primary/60" />
                        <div className="h-[90%] w-8 rounded-t bg-primary/80" />
                        <div className="h-[60%] w-8 rounded-t bg-primary" />
                    </>
                )}
                {type === 'line' && (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        [Line Chart Visualization]
                    </div>
                )}
                {type === 'pie' && (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary text-muted-foreground">
                        Pie
                    </div>
                )}
            </div>
        )
    }
)
Chart.displayName = "Chart"

export { Chart }
