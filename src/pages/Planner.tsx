import { useState, useEffect } from "react";

type Task = {
  _id: string;
  title: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
};

export default function Planner() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
const [showGoalModal, setShowGoalModal] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);


  const [skills, setSkills] = useState<any[]>([]);
  const [skillName, setSkillName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalName, setGoalName] = useState("");
const [goalStartDate, setGoalStartDate] = useState("");
const [goalEndDate, setGoalEndDate] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Career");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [skill, setSkill] = useState("");

  // ✅ FILTER STATES
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");


  // ✅ FETCH
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(await res.json());
  };
  //   const fetchGoals = async () => {
  //   const token = localStorage.getItem("token");

  //   const res = await fetch("http://localhost:5000/api/goals", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   const data = await res.json();
  //   setGoals(data);
  // };
  const fetchSkills = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/skills", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("SKILLS:", data);

    if (Array.isArray(data)) {
      setSkills(data);
    } else {
      setSkills([]);
    }
  };
  const fetchGoals = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/goals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (Array.isArray(data)) setGoals(data);
  else setGoals([]);
};
  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchSkills();
  }, []);

  // ✅ ADD TASK
  // const addTask = async () => {
  //   await fetch("http://localhost:5000/api/tasks", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ title, category, startDate, endDate }),
  //   });

  //   setShowModal(false);
  //   fetchTasks();
  // };
  const addTask = async () => {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      category,
      startDate,
      endDate,
      skill, // 🔥 THIS IS IMPORTANT
    }),
  });

  setShowModal(false);
  setTitle("");
  setSkill("");
  fetchTasks();
};

  // ✅ UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchTasks();
  };
  const deleteTask = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };
  const addSkill = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: skillName,
        current: 0,
        progress: 0,
        startDate,
        endDate,
      }),
    });

    const data = await res.json();
    console.log("ADDED:", data);

    fetchSkills();
  };
  const updateSkill = async (skill: any) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/skills/${skill._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current: skill.current + 1,
          }),
        }
      );

      const data = await res.json();
      console.log("UPDATED:", data);

      fetchSkills(); // refresh UI
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  const deleteSkill = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("DELETED:", data);

      fetchSkills(); // refresh UI
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
 const addGoal = async () => {
  const token = localStorage.getItem("token");

  if (!goalName || !goalStartDate || !goalEndDate) return;

  await fetch("http://localhost:5000/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: goalName, // ✅ FIXED
      startDate: goalStartDate,
      endDate: goalEndDate,
    }),
  });

  fetchGoals();

  setGoalName("");
  setGoalStartDate("");
  setGoalEndDate("");
  setShowGoalModal(false);
};
const deleteGoal = async (id: string) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/goals/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchGoals();
};
  const calculateProgress = (skill: any) => {
    const start = new Date(skill.startDate);
    const end = new Date(skill.endDate);
    const today = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const completedDays = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const safeCompleted = Math.max(0, Math.min(completedDays, totalDays));

    const progress = (safeCompleted / totalDays) * 100;

    return {
      totalDays,
      completedDays: safeCompleted,
      progress,
    };
  };


  // ✅ FILTER LOGIC
  // const filteredTasks = tasks.filter((task) => {
  //   const categoryMatch =
  //     categoryFilter === "All" || task.category === categoryFilter;

  //   const statusMatch =
  //     statusFilter === "All" || task.status === statusFilter;

  //   return categoryMatch && statusMatch;
  // });

  const todayTasks = tasks.filter(
    (task) =>
      task.startDate &&
      new Date(task.startDate).toISOString().split("T")[0] === today
  );

  return (
    <div className="p-6 space-y-6 text-white">

      <h1 className="text-xl font-semibold">Planner</h1>

      {/* 📋 TASKS - FULL WIDTH */}
      <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Today's Tasks</h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 px-4 py-2 rounded text-sm"
          >
            + Add Task
          </button>
        </div>

        {/* TASK LIST */}
        {todayTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No tasks for today
          </p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
              >
                <div>
                  <p className={`${
    task.status === "Completed"
      ? "line-through text-gray-500"
      : ""
  }`}>{task.title}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
    task.category === "Career"
      ? "bg-purple-500/20 text-purple-400"
      : task.category === "Learning"
      ? "bg-blue-500/20 text-blue-400"
      : task.category === "Interview"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-gray-500/20 text-gray-400"
  }`}>
                    {task.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">

{/* STATUS */}
<select
  value={task.status}
  onChange={(e) =>
    updateStatus(task._id, e.target.value)
  }
  className={`p-1 rounded text-sm ${
    task.status === "Completed"
      ? "bg-green-500/20 text-green-400"
      : task.status === "In Progress"
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-red-500/20 text-red-400"
  }`}
>
  <option>Pending</option>
  <option>In Progress</option>
  <option>Completed</option>
</select>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    🗑️
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      {/* 🧠 SKILLS + 🎯 GOALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/*SKILLS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
<div className="flex justify-between items-center mb-4">
          <h2 className="text-lg mb-4">Skills</h2>

          {/* ADD */}
          

            {/* <input
      value={skillName}
      onChange={(e) => setSkillName(e.target.value)}
      placeholder="Skill name"
      className="bg-gray-800 p-2 rounded"
    /> */}

            {/* <div className="flex gap-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="bg-gray-800 p-2 rounded w-full"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="bg-gray-800 p-2 rounded w-full"
      />
    </div> */}

            <button
              onClick={() => setShowSkillModal(true)}
              className="bg-purple-600 px-3 py-2 rounded"
            >
              + Add Skill
            </button>

          </div>

          {/* LIST */}
          {skills.length === 0 ? (
            <p className="text-gray-400">No skills yet</p>
          ) : (
            skills.map((skill) => {
              // 🧠 CALCULATE PROGRESS
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
                <div key={skill._id} className="mb-4">

                  {/* HEADER */}
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>
                      {safeCompleted} / {totalDays} days
                    </span>
                  </div>

                  {/* CLEAN DATE FORMAT */}
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(skill.startDate).toLocaleDateString()} →{" "}
                    {new Date(skill.endDate).toLocaleDateString()}
                  </p>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div
                      className="bg-purple-500 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* DELETE ONLY */}
                  <div className="mt-2">
                    <button
                      onClick={() => deleteSkill(skill._id)}
                      className="text-red-400"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* GOALS */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">
     <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg">Goals</h2>

  <button
    onClick={() => setShowGoalModal(true)}
    className="bg-purple-600 px-3 py-2 rounded"
  >
    + Add Goal
  </button>
</div>

{goals.length === 0 ? (
  <p className="text-gray-400">No goals yet</p>
) : (
  goals.map((goal) => {
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

    const isCompleted = progress >= 100;
    const isOverdue = new Date() > end && !isCompleted;

    return (
      <div key={goal._id} className="mb-4">

        {/* HEADER */}
        <div className="flex justify-between text-sm">
          <span>{goal.name}</span>
          <span>{safeCompleted} / {totalDays} days</span>
        </div>

        {/* DATES */}
        <p className="text-xs text-gray-400 mb-1">
          {start.toLocaleDateString()} → {end.toLocaleDateString()}
        </p>

        {/* PROGRESS */}
        <div className="w-full bg-gray-700 h-2 rounded">
          <div
            className={`h-2 rounded ${
              isCompleted
                ? "bg-green-500"
                : isOverdue
                ? "bg-red-500"
                : "bg-purple-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* STATUS */}
        <p className="text-xs mt-1">
          {isCompleted && "✅ Completed"}
          {isOverdue && "⚠️ Overdue"}
          {!isCompleted && !isOverdue && "🚀 In Progress"}
        </p>

        {/* DELETE */}
        <button
          onClick={() => deleteGoal(goal._id)}
          className="text-red-400 mt-2"
        >
          🗑️ Delete
        </button>

      </div>
    );
  })
)}
    </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-[#1f2937] p-6 rounded-xl w-96">

      <h2 className="text-lg mb-4">Add Task</h2>

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full mb-3 p-2 bg-gray-800 rounded"
      />

      {/* CATEGORY */}
      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
   className="`p-1 rounded text-sm">
  <option value="Career">Career</option>
  <option value="Learning">Learning</option>
  <option value="Interview">Interview</option>
  <option value="Job">Job</option> {/* optional */}
</select>

      {/* 🔥 SKILL DROPDOWN (MAIN FEATURE) */}
      <select
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="w-full mb-3 p-2 bg-gray-800 rounded"
      >
        <option value="">Select Skill</option>

        {skills.map((s: any) => (
          <option key={s._id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {/* DATES */}
      <div className="flex gap-2 mb-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2">

        <button
          onClick={() => setShowModal(false)}
          className="px-3 py-1 bg-gray-600 rounded"
        >
          Cancel
        </button>

        <button
          onClick={addTask}
          className="px-3 py-1 bg-purple-600 rounded"
        >
          Add Task
        </button>

      </div>

    </div>

  </div>
)}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-[#1f2937] p-6 rounded-xl w-96">

            <h2 className="text-lg mb-4">Add Skill</h2>

            <input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Skill name"
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
              />
            </div>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowSkillModal(false)}
                className="px-3 py-1 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addSkill}
                className="px-3 py-1 bg-purple-600 rounded"
              >
                Add
              </button>

            </div>

          </div>

        </div>
      )}
{showGoalModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-[#1f2937] p-6 rounded-xl w-96">

      <h2 className="text-lg mb-4">Add Goal</h2>

      <input
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        placeholder="Goal name"
        className="w-full mb-3 p-2 bg-gray-800 rounded"
      />

      <div className="flex gap-2 mb-3">
        <input
          type="date"
          value={goalStartDate}
          onChange={(e) => setGoalStartDate(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          type="date"
          value={goalEndDate}
          onChange={(e) => setGoalEndDate(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowGoalModal(false)}
          className="px-3 py-1 bg-gray-600 rounded"
        >
          Cancel
        </button>

        <button
          onClick={addGoal}
          className="px-3 py-1 bg-purple-600 rounded"
        >
          Add
        </button>
      </div>

    </div>

  </div>
)}
    </div>

  );
}