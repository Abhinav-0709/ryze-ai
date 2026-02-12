import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "hidden h-screen w-64 flex-col border-r bg-muted/40 md:flex",
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto py-2", className)}
        {...props}
      />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6", className)}
        {...props}
      />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-auto flex items-center p-4", className)}
        {...props}
      />
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

export { Sidebar, SidebarContent, SidebarHeader, SidebarFooter }
