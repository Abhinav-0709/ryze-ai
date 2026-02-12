import * as React from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/Table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Modal";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@/components/ui/Navbar";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/Sidebar";
import { Chart } from "@/components/ui/Chart";
import { Container, Grid, Flex } from "@/components/ui/Layout";

export const scope = {
    React,
    ...LucideIcons,
    Button,
    Input,
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
    Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption,
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
    Navbar, NavbarBrand, NavbarContent, NavbarItem,
    Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
    Chart,
    Container, Grid, Flex
};
