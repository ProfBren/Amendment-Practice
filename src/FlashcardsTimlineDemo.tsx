import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Confetti from 'react-confetti';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { Button } from './components/ui/button';

// Color scheme
const BG_COLOR = '#004C97'; // Blue background
const CARD_BG = '#FFFFFF'; // White flashcards

type Amendment = { id: number; year: number; title: string; definition: string; };

// Full set of 27 amendments
const amendmentsData: Amendment[] = [
  { id: 1, year: 1791, title: 'First Amendment', definition: 'Freedom of religion, speech, press, assembly, and petition.' },
  { id: 2, year: 1791, title: 'Second Amendment', definition: 'Right to keep and bear arms.' },
  { id: 3, year: 1791, title: 'Third Amendment', definition: 'No quartering of soldiers in private homes without consent.' },
  { id: 4, year: 1791, title: 'Fourth Amendment', definition: 'Protection against unreasonable searches and seizures.' },
  { id: 5, year: 1791, title: 'Fifth Amendment', definition: 'Rights of accused: due process, double jeopardy, self-incrimination, eminent domain.' },
  { id: 6, year: 1791, title: 'Sixth Amendment', definition: 'Right to a speedy and public trial by an impartial jury.' },
  { id: 7, year: 1791, title: 'Seventh Amendment', definition: 'Right to jury trial in civil cases.' },
  { id: 8, year: 1791, title: 'Eighth Amendment', definition: 'Protection against excessive bail/fines and cruel or unusual punishment.' },
  { id: 9, year: 1791, title: 'Ninth Amendment', definition: 'Rights retained by the people even if not enumerated.' },
  { id: 10, year: 1791, title: 'Tenth Amendment', definition: 'Powers not delegated to federal government reserved to states or people.' },
  { id: 11, year: 1798, title: 'Eleventh Amendment', definition: 'Limits ability to sue states in federal court.' },
  { id: 12, year: 1804, title: 'Twelfth Amendment', definition: 'Revises presidential election procedures in Electoral College.' },
  { id: 13, year: 1865, title: 'Thirteenth Amendment', definition: 'Abolishes slavery and involuntary servitude.' },
  { id: 14, year: 1868, title: 'Fourteenth Amendment', definition: 'Defines citizenship; guarantees due process and equal protection.' },
  { id: 15, year: 1870, title: 'Fifteenth Amendment', definition: 'Prohibits denying vote based on race, color, or servitude.' },
  { id: 16, year: 1913, title: 'Sixteenth Amendment', definition: 'Allows Congress to levy income tax.' },
  { id: 17, year: 1913, title: 'Seventeenth Amendment', definition: 'Direct election of U.S. Senators by popular vote.' },
  { id: 18, year: 1919, title: 'Eighteenth Amendment', definition: 'Prohibits manufacture and sale of alcohol (Prohibition).' },
  { id: 19, year: 1920, title: 'Nineteenth Amendment', definition: 'Grants women the right to vote.' },
  { id: 20, year: 1933, title: 'Twentieth Amendment', definition: 'Changes dates for presidential and congressional terms; addresses succession.' },
  { id: 21, year: 1933, title: 'Twenty-first Amendment', definition: 'Repeals Eighteenth Amendment (ends Prohibition).' },
  { id: 22, year: 1951, title: 'Twenty-second Amendment', definition: 'Limits presidents to two terms.' },
  { id: 23, year: 1961, title: 'Twenty-third Amendment', definition: 'Grants Washington, D.C. electors in presidential election.' },
  { id: 24, year: 1964, title: 'Twenty-fourth Amendment', definition: 'Prohibits poll taxes in federal elections.' },
  { id: 25, year: 1967, title: 'Twenty-fifth Amendment', definition: 'Details presidential succession and disability.' },
  { id: 26, year: 1971, title: 'Twenty-sixth Amendment', definition: 'Lowers voting age from 21 to 18.' },
  { id: 27, year: 1992, title: 'Twenty-seventh Amendment', definition: 'Congressional pay changes effective after next election.' }
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Flashcard component: static card, only correct button draggable
function Flashcard({ data, unlocked, onUnlock }: { data: Amendment & { choices: string[] }; unlocked: boolean; onUnlock: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleSelect = (choice: string) => {
    setSelected(choice);
    if (choice === data.title) {
      setFeedback('Please drag the amendment button to the correct year.');
      onUnlock();
    } else {
      setFeedback('Try again');
    }
  };

  return (
    <Card className="w-[30rem] h-60 rounded-2xl shadow-lg bg-white flex">
      <div className="flex-1 p-6 border-r">
        <CardHeader title={data.title} />
        <CardContent>
          <p className="font-semibold mb-2">{data.definition}</p>
          {feedback && <p className={`text-sm ${selected === data.title ? 'text-green-600' : 'text-red-600'}`}>{feedback}</p>}
        </CardContent>
      </div>
      <div className="w-1/2 p-6 flex flex-col justify-start space-y-3">
        {data.choices.map(choice => {
          const isCorrect = choice === data.title;
          const isSelected = choice === selected;
          let btnClass = 'w-full bg-blue-800 text-white';
          if (selected && isSelected) btnClass = isCorrect ? 'bg-green-500' : 'bg-red-500';

          if (isCorrect && unlocked) {
            const [, drag] = useDrag({ type: 'CARD', item: { id: data.id } });
            return <Button ref={drag} key={choice} className={btnClass + ' w-full'}>{choice}</Button>;
          }
          return (
            <Button
              key={choice}
              onClick={!unlocked ? () => handleSelect(choice) : undefined}
              disabled={Boolean(selected)}
              className={btnClass + ' w-full'}
            >{choice}</Button>
          );
        })}
      </div>
    </Card>
  );
}

// TimelineSlot component
function TimelineSlot({ year, id, children, onDrop }: { year: number; id: number; children?: React.ReactNode; onDrop: (cardId: number, slotId: number) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop({ accept: 'CARD', drop: item => onDrop(item.id, id), canDrop: item => item.id === id, collect: m => ({ isOver: m.isOver(), canDrop: m.canDrop() }) });
  return (
    <div ref={drop} className="flex-none w-24 h-24 border-t-2 p-2 relative">
      <span className="absolute -top-6 left-2 text-white font-medium">{id}. {year}</span>
      {children}
    </div>
  );
}

export default function FlashcardsTimelineDemo() {
  const [order, setOrder] = useState(shuffle(amendmentsData));
  const [idx, setIdx] = useState(0);
  const [unlockedIds, setUnlocked] = useState<number[]>([]);
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [confetti, setConfetti] = useState(false);

  const current = order[idx];
  const isUnlocked = unlockedIds.includes(current.id);
  const distractors = shuffle(order.filter(a => a.id !== current.id)).slice(0,3).map(a => a.title);
  const choices = shuffle([current.title, ...distractors]);

  const handleUnlock = () => setUnlocked(prev => [...prev, current.id]);
  const handleDrop = (cardId: number, slotId: number) => {
    setPlaced(prev => ({ ...prev, [slotId]: true }));
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
    if (idx < order.length - 1) setIdx(idx + 1);
  };
  const handleShuffleAll = () => { setOrder(shuffle(amendmentsData)); setIdx(0); setUnlocked([]); setPlaced({}); };

  return (
    <DndProvider backend={HTML5Backend}>
      {confetti && <Confetti />}
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: BG_COLOR }}>
        <h1 className="text-3xl font-bold text-white mb-6">Santa Fe Learning Commons Amendment Practice</h1>
        <Button onClick={handleShuffleAll} className="mb-4">Shuffle Cards</Button>
        <Flashcard key={current.id} data={{ ...current, choices }} unlocked={isUnlocked} onUnlock={handleUnlock} />
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Timeline (1791–1992)</h2>
        <div className="w-full px-8 flex space-x-2 overflow-x-auto">
          {amendmentsData.map(a => (
            <TimelineSlot key={a.id} id={a.id} year={a.year} onDrop={handleDrop}>
              {placed[a.id] && <p className="text-sm text-white mt-2">{a.title}</p>}
            </TimelineSlot>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
