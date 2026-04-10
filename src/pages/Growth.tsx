import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  category: string;
  status: string;
};

type Skill = {
  _id: string;
  name: string;
  current: number;
  target: number;
};

type Goal = {
  _id: string;
  title: string;
  current: number;
  target: number;
};

export default function Growth() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [interviewTitle, setInterviewTitle] = useState("");

  const [skillName, setSkillName] = useState("");
  const [skillTarget, setSkillTarget] = useState(30);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState(10);

  // 🔥 NEW: selected goal for chart
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const calc = (c: number, t: number) =>
    t === 0 ? 0 : Math.min(100, Math.round((c / t) * 100));

  // ================= FETCH =================
  useEffect(() => {
    async function fetchAll() {
      const [t, s, g] = await Promise.all([
        fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/skills", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const taskData = await t.json();
      const skillData = await s.json();
      const goalData = await g.json();

      setTasks(taskData);
      setSkills(skillData);
      setGoals(goalData);

      // 🔥 auto select first goal
      if (goalData.length > 0 && !selectedGoalId) {
        setSelectedGoalId(goalData[0]._id);
      }
    }

    fetchAll();
  }, [token]);

  // ================= TASKS =================
  const addTask = async (category: string, title: string) => {
    if (!title) return;

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        category,
        status: "Pending",
      }),
    });

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);

    if (category === "Learning") setTaskTitle("");
    else setInterviewTitle("");
  };

  const updateTask = async (task: Task, status: string) => {
    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status } : t))
    );
  };

  // ================= SKILLS =================
 const addSkill = async () => {
  if (!skillName.trim()) return;

  // 🔥 LIMIT TO 5
  if (skills.length >= 5) {
    alert("You can only add 5 skills max");
    return;
  }

  const res = await fetch("http://localhost:5000/api/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: skillName, target: skillTarget }),
  });

  const newSkill = await res.json();
  setSkills((prev) => [...prev, newSkill]);
  setSkillName("");
};

  const updateSkill = async (skill: Skill) => {
    await fetch(`http://localhost:5000/api/skills/${skill._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(skill),
    });
  };
  const deleteSkill = async (id: string) => {
  await fetch(`http://localhost:5000/api/skills/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setSkills((prev) => prev.filter((s) => s._id !== id));
};

  // ================= GOALS =================
  const addGoal = async () => {
    if (!goalTitle) return;

    const res = await fetch("http://localhost:5000/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: goalTitle, target: goalTarget }),
    });

    const newGoal = await res.json();
    setGoals((prev) => [...prev, newGoal]);
    setGoalTitle("");
  };

  const updateGoal = async (goal: Goal) => {
    await fetch(`http://localhost:5000/api/goals/${goal._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goal),
    });
  };

  // ================= DERIVED =================
  const selectedGoal = goals.find((g) => g._id === selectedGoalId);

  const interviewProgress = selectedGoal
    ? calc(selectedGoal.current, selectedGoal.target)
    : 0;

  const completedInterviews = tasks.filter(
    (t) => t.category === "Interview" && t.status === "Completed"
  ).length;

  const learningTasks = tasks.filter((t) => t.category === "Learning");
  const interviewTasks = tasks.filter((t) => t.category === "Interview");

  // ================= CIRCLE =================
  const CircularProgress = ({ value }: { value: number }) => {
    const radius = 40;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
      circumference - (value / 100) * circumference;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#1f2937"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#a855f7"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="14"
        >
          {value}%
        </text>
      </svg>
    );
  };

  // ================= UI =================
  return (
    <div className="p-6 bg-[#0b1120] min-h-screen text-white space-y-6">

      <h1 className="text-3xl font-bold">Growth 🚀</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* SKILLS */}
        <div className="bg-[#111827] p-5 rounded-xl space-y-4">
          <h2>Skills</h2>

         {skills.map((s) => (
  <div key={s._id}>
    
    <div className="flex justify-between text-sm">
      <span>{s.name}</span>
      <span>{calc(s.current, s.target)}%</span>
    </div>

    <div className="bg-gray-700 h-2 rounded">
      <div
        className="bg-purple-500 h-2 rounded"
        style={{ width: `${calc(s.current, s.target)}%` }}
      />
    </div>

    {/* ✅ THIS PART MUST BE INSIDE */}
    <div className="flex gap-2 mt-1">
      <input
        type="number"
        value={s.current}
        onChange={(e) =>
          setSkills((prev) =>
            prev.map((sk) =>
              sk._id === s._id
                ? { ...sk, current: Number(e.target.value) }
                : sk
            )
          )
        }
        className="w-16 bg-gray-800"
      />

      <button onClick={() => updateSkill(s)}>Save</button>

      <button onClick={() => deleteSkill(s._id)}>Delete</button>
    </div>

  </div>
))}
        </div>

        {/* LEARNING */}
        <div className="bg-[#111827] p-5 rounded-xl space-y-4">
          <h2>Learning Tasks</h2>

          <div className="flex gap-2">
            <input value={taskTitle} onChange={(e)=>setTaskTitle(e.target.value)} className="bg-gray-800 px-2"/>
            <button onClick={()=>addTask("Learning",taskTitle)}>+</button>
          </div>

          {learningTasks.map(task=>(
            <div key={task._id} className="flex justify-between">
              {task.title}
              <select value={task.status} onChange={(e)=>updateTask(task,e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          ))}
        </div>

        {/* GOALS */}
        <div className="bg-[#111827] p-5 rounded-xl space-y-4">
          <h2>Goals</h2>

          <div className="flex gap-2">
            <input value={goalTitle} onChange={(e)=>setGoalTitle(e.target.value)} className="bg-gray-800 px-2"/>
            <input type="number" value={goalTarget} onChange={(e)=>setGoalTarget(Number(e.target.value))} className="w-16 bg-gray-800"/>
            <button onClick={addGoal}>+</button>
          </div>

          {goals.map(g=>(
            <div key={g._id}>
              <div className="flex justify-between text-sm">
                <span>{g.title}</span>
                <span>{g.current}/{g.target}</span>
              </div>

              <div className="bg-gray-700 h-2 rounded">
                <div className="bg-yellow-400 h-2 rounded" style={{ width: `${calc(g.current,g.target)}%` }}/>
              </div>

              <button
                onClick={()=>setSelectedGoalId(g._id)}
                className={`text-xs px-2 py-1 mt-1 rounded ${
                  selectedGoalId===g._id ? "bg-purple-600":"bg-gray-700"
                }`}
              >
                {selectedGoalId===g._id ? "Tracking 🎯":"Track for Interview"}
              </button>
            </div>
          ))}
        </div>

        {/* INTERVIEW */}
        <div className="bg-[#111827] p-5 rounded-xl space-y-4">

          <h2>Interview Prep</h2>

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-4">
              <CircularProgress value={interviewProgress} />

              <div>
                <p className="text-sm text-gray-400">
                  {selectedGoal?.title || "Select a Goal"}
                </p>

                <p className="text-sm">
                  {selectedGoal?.current || 0} / {selectedGoal?.target || 0}
                </p>
              </div>
            </div>

            <div className="bg-[#0b1120] p-4 rounded-lg text-center">
              <p className="text-sm text-gray-400">Mock Interviews</p>
              <p className="text-2xl font-bold">{completedInterviews}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}