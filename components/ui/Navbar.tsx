import * as React from "react"
import { cn } from "@/lib/utils"

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> { }

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({ className, ...props }, ref) => {
        return (
            <nav
                ref={ref}
                className={cn(
                    "flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6",
                    className
                )}
                {...props}
            />
        )
    }
)
Navbar.displayName = "Navbar"

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> { }

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center gap-2 font-semibold", className)}
                {...props}
            />
        )
    }
)
NavbarBrand.displayName = "NavbarBrand"

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-1 items-center justify-center gap-4 md:justify-end", className)}
                {...props}
            />
        )
    }
)
NavbarContent.displayName = "NavbarContent"

export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> { }

const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("relative flex items-center", className)}
                {...props}
            />
        )
    }
)
NavbarItem.displayName = "NavbarItem"

export { Navbar, NavbarBrand, NavbarContent, NavbarItem }
