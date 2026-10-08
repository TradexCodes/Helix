
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Topic = {
  name: string;
  mastery: number;
  completed: boolean;
};

type Exam = {
  id: number;
  course: string;
  examName: string;
  examDate: string;
  topics: Topic[];
};

type StudySession = {
  day: number;
  topic: string;
  minutes: number;
};

const ratings = ["Don't know", "Weak", "Okay", "Know it"];

function daysUntil(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.round((target.getTime() - today.getTime()) / 86400000)
  );
}

function generateStudyPlan(
  topics: Topic[],
  days: number,
  dailyMinutes: number
): StudySession[] {
  const unfinished = topics
    .filter((topic) => !topic.completed)
    .sort((a, b) => a.mastery - b.mastery);

  if (unfinished.length === 0 || days <= 0) {
    return [];
  }

  const weights = unfinished.map((topic) => 4 - topic.mastery);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  const plan: StudySession[] = [];

  for (let day = 1; day <= days; day++) {
    let remaining = dailyMinutes;

    const sessions = unfinished.map((topic, index) => {
      const minutes = Math.floor(
        (dailyMinutes * weights[index]) / totalWeight
      );

      remaining -= minutes;

      return {
        day,
        topic: topic.name,
        minutes,
      };
    });

    let index = 0;

    while (remaining > 0) {
      sessions[index % sessions.length].minutes++;
      remaining--;
      index++;
    }

    plan.push(...sessions.filter((session) => session.minutes > 0));
  }

  return plan;
}

export default function Dashboard() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [minutes, setMinutes] = useState(60);
  const [plan, setPlan] = useState<StudySession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("helixExam");

      if (saved) {
        const parsed = JSON.parse(saved);

        const topics: Topic[] = parsed.topics.map(
          (topic: string | Topic) =>
            typeof topic === "string"
              ? { name: topic, mastery: 0, completed: false }
              : topic
        );

        setExam({ ...parsed, topics });
      }

      const savedMinutes = localStorage.getItem("helixMinutes");

      if (savedMinutes) {
        setMinutes(Number(savedMinutes));
      }
    } catch (error) {
      console.error("Could not load exam:", error);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !exam) return;

    localStorage.setItem("helixExam", JSON.stringify(exam));
  }, [exam, loaded]);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("helixMinutes", String(minutes));
  }, [minutes, loaded]);

  function updateTopic(index: number, changes: Partial<Topic>) {
    setExam((current) => {
      if (!current) return null;

      return {
        ...current,
        topics: current.topics.map((topic, i) =>
          i === index ? { ...topic, ...changes } : topic
        ),
      };
    });

    setPlan([]);
  }

  function buildPlan() {
    if (!exam) return;

    setPlan(
      generateStudyPlan(
        exam.topics,
        daysUntil(exam.examDate),
        minutes
      )
    );
  }

  function deleteExam() {
    if (!window.confirm("Delete this exam and its progress?")) {
      return;
    }

    localStorage.removeItem("helixExam");
    setExam(null);
    setPlan([]);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        Loading Helix...
      </main>
    );
  }

  const topics = exam?.topics || [];

  const completed = topics.filter((topic) => topic.completed).length;

  const progress = topics.length
    ? Math.round((completed / topics.length) * 100)
    : 0;

  const readiness = topics.length
    ? Math.round(
        (topics.reduce((sum, topic) => sum + topic.mastery, 0) /
          (topics.length * 3)) *
          100
      )
    : 0;

  const days = exam ? daysUntil(exam.examDate) : 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
        <Link href="/" className="text-2xl font-bold">
          HELIX
        </Link>

        <Link
          href="/new-exam"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          + New Exam
        </Link>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          YOUR WORKSPACE
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-zinc-400">
          A study plan that adapts to your progress.
        </p>

        {!exam ? (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No exams yet
            </h2>

            <p className="mt-3 text-zinc-400">
              Create an exam to get started.
            </p>

            <Link
              href="/new-exam"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black"
            >
              Create Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    {exam.course}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {exam.examName}
                  </h2>

                  <p className="mt-2 text-zinc-400">
                    {days === 0
                      ? "Exam is today or has passed"
                      : `${days} days remaining`}
                  </p>
                </div>

                <button
                  onClick={deleteExam}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Delete Exam
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-400">
                    Topics completed
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {completed}/{topics.length}
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-400">
                    Completion
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {progress}%
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-400">
                    Self-rated readiness
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {readiness}%
                  </p>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold">
                Your topics
              </h2>

              <p className="mt-2 text-zinc-400">
                Rate your understanding of each topic.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {topics.map((topic, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">
                        {topic.name}
                      </h3>

                      <label className="flex items-center gap-2 text-sm text-zinc-400">
                        <input
                          type="checkbox"
                          checked={topic.completed}
                          onChange={(e) =>
                            updateTopic(index, {
                              completed: e.target.checked,
                            })
                          }
                        />
                        Done
                      </label>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {ratings.map((rating, value) => (
                        <button
                          key={rating}
                          onClick={() =>
                            updateTopic(index, { mastery: value })
                          }
                          className={`rounded-lg border px-3 py-2 text-sm transition ${
                            topic.mastery === value
                              ? "border-white bg-white text-black"
                              : "border-zinc-700 text-zinc-400 hover:border-zinc-400"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h2 className="text-2xl font-semibold">
                Adaptive Study Planner
              </h2>

              <p className="mt-2 text-zinc-400">
                Helix prioritizes topics you understand less.
              </p>

              <label
                htmlFor="studyMinutes"
                className="mt-6 block text-sm font-medium"
              >
                How many minutes can you study each day?
              </label>

              <input
                id="studyMinutes"
                type="number"
                min={15}
                max={600}
                value={minutes}
                onChange={(e) =>
                  setMinutes(
                    Math.min(
                      600,
                      Math.max(15, Number(e.target.value) || 15)
                    )
                  )
                }
                className="mt-3 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
              />

              <button
                onClick={buildPlan}
                className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-zinc-200"
              >
                Build My Study Plan
              </button>
            </div>

            {plan.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">
                  Your personalized study plan
                </h2>

                <p className="mt-2 text-zinc-400">
                  Update your topic ratings and rebuild your plan
                  whenever your understanding changes.
                </p>

                <div className="mt-6 space-y-5">
                  {Array.from(
                    new Set(plan.map((session) => session.day))
                  ).map((day) => (
                    <div
                      key={day}
                      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                    >
                      <h3 className="text-lg font-semibold">
                        Day {day}
                      </h3>

                      <div className="mt-4 space-y-3">
                        {plan
                          .filter((session) => session.day === day)
                          .map((session, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-4 rounded-xl bg-zinc-900 px-4 py-3"
                            >
                              <span>{session.topic}</span>

                              <span className="shrink-0 text-sm text-zinc-400">
                                {session.minutes} min
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topics.length > 0 &&
              completed === topics.length &&
              plan.length === 0 && (
                <p className="mt-8 text-center text-zinc-400">
                  All topics completed!
                </p>
              )}
          </>
        )}
      </section>
    </main>
  );
}
