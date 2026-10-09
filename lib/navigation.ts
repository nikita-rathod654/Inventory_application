import {
  BarChart3,
  ClipboardList,
  Package,
  Plus,
  Settings,
  Truck,
} from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Add Product", href: "/add-product", icon: Plus },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Purchase Orders", href: "/purchase-orders", icon: ClipboardList },
  { name: "Settings", href: "/settings", icon: Settings },
];