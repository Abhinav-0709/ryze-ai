import * as React from "react"
import { cn } from "@/lib/utils"

// Container
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { }

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8", className)}
                {...props}
            />
        )
    }
)
Container.displayName = "Container"

// Grid
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

// Simple grid implementation (can be expanded)
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, columns = 1, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid gap-4 md:gap-6",
                    columns === 1 && "grid-cols-1",
                    columns === 2 && "grid-cols-1 md:grid-cols-2",
                    columns === 3 && "grid-cols-1 md:grid-cols-3",
                    columns === 4 && "grid-cols-2 md:grid-cols-4",
                    columns === 12 && "grid-cols-12",
                    className
                )}
                {...props}
            />
        )
    }
)
Grid.displayName = "Grid"

// Flex
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "row" | "column";
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between";
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    ({ className, direction = "row", align = "start", justify = "start", ...props }, ref) => {
        // Map legacy/hallucinated props to correct internal props
        const mappedDirection = direction || (props as any).flexDirection || "row";
        const mappedAlign = align || (props as any).alignItems || "start";
        const mappedJustify = justify || (props as any).justifyContent || "start";

        // Filter out the hallucinated props from spreading to DOM
        const {
            // @ts-ignore
            justifyContent,
            // @ts-ignore
            alignItems,
            // @ts-ignore
            flexDirection,
            ...validProps
        } = props as any;

        const alignClass = {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
        }[mappedAlign as string] || "items-start";

        const justifyClass = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
        }[mappedJustify as string] || "justify-start";

        return (
            <div
                ref={ref}
                className={cn(
                    "flex gap-4",
                    mappedDirection === "column" ? "flex-col" : "flex-row",
                    alignClass,
                    justifyClass,
                    className
                )}
                {...validProps}
            />
        )
    }
)
Flex.displayName = "Flex"

export { Container, Grid, Flex }
