import { Wifi, WifiOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNavbar() {
  const { isOnline, toggleOnline, syncingCount } = useApp();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
      </div>
      <div className="flex items-center gap-4">
        <AnimatePresence>
          {syncingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-pulse-sync"
            >
              Syncing {syncingCount} reports...
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isOnline ? <Wifi className="h-4 w-4 text-online" /> : <WifiOff className="h-4 w-4 text-offline" />}
          <Switch checked={isOnline} onCheckedChange={toggleOnline} />
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">FW</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
