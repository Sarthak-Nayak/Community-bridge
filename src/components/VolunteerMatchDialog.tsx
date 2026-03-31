import { useApp } from '@/contexts/AppContext';
import { SKILL_TO_NEED } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Car, Calendar } from 'lucide-react';

interface Props {
  needId: string;
  onClose: () => void;
}

export function VolunteerMatchDialog({ needId, onClose }: Props) {
  const { needs, volunteers } = useApp();
  const need = needs.find(n => n.id === needId);
  if (!need) return null;

  const relevantSkills = SKILL_TO_NEED[need.needType] || [];

  const scored = volunteers.map(v => {
    let score = 0;
    // Skill match
    const skillMatch = v.skills.filter(s => relevantSkills.includes(s)).length;
    score += skillMatch * 3;
    // Location match
    if (v.location === need.location) score += 5;
    // Transport bonus
    if (v.hasTransport) score += 1;
    // Availability bonus
    score += Math.min(v.availability.length, 3);
    return { volunteer: v, score };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Top Matched Volunteers</DialogTitle>
          <p className="text-sm text-muted-foreground">{need.needType} need in {need.location}</p>
        </DialogHeader>
        <div className="space-y-3">
          {scored.map(({ volunteer: v, score }, i) => (
            <Card key={v.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar><AvatarFallback className="gradient-primary text-primary-foreground font-semibold">{v.avatar}</AvatarFallback></Avatar>
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{v.location}
                      {v.hasTransport && <><Car className="h-3 w-3 ml-2" />Has transport</>}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">Score: {score}</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {v.skills.map(s => (
                    <Badge key={s} variant={relevantSkills.includes(s) ? 'default' : 'outline'} className={`text-xs ${relevantSkills.includes(s) ? 'bg-primary' : ''}`}>
                      {s}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />Available: {v.availability.map(d => d.slice(0, 3)).join(', ')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
