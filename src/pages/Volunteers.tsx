import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SKILLS, DAYS, WARDS } from '@/lib/mockData';
import { Plus, Trophy, MapPin, Car, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Volunteers() {
  const { volunteers, addVolunteer } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [hasTransport, setHasTransport] = useState(false);

  const leaderboard = [...volunteers].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const handleSubmit = () => {
    if (!name || !location || skills.length === 0) return;
    addVolunteer({ name, skills, availability: avail, location, hasTransport });
    setShowForm(false);
    setName(''); setSkills([]); setAvail([]); setLocation(''); setHasTransport(false);
  };

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDay = (d: string) => setAvail(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Volunteer Management</h1>
          <p className="text-sm text-muted-foreground">Register and match volunteers to community needs</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />Register Volunteer
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">New Volunteer Registration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" /></div>
                <div>
                  <Label>Location / Ward</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                    <SelectContent>{WARDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Skills (select multiple)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILLS.map(s => (
                    <Badge key={s} variant={skills.includes(s) ? 'default' : 'outline'}
                      className={`cursor-pointer ${skills.includes(s) ? 'bg-primary' : ''}`}
                      onClick={() => toggleSkill(s)}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Availability</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DAYS.map(d => (
                    <Badge key={d} variant={avail.includes(d) ? 'default' : 'outline'}
                      className={`cursor-pointer ${avail.includes(d) ? 'bg-secondary text-secondary-foreground' : ''}`}
                      onClick={() => toggleDay(d)}>{d.slice(0, 3)}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={hasTransport} onCheckedChange={setHasTransport} />
                <Label>Has personal transport</Label>
              </div>
              <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">Submit Registration</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="directory">
        <TabsList><TabsTrigger value="directory">Directory</TabsTrigger><TabsTrigger value="leaderboard">Leaderboard</TabsTrigger></TabsList>

        <TabsContent value="directory">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback className="gradient-primary text-primary-foreground font-semibold">{v.avatar}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {v.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{v.availability.length} days/week</span>
                      <span className="flex items-center gap-1">{v.hasTransport && <><Car className="h-3 w-3" />Transport</>}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{v.tasksCompleted} tasks completed</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-2">
              {leaderboard.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-display font-bold text-lg w-8 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <Avatar className="h-8 w-8"><AvatarFallback className="gradient-primary text-primary-foreground text-xs">{v.avatar}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-urgency-moderate" />
                    <span className="font-display font-bold">{v.tasksCompleted}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
