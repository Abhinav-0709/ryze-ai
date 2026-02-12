
export const componentRegistry = {
  Button: {
    name: "Button",
    description: "Trigger an action or event, such as submitting a form or opening a dialog.",
    props: {
      variant: {
        type: "string",
        options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
        default: "default",
      },
      size: {
        type: "string",
        options: ["default", "sm", "lg", "icon"],
        default: "default",
      },
      children: {
        type: "string | ReactNode",
        description: "The content of the button",
      },
      onClick: {
        type: "function",
        description: "Function to call when clicked",
      }
    },
    example: '<Button variant="default">Click Me</Button>',
  },
  Input: {
    name: "Input",
    description: "Displays a form input field or a component that looks like an input field.",
    props: {
      type: {
        type: "string",
        options: ["text", "password", "email", "number"],
        default: "text",
      },
      placeholder: {
        type: "string",
        description: "Placeholder text",
      },
      value: {
        type: "string",
        description: "Current value",
      },
      onChange: {
        type: "function",
        description: "Change handler",
      }
    },
    example: '<Input placeholder="Enter your email" />',
  },
  Card: {
    name: "Card",
    description: "A container for content with a header, content, and footer.",
    props: {
      children: {
        type: "ReactNode",
        description: "Card subcomponents (CardHeader, CardContent, etc.)",
      }
    },
    subComponents: ["CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"],
    example: `
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
`,
  },
  Table: {
    name: "Table",
    description: "A responsive table component.",
    props: {
        children: {
            type: "ReactNode",
            description: "Table subcomponents (TableHeader, TableBody, TableRow, TableCell, etc.)"
        }
    },
    subComponents: ["TableHeader", "TableBody", "TableFooter", "TableHead", "TableRow", "TableCell", "TableCaption"],
    example: `
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header 1</TableHead>
      <TableHead>Header 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell 1</TableCell>
      <TableCell>Cell 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
`
  },
  Modal: {
    name: "Modal", // Mapped to Dialog in implementation
    description: "A modal dialog overlay.",
    props: {
        open: { type: "boolean" },
        onOpenChange: { type: "function" },
        children: { type: "ReactNode" }
    },
    subComponents: ["DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter"],
    example: `
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal Description</DialogDescription>
    </DialogHeader>
    <div>Modal Content</div>
  </DialogContent>
</Dialog>
`
  },
  Navbar: {
      name: "Navbar",
      description: "A top navigation bar.",
      props: { children: { type: "ReactNode" } },
      subComponents: ["NavbarBrand", "NavbarContent", "NavbarItem"],
      example: `
<Navbar>
  <NavbarBrand>Brand</NavbarBrand>
  <NavbarContent>
    <NavbarItem>Home</NavbarItem>
  </NavbarContent>
</Navbar>
`
  },
  Sidebar: {
      name: "Sidebar",
      description: "A side navigation bar.",
      props: { children: { type: "ReactNode" } },
      subComponents: ["SidebarHeader", "SidebarContent", "SidebarFooter"],
      example: `
<Sidebar>
  <SidebarHeader>Header</SidebarHeader>
  <SidebarContent>Content</SidebarContent>
  <SidebarFooter>Footer</SidebarFooter>
</Sidebar>
`
  },
  Chart: {
      name: "Chart",
      description: "A data visualization chart (Mock).",
      props: {
          type: { type: "string", options: ["bar", "line", "pie"], default: "bar" }
      },
      example: '<Chart type="bar" />'
  },
  Layout: {
      name: "Layout Components",
      description: "Layout primitives: Container, Grid, Flex.",
      components: ["Container", "Grid", "Flex"],
      props: {
          Flex: {
              direction: { type: "string", options: ["row", "column"], default: "row" },
              align: { type: "string", options: ["start", "center", "end", "stretch"], default: "start" },
              justify: { type: "string", options: ["start", "center", "end", "between"], default: "start" },
              gap: { type: "string", description: "Gap between items (e.g., '1rem')" }
          },
          Grid: {
              columns: { type: "number", options: [1, 2, 3, 4, 6, 12], default: 1 },
              gap: { type: "string", description: "Gap between items" }
          }
      },
      example: `
<Container>
  <Grid columns={2}>
    <Flex direction="column" gap="1rem">Item 1</Flex>
    <Flex direction="column" align="center">Item 2</Flex>
  </Grid>
</Container>
`
  }
};

export const getAllowedTags = () => {
    // List of allowed HTML tags and Component names
    return [
        "div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "form",
        "Button", "Input", "Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter",
        "Table", "TableHeader", "TableBody", "TableFooter", "TableHead", "TableRow", "TableCell", "TableCaption",
        "Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter",
        "Navbar", "NavbarBrand", "NavbarContent", "NavbarItem",
        "Sidebar", "SidebarHeader", "SidebarContent", "SidebarFooter",
        "Chart",
        "Container", "Grid", "Flex"
    ];
}
