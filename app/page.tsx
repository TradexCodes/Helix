
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <nav className="flex items-center justify-between border-b border-zinc-800 px-8 py-6">
        <span className="text-2xl font-bold tracking-tight">
          HELIX
        </span>

        <Link
          href="/dashboard"
          className="rounded-xl border border-zinc-700 px-5 py-2 text-sm hover:bg-zinc-900"
        >
          Dashboard
        </Link>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="rounded-full border border-zinc-800 bg-zinc-950 px-5 py-2 text-sm text-zinc-400">
          Adaptive study planning
        </div>

        <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-7xl">
          Study smarter.
          <span className="block text-zinc-500">
            Adapt faster.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
          Your study plan should adapt when life does.
          Helix helps you prioritize difficult topics,
          organize your study time, and track your progress
          before exam day.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/new-exam"
            className="rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-700 px-7 py-4 font-semibold transition hover:bg-zinc-900"
          >
            Open Dashboard
          </Link>
        </div>

        <div className="mt-20 grid w-full gap-5 text-left sm:grid-cols-3">
          {[
            {
              title: "Plan",
              description:
                "Create exams and organize the topics you need to study.",
            },
            {
              title: "Prioritize",
              description:
                "Spend more time on the topics you understand least.",
            },
            {
              title: "Progress",
              description:
                "Track completed topics and update your study plan.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h2 className="text-xl font-semibold">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-sm text-zinc-500">
        HELIX — Built for better studying.
      </footer>
    </main>
  );
}
