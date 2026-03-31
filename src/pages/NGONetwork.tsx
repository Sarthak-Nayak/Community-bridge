import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WARDS, NEED_TYPES } from '@/lib/mockData';
import { Plus, Building2, MapPin, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NGONetwork() {
  const { ngos, addNGO, needs, acceptNeed } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [focus, setFocus] = useState('');
  const [view, setView] = useState<'my' | 'network'>('network');

  const currentNGO = ngos[0]; // simulate as first NGO
  const networkNeeds = needs.filter(n => n.sharedBy || true); // all needs visible in network

  const handleSubmit = () => {
    if (!name || !area || !focus) return;
    addNGO({ name, areaCovered: area, focusArea: focus });
    setShowForm(false); setName(''); setArea(''); setFocus('');
    toast.success('NGO registered successfully');
  };

  const handleAccept = (needId: string) => {
    acceptNeed(needId, currentNGO?.name || 'My NGO');
    toast.success('Need accepted by your NGO');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">NGO Federated Network</h1>
          <p className="text-sm text-muted-foreground">Collaborate across organizations to serve communities</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />Register NGO
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Register New NGO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>NGO Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Organization name" /></div>
                <div>
                  <Label>Area Covered</Label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Focus Area</Label>
                  <Select value={focus} onValueChange={setFocus}>
                    <SelectTrigger><SelectValue placeholder="Select focus" /></SelectTrigger>
                    <SelectContent>{['Food Security', 'Medical Aid', 'Education', 'Infrastructure', 'Community Development'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">Register</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* NGO Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ngos.map((ngo, i) => (
          <motion.div key={ngo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">{ngo.logo}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{ngo.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{ngo.areaCovered}</p>
                  <Badge variant="outline" className="text-xs mt-1">{ngo.focusArea}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Need Registry */}
      <Tabs defaultValue="network">
        <TabsList>
          <TabsTrigger value="my" onClick={() => setView('my')}>My NGO Needs</TabsTrigger>
          <TabsTrigger value="network" onClick={() => setView('network')}>Network-Wide Needs</TabsTrigger>
        </TabsList>

        <TabsContent value="my">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needs.filter(n => n.acceptedBy === currentNGO?.name || n.location === currentNGO?.areaCovered).map(n => (
              <Card key={n.id} className="shadow-card">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{n.needType}</Badge>
                    <Badge className={n.urgency >= 4 ? 'bg-urgency-critical' : n.urgency === 3 ? 'bg-urgency-moderate' : 'bg-urgency-low'}>U{n.urgency}</Badge>
                  </div>
                  <p className="text-sm">{n.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{n.location} · <Users className="h-3 w-3" />{n.peopleAffected} affected</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkNeeds.filter(n => n.status !== 'resolved').map(n => (
              <Card key={n.id} className="shadow-card">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{n.needType}</Badge>
                    <Badge className={n.urgency >= 4 ? 'bg-urgency-critical' : n.urgency === 3 ? 'bg-urgency-moderate' : 'bg-urgency-low'}>U{n.urgency}</Badge>
                  </div>
                  <p className="text-sm">{n.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{n.location}</p>
                  {n.sharedBy && <Badge variant="outline" className="text-xs">Shared by {n.sharedBy}</Badge>}
                  {n.acceptedBy ? (
                    <Badge className="bg-online text-primary-foreground"><CheckCircle className="h-3 w-3 mr-1" />Accepted by {n.acceptedBy}</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleAccept(n.id)} className="text-xs">
                      Accept Need
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
