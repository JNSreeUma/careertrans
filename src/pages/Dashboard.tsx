import { useEffect, useState } from "react";
import { CheckSquare, Flame, BookOpen, Briefcase } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  category: string;
  status: string;
  startDate?: string;
  endDate?: string;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
const [skills, setSkills] = useState<any[]>([]);
const [goals, setGoals] = useState<any[]>([]);
const [jobs, setJobs] = useState<any[]>([]);

  // ✅ FETCH TASKS FROM BACKEND
 const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");

  try {
    const [tasksRes, skillsRes, goalsRes, jobsRes] = await Promise.all([
      fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      }),
       fetch("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const tasksData = await tasksRes.json();
    const skillsData = await skillsRes.json();
    const goalsData = await goalsRes.json();
    const jobsData = await jobsRes.json();

    setTasks(Array.isArray(tasksData) ? tasksData : []);
    setSkills(Array.isArray(skillsData) ? skillsData : []);
    setGoals(Array.isArray(goalsData) ? goalsData : []);
    setJobs(Array.isArray(jobsData) ? jobsData : []);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 📅 TODAY LOGIC
const todayOnly = new Date().toISOString().slice(0, 10);

//  const todayStr = new Date().toISOString().split("T")[0];

const todayTasks = tasks.filter((t) => {
  if (!t.startDate || !t.endDate) return false;

  const start = new Date(t.startDate).toISOString().slice(0, 10);
  const end = new Date(t.endDate).toISOString().slice(0, 10);

  return todayOnly >= start && todayOnly <= end;
});
  const completedToday = todayTasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const todayProgress =
    todayTasks.length === 0
      ? 0
      : Math.round((completedToday / todayTasks.length) * 100);

  // 📊 STATS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "Pending"
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
const calculateStreak = () => {
  if (tasks.length === 0) return 0;

  const completedDates = tasks
    .filter((t) => t.status === "Completed" && t.startDate)
    .map((t) => {
      // ✅ tell TS it's not undefined
      const date = t.startDate as string;
      return new Date(date).toISOString().slice(0, 10);
    });

  const uniqueDates = [...new Set(completedDates)].sort().reverse();

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = currentDate.toISOString().slice(0, 10);

    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const streak = calculateStreak();

  // 🧠 SKILLS
  // const skills = ["Career", "Learning", "Interview", "Job"];

  // const skillProgress = skills.map((skill) => {
  //   const skillTasks = tasks.filter((t) => t.category === skill);
  //   const completed = skillTasks.filter(
  //     (t) => t.status === "Completed"
  //   ).length;

  //   const total = skillTasks.length || 1;

  //   return {
  //     name: skill,
  //     percent: Math.round((completed / total) * 100),
  //   };
  // });

  // 🎯 GOALS
  // const goals = [
  //   { title: "Complete 50 Tasks", value: completedTasks, target: 50 },
  //   { title: "Total Tasks 100", value: totalTasks, target: 100 },
  // ];

  // 📈 WEEKLY PROGRESS
//  const getLast7Days = () => {
//   const days = [];
//   const today = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const d = new Date();
//     d.setDate(today.getDate() - i);

//     // ✅ normalize time (important)
//     d.setHours(0, 0, 0, 0);

//     days.push(d);
//   }

//   return days;
// };

//   const last7Days = getLast7Days();

// const weeklyData = last7Days.map((day) => {
//   const dayOnly = day.toISOString().slice(0, 10);

//   const dayTasks = tasks.filter((t) => {
//     if (!t.startDate || !t.endDate) return false;

//     const start = new Date(t.startDate).toISOString().slice(0, 10);
//     const end = new Date(t.endDate).toISOString().slice(0, 10);

//     return dayOnly >= start && dayOnly <= end;
//   });

//   const completed = dayTasks.filter(
//     (t) => t.status === "Completed"
//   ).length;

//   return dayTasks.length === 0
//     ? 0
//     : Math.round((completed / dayTasks.length) * 100);
// });
// console.log("WEEKLY DATA:", weeklyData);

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* 🔢 STATS */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  {/* Tasks Today */}
  <div className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex items-center gap-3">
    <CheckSquare className="text-purple-400" />
    <div>
      <p className="text-xl font-semibold">{todayTasks.length}</p>
      <p className="text-gray-400 text-sm">Tasks Today</p>
    </div>
  </div>

  {/* Day Streak */}
  <div className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex items-center gap-3">
    <Flame className="text-orange-400" />
    <div>
      <p className="text-xl font-semibold">{streak}</p> {/* we’ll make dynamic later */}
      <p className="text-gray-400 text-sm">Day Streak</p>
    </div>
  </div>

  {/* Skills */}
  <div className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex items-center gap-3">
    <BookOpen className="text-purple-400" />
    <div>
      <p className="text-xl font-semibold">{skills.length}</p>
      <p className="text-gray-400 text-sm">Skills Learning</p>
    </div>
  </div>

  {/* Jobs */}
  <div className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex items-center gap-3">
    <Briefcase className="text-purple-400" />
    <div>
      <p className="text-xl font-semibold">{jobs.length}</p>
      <p className="text-gray-400 text-sm">Jobs Tracked</p>
    </div>
  </div>

</div>

      {/* 📅 TODAY PROGRESS */}
      <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
        <h2 className="text-lg mb-4">Today's Progress</h2>

        <p className="text-2xl font-bold">{todayProgress}%</p>

        <div className="h-2 bg-gray-700 rounded mt-2">
          <div
            className="h-2 bg-purple-500 rounded"
            style={{ width: `${todayProgress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {completedToday}/{todayTasks.length} tasks completed
        </p>
      </div>

      {/* 📊 WEEKLY + TODAY */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* WEEKLY */}
        {/* <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
          <h2 className="text-lg mb-4">Weekly Progress</h2>

          <div className="flex items-end justify-between h-32">
  {last7Days.map((day, index) => (
    <div key={index} className="flex flex-col items-center w-full">

      <div
        className="bg-purple-500 w-3 rounded"
        style={{ height: `${weeklyData[index]}%` }}
      />

      <span className="text-xs text-gray-400">
        {day.toLocaleDateString("en-US", { weekday: "short" })}
      </span>

    </div>
  ))}
</div>
        </div> */}

        {/* TODAY FOCUS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
          <h2 className="text-lg mb-4">Today's Focus</h2>

          {todayTasks.length === 0 ? (
            <p className="text-gray-500">No tasks for today</p>
          ) : (
            todayTasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-2 bg-gray-800 p-3 rounded mb-2"
              >
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  readOnly
                />

                <span
                  className={`${
                    task.status === "Completed"
                      ? "line-through text-gray-500"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🧠 SKILLS + GOALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* SKILLS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
          <h2 className="text-lg mb-4">Skill Progress</h2>

          {skills.length === 0 ? (
  <p className="text-gray-400">No skills</p>
) : (
  skills.slice(0, 4).map((skill) => {
    const start = new Date(skill.startDate);
    const end = new Date(skill.endDate);
    const today = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const completedDays = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const safeCompleted = Math.max(
      0,
      Math.min(completedDays, totalDays)
    );

    const progress =
      totalDays > 0 ? (safeCompleted / totalDays) * 100 : 0;

    return (
      <div key={skill._id} className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{skill.name}</span>
          <span>{safeCompleted}/{totalDays}</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded">
          <div
            className="bg-purple-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  })
)}
        </div>

        {/* GOALS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
          <h2 className="text-lg mb-4">Goals</h2>

          {goals.length === 0 ? (
  <p className="text-gray-400">No goals</p>
) : (
  goals.slice(0, 4).map((goal) => {
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const today = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const completedDays = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const safeCompleted = Math.max(
      0,
      Math.min(completedDays, totalDays)
    );

    const progress =
      totalDays > 0 ? (safeCompleted / totalDays) * 100 : 0;

    return (
      <div key={goal._id} className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{goal.title}</span>
          <span>{safeCompleted}/{totalDays}</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  })
)}
        </div>

      </div>
    </div>
  );
}