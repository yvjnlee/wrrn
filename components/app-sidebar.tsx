import React from "react"
import { ChartCandlestick, Handshake, Home, Settings, UserCog, Wallet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/overview",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Handshake,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: Wallet,
  },
  {
    title: "Investments",
    url: "/investments",
    icon: ChartCandlestick,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: UserCog,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>WRRN by NVRS Group.</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex col gap-3 m-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* <SidebarMenuButton asChild> */}
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  {/* </SidebarMenuButton> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
