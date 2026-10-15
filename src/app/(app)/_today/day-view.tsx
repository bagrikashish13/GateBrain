"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DatePicker, type When } from "./date-picker";
import { DayHeading } from "./day-heading";
import { DayTimer } from "./day-timer";
import { ExamCountdown } from "./exam-countdown";
import { RevisionCard } from "./revision-card";
import { TasksCard } from "./tasks-card";
import { TestsCard } from "./tests-card";
import type { TodayData } from "./types";

/**
 * Today (same as secondBrain): the weekday on the left and the date as three drums on the right; on
 * today, the time left in the day and the days left to GATE; then the selected day's revision and
 * tasks, and on today the tests.
 */
export function DayView({ data }: { data: TodayData }) {
  const { today, plans, years } = data;
  const [selected, setSelected] = useState(today);
  const still = useReducedMotion() ?? false;

  const open = (date: string) => plans[date]?.filter((t) => !t.done && !t.moved).length ?? 0;
  const slipped = useMemo(() => new Set(Object.keys(plans).filter((d) => d < today && plans[d].some((t) => !t.done && !t.moved))), [plans, today]);
  const when: When = selected === today ? "today" : selected < today ? "past" : "future";
  const inRange = (d: string) => years.includes(Number(d.slice(0, 4)));

  return (
    <>
      <h1 className="sr-only">Today</h1>
      <div className="flex items-center gap-2">
        <DayHeading date={selected} today={today} when={when} open={open(selected)} onToday={() => setSelected(today)} />
        <DatePicker date={selected} years={years} slipped={slipped} onChange={(d) => inRange(d) && setSelected(d)} />
      </div>

      <AnimatePresence initial={false}>
        {when === "today" && (
          <motion.div
            key="timer"
            className="grid gap-3 overflow-hidden"
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={still ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <DayTimer />
            {data.examDays !== null && <ExamCountdown days={data.examDays} date={data.examDate!} />}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={selected}
        className="grid gap-4"
        initial={still ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {when === "today" && <TestsCard tests={data.tests} />}
        <RevisionCard date={selected} today={today} revision={data.revision} subjects={data.subjects} />
        <TasksCard date={selected} today={today} tasks={plans[selected] ?? []} subjects={data.subjects} />
      </motion.div>
    </>
  );
}
