import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  FaPaw,
  FaSyringe,
  FaStethoscope,
  FaPills,
  FaClock,
  FaCalendarAlt,
  FaClipboardList,
  FaTimes,
  FaTrash,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import "./css/vet_treatment_scheduler.css";

/* Default Form */
const DEFAULT_FORM = {
  animalName: "",
  type: "Checkup",
  date: "",
  time: "",
  vet: "",
  priority: "Normal",
  notes: "",
  owner: "",
};

/* Helper: Convert to 12-hour time */
function formatTime12(time24) {
  if (!time24) return "—";
  const [hh, mm] = time24.split(":");
  let h = parseInt(hh, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mm} ${suffix}`;
}

export default function VetTreatmentScheduler() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [editingAppt, setEditingAppt] = useState(null);
  const [vets, setVets] = useState([]);

  /* Fetch appointments */
  useEffect(() => {
    fetchAppointments();
    fetchVets();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/vetSheduler/api/vetShedulers");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Failed to fetch appointments.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  /* Fetch vet staff availability */
  const fetchVets = async () => {
    try {
      const res = await axios.get("http://localhost:3001/vetStaff/api/vetStaffs");
      setVets(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.animalName || !formData.date || !formData.time || !formData.vet) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/vetSheduler/api/vetShedulers", formData);
      setAppointments((prev) => [...prev, res.data]);
      setFormData(DEFAULT_FORM);
      setMessage("✅ Appointment added successfully!");
    } catch {
      setMessage("❌ Failed to save appointment.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  /* Edit modal actions */
  const openEditModal = (appt) => {
    setEditingAppt({ ...appt });
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingAppt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editingAppt) return;
    try {
      const res = await axios.put(
        `http://localhost:3001/vetSheduler/api/vetShedulers/${editingAppt._id}`,
        editingAppt
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === editingAppt._id ? res.data : a))
      );
      setMessage("✅ Appointment updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Failed to update.");
    } finally {
      setModalOpen(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:3001/vetSheduler/api/vetShedulers/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setMessage("🗑️ Appointment deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Delete failed.");
    } finally {
      setModalOpen(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  /* Calendar helpers */
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstWeekday = (year, month) => new Date(year, month, 1).getDay();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const markedDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments]);
  const today = new Date().toISOString().split("T")[0];

  const goPrevMonth = () => {
    setCalendarMonth((p) =>
      p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 }
    );
  };
  const goNextMonth = () => {
    setCalendarMonth((p) =>
      p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 }
    );
  };

  return (
    <div className="vet_scheduler_container enhanced">
      <h2 className="vet_scheduler_title">
        <FaStethoscope className="vet_scheduler_icon" /> Vet Treatment Scheduler
      </h2>

      {message && (
        <div className="vet_scheduler_message">
          {message}
          <button className="msg_close" onClick={() => setMessage("")}>
            <FaTimes />
          </button>
        </div>
      )}
      {loading && <div className="vet_scheduler_loading">Loading…</div>}

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} className="vet_scheduler_form enhanced_form">
        <div className="form_row">
          <label className="input_group">
            <span className="label_small">Animal</span>
            <div className="input_with_icon">
              <FaPaw className="input_icon" />
              <input
                name="animalName"
                placeholder="Animal name"
                value={formData.animalName}
                onChange={handleChange}
              />
            </div>
          </label>
          <label className="input_group">
            <span className="label_small">Type</span>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>Checkup</option>
              <option>Vaccination</option>
              <option>Treatment</option>
              <option>Surgery</option>
            </select>
          </label>
        </div>

        <div className="form_row">
          <label className="input_group">
            <span className="label_small">Date</span>
            <div className="input_with_icon">
              <FaCalendarAlt className="input_icon" />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </label>
          <label className="input_group">
            <span className="label_small">Time</span>
            <div className="input_with_icon">
              <FaClock className="input_icon" />
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </label>
        </div>

        <div className="form_row">
          <label className="input_group">
            <span className="label_small">Vet</span>
            <div className="input_with_icon">
              <FaStethoscope className="input_icon" />
              <select name="vet" value={formData.vet} onChange={handleChange}>
                <option value="">Select vet</option>
                {vets.map((v) => (
                  <option
                    key={v._id}
                    value={v.name}
                    disabled={!v.available}
                    style={{
                      color: v.available ? "#3b2f2f" : "#aaa",
                      fontStyle: v.available ? "normal" : "italic",
                    }}
                  >
                    {v.name} — {v.specialization}
                    {!v.available ? " (Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="input_group">
            <span className="label_small">Owner</span>
            <input
              name="owner"
              placeholder="Owner name"
              value={formData.owner}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form_row">
          <label className="input_group full">
            <span className="label_small">Notes</span>
            <textarea
              name="notes"
              placeholder="Notes or instructions..."
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
          <label className="input_group small_right">
            <span className="label_small">Priority</span>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
            </select>
          </label>
        </div>

        <div className="form_actions">
          <button type="submit" className="vet_scheduler_btn primary">
            <FaClipboardList /> Add Appointment
          </button>
          <button
            type="button"
            className="vet_scheduler_btn neutral"
            onClick={() => setFormData(DEFAULT_FORM)}
          >
            <FaTimes /> Clear
          </button>
        </div>
      </form>

      {/* Calendar */}
      <div className="calendar_panel full_calendar">
        <div className="calendar_header">
          <button className="cal_nav" onClick={goPrevMonth}>◀</button>
          <div className="cal_title">
            {monthNames[calendarMonth.month]} {calendarMonth.year}
          </div>
          <button className="cal_nav" onClick={goNextMonth}>▶</button>
        </div>

        <div className="calendar_weekdays">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="calendar_grid">
          {(() => {
            const daysInMonth = getDaysInMonth(calendarMonth.year, calendarMonth.month);
            const firstWeekday = getFirstWeekday(calendarMonth.year, calendarMonth.month);
            const blanks = Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`b${i}`} className="calendar_cell empty" />
            ));
            const days = Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const y = calendarMonth.year;
              const m = String(calendarMonth.month + 1).padStart(2, "0");
              const d = String(day).padStart(2, "0");
              const dateStr = `${y}-${m}-${d}`;
              const dailyApps = appointments.filter((a) => a.date === dateStr);

              return (
                <div
                  key={dateStr}
                  className={`calendar_cell ${dateStr === today ? "today" : ""}`}
                  onClick={() => dailyApps.length && openEditModal(dailyApps[0])}
                >
                  <div className="cell_top">
                    <span className="cell_day">{day}</span>
                    {dailyApps.length > 0 && <span className="dot" />}
                  </div>
                  <div className="cell_apps">
                    {dailyApps.slice(0, 3).map((a, idx) => (
                      <div key={idx} className={`cell_app ${a.type.toLowerCase()}`}>
                        <strong>{a.animalName}</strong>
                        <span>{formatTime12(a.time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
            return [...blanks, ...days];
          })()}
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && editingAppt && (
        <div className="modal_overlay" onClick={() => setModalOpen(false)}>
          <div className="modal_card" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h3>Edit Appointment</h3>
              <button className="modal_close" onClick={() => setModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal_body">
              <label>Animal Name</label>
              <input name="animalName" value={editingAppt.animalName} onChange={handleModalChange} />

              <label>Type</label>
              <select name="type" value={editingAppt.type} onChange={handleModalChange}>
                <option>Checkup</option>
                <option>Vaccination</option>
                <option>Treatment</option>
                <option>Surgery</option>
              </select>

              <label>Date</label>
              <input type="date" name="date" value={editingAppt.date} onChange={handleModalChange} />

              <label>Time</label>
              <input type="time" name="time" value={editingAppt.time} onChange={handleModalChange} />

              <label>Vet</label>
              <input name="vet" value={editingAppt.vet} onChange={handleModalChange} />

              <label>Owner</label>
              <input name="owner" value={editingAppt.owner} onChange={handleModalChange} />

              <label>Notes</label>
              <textarea name="notes" value={editingAppt.notes} onChange={handleModalChange}></textarea>
            </div>

            <div className="modal_footer">
              <button className="vet_scheduler_btn primary" onClick={handleSaveChanges}>
                <FaSave /> Save
              </button>
              <button className="vet_scheduler_btn danger" onClick={() => handleDelete(editingAppt._id)}>
                <FaTrash /> Delete
              </button>
              <button className="vet_scheduler_btn neutral" onClick={() => setModalOpen(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
