import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectivityBanner() {
  const { isOnline } = useApp();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isOnline ? 'online' : 'offline'}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium ${
          isOnline ? 'bg-online/10 text-online' : 'bg-offline/10 text-offline'
        }`}
      >
        {isOnline ? (
          <><Wifi className="h-3 w-3" />Online — data syncing in real time</>
        ) : (
          <><WifiOff className="h-3 w-3" />Offline — reports saved locally, will sync when connected</>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
