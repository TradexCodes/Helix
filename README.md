# HELIX — Adaptive Study Planner

Helix is a web application that helps students prepare for exams by generating personalized study schedules based on their understanding of topics, available study time, and upcoming exam dates.

**Live Demo:** https://helix-gold.vercel.app

## Features

- **Exam Planning:** Create an exam with a deadline and study topics.
- **Adaptive Scheduling:** Automatically allocate more study time to topics with lower mastery ratings.
- **Progress Tracking:** Mark topics as completed and monitor overall progress.
- **Dynamic Replanning:** Regenerate study schedules as topic mastery changes.
- **Local Storage:** Save exam details and progress in the browser.
- **Responsive Design:** Use Helix on desktop and mobile devices.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Browser localStorage
- Vercel

## How It Works

1. Create an exam and enter the topics you need to study.
2. Rate your understanding of each topic.
3. Set the number of minutes available for daily studying.
4. Generate a personalized study plan.
5. Mark topics complete and regenerate the schedule as you improve.

Helix uses a weighted scheduling algorithm to prioritize weaker topics while keeping the total daily study time within the user's selected limit.

## Run Locally

```bash
git clone https://github.com/TradexCodes/helix.git
cd helix
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Current Scope

Helix currently supports one saved exam at a time. Exam details and progress are stored locally in the browser, while generated schedules can be rebuilt as needed.

## Links

- **Live Application:** https://helix-gold.vercel.app
- **GitHub Repository:** https://github.com/TradexCodes/helix
