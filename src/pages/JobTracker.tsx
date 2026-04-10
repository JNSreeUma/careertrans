import { useEffect, useState } from "react";

type Job = {
  _id: string;
  company: string;
  role: string;
  status: "Saved" | "Applied" | "Interview" | "Offer";
  date: string;
  nextStep: string;
};

export default function JobTracker() {
  // ✅ SAFE STATE
 const [jobs, setJobs] = useState<Job[]>([]);

useEffect(() => {
  fetchJobs();
}, []);

const fetchJobs = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
  }
};

  // 🔥 FILTER
  const [filter, setFilter] = useState("All");

  const filteredJobs =
    filter === "All"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  // ➕ FORM STATE
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Job["status"]>("Saved");
  const [date, setDate] = useState("");
  const [nextStep, setNextStep] = useState("");

  const addJob = async () => {
  if (!company || !role) return;

  const token = localStorage.getItem("token");

  try {
    await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company,
        role,
        status,
      }),
    });

    fetchJobs(); // 🔥 refresh list

    setCompany("");
    setRole("");
    setNextStep("");
    setShowForm(false);
  } catch (err) {
    console.error(err);
  }
};
const deleteJob = async (_id: string) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/jobs/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchJobs(); // 🔥 THIS IS REQUIRED
};

  // 🎨 STATUS COLORS
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Saved":
        return "bg-gray-500/20 text-gray-300";
      case "Applied":
        return "bg-blue-500/20 text-blue-400";
      case "Interview":
        return "bg-yellow-500/20 text-yellow-400";
      case "Offer":
        return "bg-green-500/20 text-green-400";
      default:
        return "";
    }
  };

  // 📊 PROGRESS
  const getProgress = (status: string) => {
    switch (status) {
      case "Saved":
        return 10;
      case "Applied":
        return 30;
      case "Interview":
        return 60;
      case "Offer":
        return 90;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Job Tracker</h1>

      <div className="bg-[#111827] p-5 rounded-xl border border-gray-700">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Applications</h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 px-4 py-1 rounded"
          >
            + Add Job
          </button>
        </div>

        {/* 🔥 FILTERS */}
        <div className="flex gap-3 mb-4">
          {["All", "Saved", "Applied", "Interview", "Offer"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f
                  ? "bg-purple-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Job["status"])}
              className="p-2 bg-gray-800 rounded"
            >
              <option>Saved</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <input
              placeholder="Next Step"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="p-2 bg-gray-800 rounded col-span-2"
            />

            <button
              onClick={addJob}
              className="bg-purple-600 p-2 rounded col-span-2"
            >
              Add Job
            </button>
          </div>
        )}

        {/* TABLE HEADER */}
        <div className="grid grid-cols-7 text-sm text-gray-400 mb-2 px-2">
          <span>Company</span>
          <span>Role</span>
          <span>Status</span>
          <span>Date</span>
          <span>Next Step</span>
          <span>Progress</span>
          <span className="text-center">Action</span>
        </div>

        {/* JOB LIST */}
        <div className="space-y-2">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500 px-2">
              No {filter !== "All" ? filter : ""} jobs to show
            </p>
          ) : (
            filteredJobs.map((job) => {
              const progress = getProgress(job.status);

              return (
                <div
  key={job._id}
  className="grid grid-cols-7 items-center bg-gray-800 p-3 rounded gap-2"
>
  <span>{job.company}</span>

  <span>{job.role}</span>

  <span
    className={`text-xs px-2 py-1 rounded ${getStatusColor(job.status)}`}
  >
    {job.status}
  </span>

  <span className="text-sm text-gray-400">
    {job.date || "-"}
  </span>

  <span className="text-sm text-gray-300">
    {job.nextStep || "-"}
  </span>

  {/* PROGRESS */}
  <div className="w-full">
    <div className="h-2 bg-gray-700 rounded">
      <div
        className="h-2 bg-purple-500 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-xs text-gray-400">{progress}%</span>
  </div>

  {/* DELETE */}
  <button
    onClick={() => deleteJob(job._id)}
    className="text-red-400 hover:text-red-600 text-sm text-center"
  >
    🗑️
  </button>
</div>
              );
            })
          )}
        </div>

        {/* 🔥 VIEW SAVED JOBS */}
        <div className="mt-4">
          <button
            onClick={() => setFilter("Saved")}
            className="text-purple-400 text-sm hover:underline"
          >
            View Saved Jobs →
          </button>
        </div>

      </div>
    </div>
  );
}