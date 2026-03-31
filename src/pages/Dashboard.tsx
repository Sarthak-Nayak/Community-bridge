import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WARDS, NEED_TYPES } from '@/lib/mockData';
import { AlertTriangle, MapPin, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { VolunteerMatchDialog } from '@/components/VolunteerMatchDialog';

function urgencyColor(u: number) {
  if (u >= 4) return 'bg-urgency-critical/10 border-urgency-critical/30 text-urgency-critical';
  if (u === 3) return 'bg-urgency-moderate/10 border-urgency-moderate/30 text-urgency-moderate';
  return 'bg-urgency-low/10 border-urgency-low/30 text-urgency-low';
}

function urgencyBadge(u: number) {
  if (u >= 4) return 'bg-urgency-critical text-primary-foreground';
  if (u === 3) return 'bg-urgency-moderate text-primary-foreground';
  return 'bg-urgency-low text-primary-foreground';
}

export default function Dashboard() {
  const { needs } = useApp();
  const [filterWard, setFilterWard] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [matchNeedId, setMatchNeedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return needs.filter(n => {
      if (filterWard !== 'all' && n.location !== filterWard) return false;
      if (filterType !== 'all' && n.needType !== filterType) return false;
      return true;
    });
  }, [needs, filterWard, filterType]);

  const topUrgent = useMemo(() => [...needs].sort((a, b) => b.urgency - a.urgency).slice(0, 5), [needs]);
  const totalNeeds = needs.length;
  const avgUrgency = (needs.reduce((s, n) => s + n.urgency, 0) / needs.length).toFixed(1);
  const resolved = needs.filter(n => n.status === 'resolved').length;
  const pending = needs.filter(n => n.status === 'pending').length;

  const areaCounts = needs.reduce((acc, n) => { acc[n.location] = (acc[n.location] || 0) + 1; return acc; }, {} as Record<string, number>);
  const mostAffected = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Need Prioritisation Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered community need analysis and prioritisation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Needs', value: totalNeeds, icon: AlertTriangle, color: 'text-primary' },
          { label: 'Avg Urgency', value: avgUrgency, icon: TrendingUp, color: 'text-urgency-moderate' },
          { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-urgency-low' },
          { label: 'Pending', value: pending, icon: Clock, color: 'text-urgency-critical' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-display font-bold">{s.value}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-60`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Most Affected Area */}
      <Card className="shadow-card">
        <CardContent className="p-4 flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm"><strong>Most Affected Area:</strong> {mostAffected}</span>
        </CardContent>
      </Card>

      {/* Top 5 */}
      <Card className="shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-lg font-display">Top 5 Most Urgent Needs</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {topUrgent.map((n, i) => (
            <div key={n.id} className={`flex items-center gap-3 p-3 rounded-lg border ${urgencyColor(n.urgency)}`}>
              <span className="font-display font-bold text-lg w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{n.description}</p>
                <p className="text-xs opacity-70">{n.location} · {n.peopleAffected} affected</p>
              </div>
              <Badge className={urgencyBadge(n.urgency)}>Urgency {n.urgency}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterWard} onValueChange={setFilterWard}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by Ward" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {NEED_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Need Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`shadow-card hover:shadow-card-hover transition-shadow border-l-4 ${
              n.urgency >= 4 ? 'border-l-urgency-critical' : n.urgency === 3 ? 'border-l-urgency-moderate' : 'border-l-urgency-low'
            }`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-xs">{n.needType}</Badge>
                  <div className="flex gap-1">
                    <Badge className={urgencyBadge(n.urgency)}>U{n.urgency}</Badge>
                    {n.syncStatus === 'pending' && <Badge variant="outline" className="text-pending border-pending">⏳ Pending</Badge>}
                    {n.syncStatus === 'synced' && <Badge variant="outline" className="text-synced border-synced text-xs">✅</Badge>}
                  </div>
                </div>
                <p className="text-sm">{n.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{n.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{n.peopleAffected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={n.status === 'resolved' ? 'default' : 'outline'} className="text-xs capitalize">{n.status}</Badge>
                  {n.status === 'pending' && (
                    <button
                      onClick={() => setMatchNeedId(n.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Match Volunteers →
                    </button>
                  )}
                </div>
                {n.sharedBy && <p className="text-xs text-muted-foreground">Shared by {n.sharedBy}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {matchNeedId && (
        <VolunteerMatchDialog needId={matchNeedId} onClose={() => setMatchNeedId(null)} />
      )}
    </div>
  );
}
