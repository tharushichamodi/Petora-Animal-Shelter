import { useState, useEffect } from "react";
import axios from "axios";
import "./css/VetReminders.css";
import { FaClock, FaList, FaBell } from "react-icons/fa";

function VetReminders() {
  const [reminders, setReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Upcoming");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleReminders, setVisibleReminders] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  //  Combined data fetcher
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [remRes, apptRes, schedRes] = await Promise.all([
        axios.get("http://localhost:3001/vetReminder/api/vetReminders"),
        axios.get("http://localhost:3001/vetAppointment/api/vetAppointments"),
        axios.get("http://localhost:3001/vetSheduler/api/vetShedulers"),
      ]);

      const remindersData = (remRes.data || []).map((r) => ({
        _id: r._id || r.id,
        petName: r.petName || r.animalName || "—",
        category: r.category || r.type || "Other",
        treatment: r.treatment || r.reason || r.details || "—",
        date: r.date || "",
        time: r.time || "",
        priority: r.priority || "Normal",
        vet: r.vet || r.assignedDoctor || "—",
        owner: r.owner || r.ownerName || "—",
        source: "Reminder",
        completed: !!r.completed,
      }));

      const appointmentsData = (apptRes.data || []).map((a) => ({
        _id: a._id || a.appointmentID,
        petName: a.petName || a.animalName || "—",
        category: a.reason || a.type || "Appointment",
        treatment: a.reason || "—",
        date: a.date || "",
        time: a.time || "",
        priority: a.priority || "Normal",
        vet: a.assignedDoctor || "—",
        owner: a.ownerName || "—",
        source: "Vet Appointment",
        completed: a.status === "Completed",
      }));

      const schedulerData = (schedRes.data || []).map((s) => ({
        _id: s._id,
        petName: s.animalName || "—",
        category: s.type || "Treatment",
        treatment: s.notes || "—",
        date: s.date || "",
        time: s.time || "",
        priority: s.priority || "Normal",
        vet: s.vet || "—",
        owner: s.owner || "—",
        source: "Vet Scheduler",
        completed: false,
      }));

      const combined = [...remindersData, ...appointmentsData, ...schedulerData];
      combined.sort((a, b) => new Date(a.date) - new Date(b.date));
      setReminders(combined);
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("⚠️ Failed to fetch reminders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  //  Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders();
    }, 60000);
    checkDueReminders();
    return () => clearInterval(interval);
  }, [reminders]);

  const checkDueReminders = () => {
    const now = new Date();
    const due = reminders.filter((r) => {
      if (!r.date || !r.time || r.completed) return false;
      const reminderTime = new Date(`${r.date}T${r.time}`);
      const diff = reminderTime - now;
      return diff <= 0 && diff > -60000;
    });
    if (due.length > 0) setVisibleReminders(due);
  };

  //  Color-coded countdown
  const calculateCountdown = (date, time) => {
    if (!date) return { label: "—", color: "" };
    const now = new Date();
    const target = new Date(`${date}T${time || "00:00"}`);
    const diff = target - now;
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) return { label: "🟢 Today", color: "today" };
    if (dayDiff < 0)
      return { label: `🔴 ${Math.abs(dayDiff)} day(s) ago`, color: "overdue" };
    return { label: `🔵 In ${dayDiff} day(s)`, color: "upcoming" };
  };

  //  Filters + Date sorting
  const filteredReminders = reminders
    .filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.petName.toLowerCase().includes(q) ||
        r.treatment.toLowerCase().includes(q);
      const matchesPriority =
        priorityFilter === "All" || r.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "All" || r.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && !r.completed) ||
        (statusFilter === "Completed" && r.completed);

      const now = new Date();
      const dateObj = new Date(r.date);
      const isToday =
        r.date === new Date().toISOString().split("T")[0];
      const isOverdue = dateObj < now && !isToday;
      const isUpcoming = dateObj >= now && !isToday;

      let matchesDateFilter = true;
      if (dateFilter === "Today") matchesDateFilter = isToday;
      else if (dateFilter === "Overdue") matchesDateFilter = isOverdue;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesCategory &&
        matchesStatus &&
        matchesDateFilter
      );
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`);

      if (dateFilter === "Upcoming") return dateA - dateB;
      if (dateFilter === "Oldest") return dateB - dateA;

      //  Always pin today’s reminders on top
      const isTodayA = a.date === new Date().toISOString().split("T")[0];
      const isTodayB = b.date === new Date().toISOString().split("T")[0];
      if (isTodayA && !isTodayB) return -1;
      if (isTodayB && !isTodayA) return 1;
      return dateA - dateB;
    });

  // Stats
  const total = reminders.length;
  const today = reminders.filter(
    (r) => r.date === new Date().toISOString().split("T")[0] && !r.completed
  ).length;
  const overdue = reminders.filter(
    (r) => r.date && new Date(r.date) < new Date() && !r.completed
  ).length;
  const completed = reminders.filter((r) => r.completed).length;

  return (
    <div className="vet_reminders_container">
      <h2 className="vet_reminders_title">🐾 Vet Reminder Dashboard</h2>

      <div className="vet_dashboard_stats">
        <div><strong>Total:</strong> {total}</div>
        <div><strong>Today:</strong> {today}</div>
        <div><strong>Overdue:</strong> {overdue}</div>
        <div><strong>Completed:</strong> {completed}</div>
      </div>

      {/* Filters */}
      <div className="vet_filters">
        <div className="left_filters">
          <input
            type="text"
            className="vet_reminders_search"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="vet_reminders_input"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="vet_reminders_input"
          >
            <option value="All">All Categories</option>
            <option value="Checkup">Checkup</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Treatment">Treatment</option>
            <option value="Surgery">Surgery</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="vet_reminders_input"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          {/*  Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="vet_reminders_input"
          >
            <option value="Upcoming">Upcoming (Near Dates)</option>
            <option value="Oldest">Oldest First</option>
            <option value="Today">Today Only</option>
            <option value="Overdue">Overdue Only</option>
          </select>
        </div>

        <div className="right_filters">
          <button className="refresh_btn" onClick={fetchAllData}>⟳</button>
        </div>
      </div>

      {/*  Cards */}
      <div className="vet_reminders_list">
        {loading ? (
          <p className="vet_loading">⏳ Loading...</p>
        ) : filteredReminders.length > 0 ? (
          filteredReminders.map((r) => {
            const countdown = calculateCountdown(r.date, r.time);
            return (
              <div
                key={r._id}
                className={`vet_reminders_card ${countdown.color} ${
                  r.completed ? "completed" : ""
                }`}
              >
                <div className="vet_reminders_info">
                  <p><strong>🐾 Pet:</strong> {r.petName}</p>
                  <p><strong>👩‍⚕️ Vet:</strong> {r.vet}</p>
                  <p><strong>👤 Owner:</strong> {r.owner}</p>
                  <p><strong>🩺 Type:</strong> {r.category}</p>
                  <p><strong>💬 Notes:</strong> {r.treatment}</p>
                  <p><strong>📅 Date:</strong> {r.date} — {r.time}</p>
                  <p className={`countdown ${countdown.color}`}>
                    <FaClock /> {countdown.label}
                  </p>
                  <p><strong>📂 Source:</strong> {r.source}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="vet_empty">No reminders yet</p>
        )}
      </div>

      {toast && <div className="vet_toast">{toast}</div>}
    </div>
  );
}

export default VetReminders;
