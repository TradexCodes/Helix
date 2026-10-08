
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewExam() {
  const router = useRouter();

  const [course, setCourse] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [topics, setTopics] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const topicList = topics
      .split("\n")
      .map((topic) => topic.trim())
      .filter(Boolean);

    if (
      !course.trim() ||
      !examName.trim() ||
      !examDate ||
      topicList.length === 0
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const newExam = {
      id: Date.now(),
      course: course.trim(),
      examName: examName.trim(),
      examDate,
      topics: topicList.map((name) => ({
        name,
        mastery: 0,
        completed: false,
      })),
    };

    localStorage.setItem("helixExam", JSON.stringify(newExam));

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
        <Link href="/" className="text-2xl font-bold">
          HELIX
        </Link>

        <Link href="/dashboard" className="text-sm text-zinc-400">
          Cancel
        </Link>
      </nav>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-zinc-500">
          NEW EXAM
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          What are you preparing for?
        </h1>

        <p className="mt-3 text-zinc-400">
          Add your exam details and Helix will help you build
          a personalized study plan.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="course"
              className="mb-2 block text-sm font-medium"
            >
              Course
            </label>

            <input
              id="course"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="examName"
              className="mb-2 block text-sm font-medium"
            >
              Exam name
            </label>

            <input
              id="examName"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. Exam 2"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="examDate"
              className="mb-2 block text-sm font-medium"
            >
              Exam date
            </label>

            <input
              id="examDate"
              required
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="topics"
              className="mb-2 block text-sm font-medium"
            >
              Topics
            </label>

            <textarea
              id="topics"
              required
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder={"Newman Projections\nCycloalkanes\nAlkanes"}
              rows={6}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
            />

            <p className="mt-2 text-sm text-zinc-500">
              Enter one topic per line.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Create Exam
          </button>
        </form>
      </section>
    </main>
  );
}
