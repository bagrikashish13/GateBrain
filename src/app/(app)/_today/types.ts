import type { Rating4 } from "@/lib/revision/ratings";
import type { Task } from "@/lib/plan/tasks";

// What the Today screen gets from the server.

export type SubjectChip = { key: string; short: string; colour: string; studied: boolean };
export type DayRev = { id: string; title: string; subject: string; rating: Rating4 | null };
export type DueRev = { id: string; title: string; subject: string; overdue: number; weak: boolean; fresh: boolean };

export type TodayData = {
  today: string;
  years: number[];
  plans: Record<string, Task[]>;
  revision: {
    due: DueRev[];
    done: DayRev[];
    later: number;
    notes: number;
    history: Record<string, DayRev[]>;
    upcoming: Record<string, DayRev[]>;
  };
  subjects: SubjectChip[];
  examDays: number | null;
  examDate: string | null;
  tests: {
    running: { id: string; title: string; minutesLeft: number }[];
    next: { id: string; title: string; questions: number; duration: number } | null;
    last: { id: string; attempt: string; title: string; score: number; max: number } | null;
  };
};
