import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Home,
  Users,
  FolderOpen,
  FileText,
  Send,
  Settings,
  ChevronLeft,
  Shield
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Files", url: "/files", icon: FolderOpen },
  { title: "Settings", url: "/settings", icon: Settings },
]

const adminNavigation = [
  { title: "Admin Clients", url: "/admin/clients", icon: Shield },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isCollapsed = state === "collapsed"
  const isActive = (path: string) => currentPath === path
  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/80 transition-colors"

  return (
    <Sidebar className={cn(
      "border-r border-border",
      isCollapsed ? "w-14" : "w-60"
    )}>
      <SidebarContent className="bg-card">
        {/* Header */}
        <div className={cn(
          "px-4 py-6 border-b border-border",
          isCollapsed && "px-2"
        )}>
          {!isCollapsed ? (
            <div>
              <h1 className="font-bold text-xl text-foreground">
                F1 Immigration inc.
              </h1>
              <p className="text-sm text-muted-foreground">
                Client Intake System
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F1</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1 px-3 py-4">
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            isCollapsed && "hidden"
          )}>
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        getNavCls(item.url)
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        <SidebarGroup className="px-3 py-4 border-t border-border">
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            isCollapsed && "hidden"
          )}>
            ADMIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        getNavCls(item.url)
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}