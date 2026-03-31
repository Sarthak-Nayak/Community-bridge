import { LayoutDashboard, MessageSquare, Users, Building2, FileText, Wifi, WifiOff } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Chatbot', url: '/chatbot', icon: MessageSquare },
  { title: 'Volunteers', url: '/volunteers', icon: Users },
  { title: 'NGO Network', url: '/ngo-network', icon: Building2 },
  { title: 'Reports', url: '/reports', icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { isOnline } = useApp();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-6">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-sidebar-foreground">CommunityBridge</span>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4">
          <div className="flex items-center gap-2 text-xs">
            {isOnline ? (
              <><Wifi className="h-3 w-3 text-online" />{!collapsed && <span className="text-online">Online</span>}</>
            ) : (
              <><WifiOff className="h-3 w-3 text-offline" />{!collapsed && <span className="text-offline">Offline</span>}</>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
