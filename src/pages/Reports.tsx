import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Reports() {
  const { needs } = useApp();

  const byType = needs.reduce((acc, n) => { acc[n.needType] = (acc[n.needType] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byWard = needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>);
  const byStatus = needs.reduce((acc, n) => { acc[n.status] = (acc[n.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive overview of all community need reports</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export CSV</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-display">By Need Type</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-primary/20" style={{ width: `${(count / needs.length) * 100}px` }}>
                      <div className="h-full rounded-full gradient-primary" style={{ width: '100%' }} />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-display">By Ward</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(byWard).map(([ward, count]) => (
                <div key={ward} className="flex items-center justify-between">
                  <span className="text-sm truncate max-w-[120px]">{ward.split(' - ')[1]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-secondary/20" style={{ width: `${(count / needs.length) * 100}px` }}>
                      <div className="h-full rounded-full bg-secondary" style={{ width: '100%' }} />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-display">By Status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">{status}</Badge>
                  <span className="font-display font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Full Table */}
      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display flex items-center gap-2"><FileText className="h-5 w-5" />All Need Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Affected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needs.map(n => (
                  <TableRow key={n.id}>
                    <TableCell><Badge variant="outline" className="text-xs">{n.needType}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{n.description}</TableCell>
                    <TableCell className="text-sm">{n.location.split(' - ')[1]}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${n.urgency >= 4 ? 'bg-urgency-critical' : n.urgency === 3 ? 'bg-urgency-moderate' : 'bg-urgency-low'} text-primary-foreground`}>
                        {n.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{n.peopleAffected}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs capitalize">{n.status}</Badge></TableCell>
                    <TableCell className="text-xs">{n.syncStatus === 'synced' ? '✅' : '⏳'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
