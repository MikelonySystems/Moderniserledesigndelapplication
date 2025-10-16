import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { LayoutDashboard, Receipt, CreditCard, Car, Briefcase, TrendingUp, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Cachets", icon: Receipt, active: false },
  { title: "Dépenses", icon: CreditCard, active: false },
  { title: "Trajets", icon: Car, active: false },
  { title: "AEM", icon: Briefcase, active: false },
  { title: "Revenus", icon: TrendingUp, active: false },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
            <span className="text-lg">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">MIKELONY SYSTEMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
                    className="px-3 py-2.5 rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="px-3 py-2.5 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Préférences</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
