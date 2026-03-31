import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NEED_TYPES, WARDS } from '@/lib/mockData';
import { Send, Bot, User, CheckCircle, MapPin, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { role: 'bot' | 'user'; text: string };
type Step = 'need' | 'urgency' | 'area' | 'people' | 'confirm' | 'done';

const botQuestions: Record<Exclude<Step, 'confirm' | 'done'>, string> = {
  need: "Hello! I'm your CommunityBridge field assistant. 👋\n\nWhat is the community need you'd like to report? (e.g., Food shortage, Medical emergency, Education gap, Infrastructure damage, or Other)",
  urgency: "How urgent is this need on a scale of 1–5?\n\n1 = Low priority\n3 = Moderate\n5 = Critical emergency",
  area: `Which area or ward is affected?\n\nOptions: ${WARDS.join(', ')}`,
  people: "Approximately how many people are affected?",
};

export default function Chatbot() {
  const { addNeed, isOnline } = useApp();
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: botQuestions.need }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<Step>('need');
  const [data, setData] = useState<{ needType?: string; urgency?: number; location?: string; peopleAffected?: number; description?: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMsg = (role: 'bot' | 'user', text: string) => setMessages(prev => [...prev, { role, text }]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    addMsg('user', userInput);
    setInput('');

    setTimeout(() => {
      if (step === 'need') {
        const matched = NEED_TYPES.find(t => userInput.toLowerCase().includes(t.toLowerCase())) || 'Other';
        setData(prev => ({ ...prev, needType: matched, description: userInput }));
        addMsg('bot', `Got it — "${matched}" need recorded.\n\n${botQuestions.urgency}`);
        setStep('urgency');
      } else if (step === 'urgency') {
        const num = parseInt(userInput);
        if (num >= 1 && num <= 5) {
          setData(prev => ({ ...prev, urgency: num }));
          addMsg('bot', `Urgency level ${num} noted.\n\n${botQuestions.area}`);
          setStep('area');
        } else {
          addMsg('bot', 'Please enter a number between 1 and 5.');
        }
      } else if (step === 'area') {
        const matched = WARDS.find(w => userInput.toLowerCase().includes(w.toLowerCase().split(' - ')[1] || '')) || WARDS.find(w => userInput.includes(w)) || userInput;
        setData(prev => ({ ...prev, location: matched }));
        addMsg('bot', `Location: ${matched}\n\n${botQuestions.people}`);
        setStep('people');
      } else if (step === 'people') {
        const num = parseInt(userInput);
        if (num > 0) {
          const finalData = { ...data, peopleAffected: num };
          setData(finalData);
          addMsg('bot', '✅ Report compiled! Here\'s your summary:');
          setStep('confirm');
          // Auto-submit
          addNeed({
            needType: (finalData.needType as any) || 'Other',
            urgency: finalData.urgency || 1,
            location: finalData.location || 'Unknown',
            peopleAffected: num,
            description: finalData.description || '',
            syncStatus: isOnline ? 'synced' : 'pending',
          });
          setTimeout(() => setStep('done'), 100);
        } else {
          addMsg('bot', 'Please enter a valid number of people affected.');
        }
      }
    }, 500);
  };

  const resetChat = () => {
    setMessages([{ role: 'bot', text: botQuestions.need }]);
    setStep('need');
    setData({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-display font-bold">AI Field Data Chatbot</h1>
        <p className="text-sm text-muted-foreground">Report community needs through guided conversation</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-card overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {(step === 'confirm' || step === 'done') && data.needType && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-display font-semibold">
                    <CheckCircle className="h-5 w-5" /> Need Report Submitted
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Need Type</p><p className="font-medium">{data.needType}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={data.urgency! >= 4 ? 'bg-urgency-critical' : data.urgency === 3 ? 'bg-urgency-moderate' : 'bg-urgency-low'}>
                        Urgency: {data.urgency}/5
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{data.location}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">People Affected</p><p className="font-medium">{data.peopleAffected}</p></div>
                    </div>
                  </div>
                  <Badge variant="outline" className={isOnline ? 'text-synced border-synced' : 'text-pending border-pending'}>
                    {isOnline ? '✅ Synced' : '⏳ Pending Sync'}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </CardContent>

        <div className="border-t p-4">
          {step === 'done' ? (
            <Button onClick={resetChat} className="w-full gradient-primary text-primary-foreground">
              Report Another Need
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your response..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="gradient-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
