import React, { useState, useEffect } from "react";
import { Profile, Header } from "./animal_manager_dashboard";

import "./css/daycare_manager_dashboard.css";
import "./css/add_shift_form.css";
import "./css/daycare_bookings.css";
import "./css/daycare_activity_logs.css";
import "./css/daycare_reports_finance.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


import pawIcon from "./images/dogpaws.png";
import girl from "./images/girlprofile1.jpg";
import boy from "./images/manprofile1.jpg";
import girl1 from "./images/girlprofile2.jpg";

// --- Report and Finance---
function ReportsFinance() {
    const [reports] = useState([
      { id: 1, month: "January", revenue: 12000, expenses: 3500, attendance: 92 },
      { id: 2, month: "February", revenue: 15000, expenses: 4200, attendance: 88 },
      { id: 3, month: "March", revenue: 13500, expenses: 3900, attendance: 95 },
      { id: 4, month: "April", revenue: 16500, expenses: 4400, attendance: 91 },
    ]);
    
    // Pull real shifts to compute staff performance & workload
    const SHIFTS_API_BASE = "http://localhost:3001/daycare_staff_scheduling/api/staff_shifts";
    const [shifts, setShifts] = useState([]);
    const [staffPerformance, setStaffPerformance] = useState([]);
    
    // Helper: parse time strings to approximate hours
    const parseTimeToHours = (timeStr) => {
      if (!timeStr) return 0;
      const t = String(timeStr).trim().toLowerCase();
      if (t === "full day") return 8;
      if (t === "half day") return 4;
      if (t === "morning" || t === "afternoon" || t === "evening") return 4;
      // explicit ranges like "9:00 AM - 1:00 PM"
      const match = /([0-9]{1,2}:[0-9]{2}\s*(am|pm))\s*-\s*([0-9]{1,2}:[0-9]{2}\s*(am|pm))/i.exec(timeStr);
      if (!match) return 0;
      const toMinutes = (s) => {
        const [time, ap] = s.trim().split(/\s+/);
        const [hStr, mStr] = time.split(":");
        let h = parseInt(hStr, 10) % 12;
        const m = parseInt(mStr, 10) || 0;
        if (ap.toLowerCase() === "pm") h += 12;
        return h * 60 + m;
      };
      try {
        const start = toMinutes(match[1]);
        const end = toMinutes(match[3]);
        let diff = end - start;
        if (diff < 0) diff += 24 * 60; // cross-midnight safeguard
        return Math.max(0, diff) / 60;
      } catch {
        return 0;
      }
    };
    
    // Compute metrics from shifts
    const computePerformance = (rows) => {
      const per = new Map(); // name -> aggregates
      for (const r of rows) {
        const name = r.name || "Unknown";
        if (!per.has(name)) {
          per.set(name, { name, shifts: 0, hours: 0, confirmed: 0, pending: 0, cancelled: 0 });
        }
        const agg = per.get(name);
        agg.shifts += 1;
        agg.hours += parseTimeToHours(r.time);
        const st = (r.status || "").toLowerCase();
        if (st === "confirmed") agg.confirmed += 1;
        else if (st === "pending") agg.pending += 1;
        else if (st === "cancelled" || st === "canceled") agg.cancelled += 1;
      }
      const TARGET_HOURS = 40; // weekly target for workload calculation
      const result = Array.from(per.values()).map((a) => {
        const confirmedPct = a.shifts ? Math.round((a.confirmed / a.shifts) * 100) : 0;
        const workload = Math.round(Math.min(150, (a.hours / TARGET_HOURS) * 100));
        let rating = "Fair";
        if (confirmedPct >= 85 && workload >= 70 && workload <= 110) rating = "Excellent";
        else if (confirmedPct >= 70) rating = "Good";
        return { name: a.name, shifts: a.shifts, hours: Math.round(a.hours * 10) / 10, confirmedPct, workload, rating };
      });
      // sort by hours desc for visibility
      result.sort((x, y) => y.hours - x.hours);
      return result;
    };
    
    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(SHIFTS_API_BASE);
          if (!res.ok) throw new Error(`Failed to fetch shifts (${res.status})`);
          const data = await res.json();
          if (!cancelled && Array.isArray(data)) {
            setShifts(data);
            setStaffPerformance(computePerformance(data));
          }
        } catch (e) {
          
        }
      })();
      return () => { cancelled = true; };
    }, []);
  
    // ----- SERVICE PRICING STATE -----
    const [services, setServices] = useState([
      { id: 1, type: "Hourly Care", duration: "1 Hour", price: 500 },
      { id: 2, type: "Daily Care", duration: "1 Day", price: 3500 },
      { id: 3, type: "Weekly Package", duration: "7 Days", price: 20000 },
      { id: 4, type: "Monthly Package", duration: "30 Days", price: 75000 },
    ]);
  
    const [editIndex, setEditIndex] = useState(null);
    const [newService, setNewService] = useState({
      type: "",
      duration: "",
      price: "",
    });
  
    const totalRevenue = reports.reduce((acc, r) => acc + r.revenue, 0);
    const totalExpenses = reports.reduce((acc, r) => acc + r.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
  
    // ----- HANDLERS -----
    const handleAddService = () => {
      if (!newService.type || !newService.duration || !newService.price) {
        alert("Please fill out all fields before adding.");
        return;
      }
  
      setServices([
        ...services,
        {
          id: services.length + 1,
          ...newService,
          price: parseFloat(newService.price),
        },
      ]);
      setNewService({ type: "", duration: "", price: "" });
    };
  
    const handleDelete = (id) => {
      setServices(services.filter((s) => s.id !== id));
    };
  
    const handleEdit = (index) => {
      setEditIndex(index);
      setNewService(services[index]);
    };
  
    const handleSaveEdit = () => {
      const updated = [...services];
      updated[editIndex] = newService;
      setServices(updated);
      setEditIndex(null);
      setNewService({ type: "", duration: "", price: "" });
    };
  
    return (
      <div className="DCM_reports_finance">
        <h2 className="section-title">📑 Reports & 💰 Finance</h2>
  
        {/* Summary Cards */}
        <div className="DCM_summary-cards">
          <div className="DCM_card">
            <h4>Total Revenue</h4>
            <p>${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="DCM_card">
            <h4>Total Expenses</h4>
            <p>${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="DCM_card">
            <h4>Net Profit</h4>
            <p>${totalProfit.toLocaleString()}</p>
          </div>
          <div className="DCM_card">
            <h4>Average Attendance</h4>
            <p>
              {(
                reports.reduce((acc, r) => acc + r.attendance, 0) / reports.length
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
  
        {/* Charts Section */}
        <div className="DCM_charts-grid">
          <div className="DCM_chart-card">
            <h3>📊 Monthly Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4CAF50" />
                <Bar dataKey="expenses" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          <div className="DCM_chart-card">
            <h3>🐾 Attendance Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#2196F3"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Staff Performance Table */}
        <div className="DCM_card DCM_table-card">
          <h3>👩‍💼 Staff Performance Summary</h3>
          <table className="DCM_table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shifts</th>
                <th>Hours</th>
                <th>Confirmed %</th>
                <th>Workload %</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.shifts}</td>
                  <td>{s.hours}</td>
                  <td>{s.confirmedPct}%</td>
                  <td>{s.workload}%</td>
                  <td>{s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Finance Table */}
        <div className="DCM_card DCM_table-card">
          <h3>💼 Monthly Finance Breakdown</h3>
          <table className="DCM_table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.month}</td>
                  <td>${r.revenue.toLocaleString()}</td>
                  <td>${r.expenses.toLocaleString()}</td>
                  <td>${(r.revenue - r.expenses).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Service Pricing Table */}
        <div className="DCM_card DCM_table-card">
          <h3>💲 Service Pricing Management</h3>
          <table className="DCM_table">
            <thead>
              <tr>
                <th>Service Type</th>
                <th>Duration</th>
                <th>Price (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service.id}>
                  <td>{service.type}</td>
                  <td>{service.duration}</td>
                  <td>{service.price.toLocaleString()}</td>
                  <td>
                    <button
                      className="DCM_btn-edit"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="DCM_btn-delete"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Input Fields for Add/Edit */}
          <div className="DCM_add-form">
            <input
              type="text"
              placeholder="Service Type"
              value={newService.type}
              onChange={(e) =>
                setNewService({ ...newService, type: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Duration"
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price (LKR)"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
            />
            {editIndex !== null ? (
              <button className="DCM_btn-edit" onClick={handleSaveEdit}>
                Save
              </button>
            ) : (
              <button className="DCM_btn-add" onClick={handleAddService}>
                + Add New Service
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

// --- Add Staff/Shift Form ---
function AddShiftForm({ onClose, onAdd, inline = false, initialData = null, onUpdate = null }) {
  const [formData, setFormData] = useState({
    photo: null,
    name: "",
    role: "",
    room: "",
    day: "Monday",
    time: "",
    status: "Confirmed",
    notes: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        photo: null, // keep file empty; we can't reconstruct from url
        name: initialData.name || "",
        role: initialData.role || "",
        room: initialData.room || "",
        day: initialData.day || "Monday",
        time: initialData.time || "",
        status: initialData.status || "Confirmed",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // When editing, preserve existing id and photoUrl if no new photo chosen
    if (initialData && onUpdate) {
      const updated = {
        ...initialData,
        ...formData,
        id: initialData.id,
        photoUrl: formData.photo
          ? URL.createObjectURL(formData.photo)
          : (initialData.photoUrl || null),
      };
      onUpdate(updated);
      onClose();
      return;
    }
    const staffData = {
      ...formData,
      id: Date.now(),
      photoUrl: formData.photo ? URL.createObjectURL(formData.photo) : null,
    };
    onAdd(staffData); // only updates table
    onClose();
  };

  return (
    inline ? (
      <div className="card inline-add-shift">
        <div className="add_shift_form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Add New Staff / Shift</h2>
            <button className="form_close_button" onClick={onClose}>×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label>Upload Photo</label>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </div>
            <div className="form_group">
              <label>Staff Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form_group">
              <label>Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} required />
            </div>
            <div className="form_group">
              <label>Assigned Room/Task</label>
              <input type="text" name="room" value={formData.room} onChange={handleChange} />
            </div>
            <div className="form_group">
              <label>Day</label>
              <select name="day" value={formData.day} onChange={handleChange}>
                <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
              </select>
            </div>
            <div className="form_group">
              <label>Time Slot</label>
              <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="e.g. 9:00 AM - 1:00 PM" />
            </div>
            <div className="form_group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
              </select>
            </div>
            <div className="form_group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="submit_btn">{initialData ? 'Update Staff' : 'Save Staff'}</button>
          </form>
        </div>
      </div>
    ) : (
      <div className="add_shift_form_cont visible">
        <div className="add_shift_form">
          <button className="form_close_button" onClick={onClose}>×</button>
          <h2>Add New Staff / Shift</h2>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label>Upload Photo</label>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </div>
            <div className="form_group">
              <label>Staff Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form_group">
              <label>Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} required />
            </div>
            <div className="form_group">
              <label>Assigned Room/Task</label>
              <input type="text" name="room" value={formData.room} onChange={handleChange} />
            </div>
            <div className="form_group">
              <label>Day</label>
              <select name="day" value={formData.day} onChange={handleChange}>
                <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
              </select>
            </div>
            <div className="form_group">
              <label>Time Slot</label>
              <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="e.g. 9:00 AM - 1:00 PM" />
            </div>
            <div className="form_group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
              </select>
            </div>
            <div className="form_group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="submit_btn">{initialData ? 'Update Staff' : 'Save Staff'}</button>
          </form>
        </div>
      </div>
    )
  );
}

// --- Staff Scheduling Component ---
function StaffScheduling() {
  // Profile staff (cards only)
  const [profileStaff, setProfileStaff] = useState([
    {
      id: 1,
      name: "Sarah J.",
      role: "Lead Teacher",
      room: "Infant Room",
      day: "Monday",
      time: "Full Day",
      status: "Confirmed",
      photoUrl: girl,
    },
    {
      id: 2,
      name: "Michael T.",
      role: "Assistant",
      room: "Toddler Room",
      day: "Tuesday",
      time: "Half Day",
      status: "Pending",
      photoUrl: boy,
    },
    {
      id: 3,
      name: "Alex K.",
      role: "Caretaker",
      room: "Play Area",
      day: "Wednesday",
      time: "Full Day",
      status: "Confirmed",
      photoUrl: girl1,
    },
    {
      id: 4,
      name: "Priya D.",
      role: "Veterinary Assistant",
      room: "Observation",
      day: "Thursday",
      time: "Half Day",
      status: "Confirmed",
      photoUrl: pawIcon,
    },
    {
      id: 5,
      name: "Naveen M.",
      role: "Trainer",
      room: "Training Area",
      day: "Friday",
      time: "Full Day",
      status: "Pending",
      photoUrl: pawIcon,
    },
    {
      id: 6,
      name: "Maya L.",
      role: "Receptionist",
      room: "Front Desk",
      day: "Monday",
      time: "Morning",
      status: "Confirmed",
      photoUrl: pawIcon,
    },
    {
      id: 7,
      name: "Ethan C.",
      role: "Nutrition Assistant",
      room: "Feeding Zone",
      day: "Tuesday",
      time: "Afternoon",
      status: "Confirmed",
      photoUrl: pawIcon,
    },
    {
      id: 8,
      name: "Zoe H.",
      role: "Play Supervisor",
      room: "Indoor Play",
      day: "Wednesday",
      time: "Evening",
      status: "Pending",
      photoUrl: pawIcon,
    },
  ]);

  // Table staff (dynamic, from form)
  const [tableStaff, setTableStaff] = useState([
    {
      id: 201,
      name: "Emma R.",
      role: "Senior Caretaker",
      room: "Play Area",
      day: "Monday",
      time: "9:00 AM - 5:00 PM",
      status: "Confirmed",
      notes: "Leads morning activities",
      photoUrl: null,
    },
    {
      id: 202,
      name: "Liam P.",
      role: "Assistant",
      room: "Infant Room",
      day: "Tuesday",
      time: "8:00 AM - 12:00 PM",
      status: "Pending",
      notes: "Training on feeding routines",
      photoUrl: null,
    },
    {
      id: 203,
      name: "Olivia S.",
      role: "Play Coordinator",
      room: "Outdoor Yard",
      day: "Wednesday",
      time: "12:00 PM - 6:00 PM",
      status: "Confirmed",
      notes: "Afternoon play sessions",
      photoUrl: null,
    },
    {
      id: 204,
      name: "Noah K.",
      role: "Groomer",
      room: "Grooming",
      day: "Thursday",
      time: "10:00 AM - 4:00 PM",
      status: "Confirmed",
      notes: "Specializes in nail trimming",
      photoUrl: null,
    },
  ]);
  const [viewMode, setViewMode] = useState('staff'); // 'staff' | 'shift'
  const [editingRow, setEditingRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Backend API (Staff Scheduling)
  const SHIFTS_API_BASE = "http://localhost:3001/daycare_staff_scheduling/api/staff_shifts";

  const isMongoId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);

  // replace by ID from server
  const mergeById = (prevRows, incomingRows) => {
    const map = new Map(prevRows.map((r) => [String(r.id), r]));
    for (const row of incomingRows) {
      map.set(String(row.id), row);
    }
    return Array.from(map.values());
  };

  // Map server shift to UI table shape
  const mapServerShift = (s) => ({
    id: s._id || s.id,
    name: s.name || "",
    role: s.role || "",
    room: s.room || "",
    day: s.day || "Monday",
    time: s.time || "",
    status: s.status || "Confirmed",
    notes: s.notes || "",
    photoUrl: s.photoUrl ?? null,
  });

  const defaultAvatar = pawIcon; // use local dogpaws.png as default avatar
  // Fetch shifts on mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch(SHIFTS_API_BASE);
        if (!res.ok) throw new Error(`Failed to fetch shifts (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map(mapServerShift);
      
          if (mapped.length > 0) {
            setTableStaff(mapped);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching shifts:", err);
        // Kdata if fetch fails
      }
    };
    fetchShifts();
  }, []);

  const handleAddStaff = async (newStaff) => {
    try {
      // Prepare payload (exclude id generated in UI; server should assign)
      const payload = {
        name: newStaff.name,
        role: newStaff.role,
        room: newStaff.room,
        day: newStaff.day,
        time: newStaff.time,
        status: newStaff.status,
        notes: newStaff.notes,
        // Keep null on create to avoid sending blob: preview URLs
        photoUrl: null,
      };
      const res = await fetch(SHIFTS_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let detail = '';
        try { detail = await res.text(); } catch (_) {}
        throw new Error(`Failed to create shift (${res.status}) ${detail}`.trim());
      }
      const created = await res.json();
      const row = mapServerShift(created);
      setTableStaff((prev) => [...prev, row]);
    } catch (err) {
      console.error("❌ Error adding shift:", err);
      alert(`Failed to add shift. ${err.message}`);
    }
  };

  const handleUpdateStaff = async (updated) => {
    try {
      const payload = {
        name: updated.name,
        role: updated.role,
        room: updated.room,
        day: updated.day,
        time: updated.time,
        status: updated.status,
        notes: updated.notes,
        photoUrl: updated.photoUrl || null,
      };
      if (!isMongoId(updated.id)) {
        // Temp/local row (e.g., demo or failed previous save). Create on server and replace locally.
        const createRes = await fetch(SHIFTS_API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!createRes.ok) throw new Error(`Failed to create shift from update (${createRes.status})`);
        const created = await createRes.json();
        const mappedCreated = mapServerShift(created);
        setTableStaff((prev) => prev.map((r) => (r.id === updated.id ? mappedCreated : r)));
      } else {
        const res = await fetch(`${SHIFTS_API_BASE}/${updated.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to update shift (${res.status})`);
        const serverUpdated = await res.json();
        const mapped = mapServerShift(serverUpdated);
        setTableStaff((prev) => prev.map((r) => (r.id === mapped.id ? mapped : r)));
      }
    } catch (err) {
      console.error("❌ Error updating shift:", err);
      alert("Failed to update shift. Please try again.");
      // local optimistic update already occurred via form close path
      setTableStaff((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } finally {
      setEditingRow(null);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Delete this staff row?')) return;
    try {
      if (!isMongoId(id)) {
        // Local-only row; remove without hitting server
        setTableStaff((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      const res = await fetch(`${SHIFTS_API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete shift (${res.status})`);
      setTableStaff((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("❌ Error deleting shift:", err);
      alert("Failed to delete shift. Please try again.");
    }
  };


  // Edit Profile modal state
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    role: "",
    room: "",
    day: "Monday",
    time: "",
    status: "Confirmed",
    photoFile: null,
    photoUrl: null,
  });

  const openEditProfileForm = (staff) => {
    setEditingProfile(staff);
    setProfileForm({
      name: staff.name || "",
      role: staff.role || "",
      room: staff.room || "",
      day: staff.day || "Monday",
      time: staff.time || "",
      status: staff.status || "Confirmed",
      photoFile: null,
      photoUrl: staff.photoUrl || null,
    });
    setShowProfileForm(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setProfileForm((prev) => ({ ...prev, photoFile: file, photoUrl: url }));
    } else {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editingProfile) return;
    setProfileStaff((prev) =>
      prev.map((p) =>
        p.id === editingProfile.id
          ? {
              ...p,
              name: profileForm.name,
              role: profileForm.role,
              room: profileForm.room,
              day: profileForm.day,
              time: profileForm.time,
              status: profileForm.status,
              photoUrl: profileForm.photoUrl !== null ? profileForm.photoUrl : p.photoUrl,
            }
          : p
      )
    );
    setShowProfileForm(false);
    setEditingProfile(null);
  };

  const handleCancelProfile = () => {
    setShowProfileForm(false);
    setEditingProfile(null);
  };

  // Remove a profile card
  const handleRemoveProfile = (id) => {
    if (!window.confirm("Remove this staff profile?")) return;
    setProfileStaff((prev) => prev.filter((p) => p.id !== id));
  };

  // removed per-card direct photo update; handled in edit form now

  return (
    <div className="staff-scheduling" style={{ marginTop: "100px" }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className={`add-shift-btn staff-toggle ${viewMode === 'staff' ? 'selected' : ''}`} onClick={() => setViewMode('staff')}>Staff Members</button>
          <button className={`add-shift-btn shift-toggle ${viewMode === 'shift' ? 'selected' : ''}`} onClick={() => setViewMode('shift')}>Shifts Details</button>
        </div>
      </div>

      {viewMode === 'staff' && (
        <>
          <h2>👥 Staff Profiles</h2>

      {/* Staff Profile Cards */}
      <div className="staff-cards-grid">
        {profileStaff.map((staff) => (
          <div key={staff.id} className="card">
            <img
              src={staff.photoUrl || defaultAvatar}
              alt={staff.name}
              className="staff-photo"
            />
            <h3><span className="detail-title">Name:</span> {staff.name}</h3>
            <p><span className="detail-title">Role:</span> {staff.role}</p>
            <p><span className="detail-title">Room/Task:</span> {staff.room}</p>
            <p><span className="detail-title">Schedule:</span> {staff.day} - {staff.time}</p>
            <p><span className="detail-title">Status:</span> {staff.status}</p>
            <div className="action-buttons" style={{ marginTop: "10px" }}>
              <button className="edit-btn" onClick={() => openEditProfileForm(staff)}>Edit</button>
              <button className="remove-btn" onClick={() => handleRemoveProfile(staff.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal Form */}
      {showProfileForm && (
        <div className="add_shift_form_cont visible">
          <div className="add_shift_form">
            <button className="form_close_button" onClick={handleCancelProfile}>×</button>
            <h2>Edit Staff Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="form_group">
                <label>Photo</label>
                {profileForm.photoUrl ? (
                  <img src={profileForm.photoUrl} alt="preview" className="staff-photo" />
                ) : (
                  <img src={defaultAvatar} alt="preview" className="staff-photo" />
                )}
                <input type="file" name="photo" accept="image/*" onChange={handleProfileInputChange} />
              </div>
              <div className="form_group">
                <label>Name</label>
                <input type="text" name="name" value={profileForm.name} onChange={handleProfileInputChange} required />
              </div>
              <div className="form_group">
                <label>Role</label>
                <input type="text" name="role" value={profileForm.role} onChange={handleProfileInputChange} required />
              </div>
              <div className="form_group">
                <label>Room/Task</label>
                <input type="text" name="room" value={profileForm.room} onChange={handleProfileInputChange} />
              </div>
              <div className="form_group">
                <label>Day</label>
                <select name="day" value={profileForm.day} onChange={handleProfileInputChange}>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div className="form_group">
                <label>Time</label>
                <input type="text" name="time" value={profileForm.time} onChange={handleProfileInputChange} />
              </div>
              <div className="form_group">
                <label>Status</label>
                <select name="status" value={profileForm.status} onChange={handleProfileInputChange}>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button type="submit" className="submit_btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}

        </>
      )}

      {viewMode === 'shift' && (
        <>
          <div className="toolbar" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="add-shift-btn" onClick={() => setShowAddForm(true)}>Add Shift</button>
          </div>

          {(showAddForm || editingRow) && (
            <AddShiftForm
              onClose={() => { setEditingRow(null); setShowAddForm(false); }}
              onAdd={handleAddStaff}
              initialData={editingRow}
              onUpdate={handleUpdateStaff}
            />
          )}

          <h2>📋 Staff Table</h2>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Photo</th><th>Staff Name</th><th>Role</th>
                <th>Assigned Room/Task</th><th>Day</th><th>Time Slot</th><th>Status</th><th>Notes</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableStaff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <img
                      src={staff.photoUrl || defaultAvatar}
                      width="40" height="40"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      alt={staff.name}
                    />
                  </td>
                  <td>{staff.name}</td>
                  <td>{staff.role}</td>
                  <td>{staff.room}</td>
                  <td>{staff.day}</td>
                  <td>{staff.time}</td>
                  <td>{staff.status}</td>
                  <td>{staff.notes}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="update-btn" onClick={() => { setEditingRow(staff); setShowAddForm(true); }}>Update</button>
                      <button className="delete-btn" onClick={() => handleDeleteStaff(staff.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}


// --- Activity Logs Component (Updated with Pet Name) ---
function ActivityLogs() {
  const API_BASE = "http://localhost:3001/daycare_activitylog/api/activity_logs";
  const INCIDENTS_API_BASE = "http://localhost:3001/daycare_incident/api/incidents";
  const [activities, setActivities] = React.useState([
    {
      id: 4,
      petName: "Buddy",
      activity: "Morning Walk",
      food: "Dry kibble 200g",
      notes: "Very energetic, no issues",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(), // 2h ago
      dateTs: Date.now() - 1000 * 60 * 60 * 2,
      files: [],
    },
    {
      id: 5,
      petName: "Whiskers",
      activity: "Nap",
      food: "Wet food 100g",
      notes: "Prefers quiet corner",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString(), // 5h ago
      dateTs: Date.now() - 1000 * 60 * 60 * 5,
      files: [],
    },
    {
      id: 6,
      petName: "Charlie",
      activity: "Playtime",
      food: "Chicken treats x3",
      notes: "Played fetch for 15 mins",
      date: new Date(Date.now() - 1000 * 60 * 30).toLocaleString(), // 30m ago
      dateTs: Date.now() - 1000 * 60 * 30,
      files: [],
    },
    {
      id: 7,
      petName: "Luna",
      activity: "Feeding",
      food: "Salmon wet 120g",
      notes: "Ate slowly but finished",
      date: new Date(Date.now() - 1000 * 60 * 90).toLocaleString(), // 1.5h ago
      dateTs: Date.now() - 1000 * 60 * 90,
      files: [],
    },
    {
      id: 8,
      petName: "Max",
      activity: "Grooming",
      food: "-",
      notes: "Brushed coat, trimmed nails",
      date: new Date(Date.now() - 1000 * 60 * 10).toLocaleString(), // 10m ago
      dateTs: Date.now() - 1000 * 60 * 10,
      files: [],
    },
  ]);
  const [incidents, setIncidents] = React.useState([]);
  const [editingActivity, setEditingActivity] = React.useState(null);
  const [editingIncident, setEditingIncident] = React.useState(null);
  const [filterText, setFilterText] = React.useState("");
  const [sortKey, setSortKey] = React.useState("dateDesc"); // dateDesc | dateAsc | nameAsc | nameDesc
  const [formData, setFormData] = React.useState({
    petName: "",
    activity: "",
    food: "",
    notes: "",
    files: [],
  });
  const [incidentData, setIncidentData] = React.useState({
    petName: "",
    title: "",
    severity: "Low",
    action: "",
  });
  const [formType, setFormType] = React.useState("activity"); // activity | incident
  const formTopRef = React.useRef(null);
  // removed incidents filter state/refs

  // Map server log to UI activity shape
  const mapServerLog = (log) => ({
    id: log._id || log.id,
    petName: log.petName,
    activity: log.activity,
    food: log.food ?? "",
    notes: log.notes ?? "",
    date: log.date ? new Date(log.date).toLocaleString() : new Date().toLocaleString(),
    dateTs: log.date ? new Date(log.date).getTime() : Date.now(),
    fileUrl: log.file ? `http://localhost:3001${log.file}` : null,
    filesUrls: Array.isArray(log.files) ? log.files.map((p) => `http://localhost:3001${p}`) : [],
    files: [],
  });

  // Map server incident to UI incident shape
  const mapServerIncident = (inc) => ({
    id: inc._id || inc.id,
    petName: inc.petName || "",
    title: inc.title || "",
    severity: inc.severity || "Low",
    action: inc.action || "",
    date: inc.date ? new Date(inc.date).toLocaleString() : new Date().toLocaleString(),
  });

  // Fetch activities from backend on mount
  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`Failed to fetch activity logs (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setActivities(
            data
              .map(mapServerLog)
              .sort((a, b) => (b.dateTs ?? 0) - (a.dateTs ?? 0))
          );
        }
      } catch (err) {
        console.error("❌ Error fetching activity logs:", err);
        // keep existing demo data if fetch fails
      }
    };
    const fetchIncidents = async () => {
      try {
        const res = await fetch(INCIDENTS_API_BASE);
        if (!res.ok) throw new Error(`Failed to fetch incidents (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setIncidents(data.map(mapServerIncident));
        }
      } catch (err) {
        console.error("❌ Error fetching incidents:", err);
        // keep empty incidents if fetch fails
      }
    };
    fetchActivities();
    fetchIncidents();
  }, []);

  // Handle change for activity form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData({ ...formData, files: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add or Update activity
  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!formData.activity || !formData.petName) {
      alert("Pet Name and Activity are required!");
      return;
    }
    try {
      if (editingActivity) {
        const fd = new FormData();
        fd.append('petName', formData.petName);
        fd.append('activity', formData.activity);
        fd.append('food', formData.food);
        fd.append('notes', formData.notes);
        if (Array.isArray(formData.files)) {
          formData.files.forEach((f) => fd.append('files', f));
        }
        const res = await fetch(`${API_BASE}/${editingActivity.id}` , {
          method: 'PUT',
          body: fd,
        });
        if (!res.ok) throw new Error(`Failed to update (${res.status})`);
        const updatedServer = await res.json();
        const updated = mapServerLog(updatedServer);
        setActivities(activities.map((a) => (a.id === editingActivity.id ? updated : a)));
        try {
          const refreshRes = await fetch(API_BASE);
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (Array.isArray(refreshData)) {
              setActivities(
                refreshData
                  .map(mapServerLog)
                  .sort((a, b) => (b.dateTs ?? 0) - (a.dateTs ?? 0))
              );
            }
          }
        } catch (_) {}
        setEditingActivity(null);
        alert("Activity updated successfully.");
      } else {
        const fd = new FormData();
        fd.append('petName', formData.petName);
        fd.append('activity', formData.activity);
        fd.append('food', formData.food);
        fd.append('notes', formData.notes);
        if (Array.isArray(formData.files)) {
          formData.files.forEach((f) => fd.append('files', f));
        }
        const res = await fetch(API_BASE, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error(`Failed to create (${res.status})`);
        const created = await res.json();
        const newActivity = mapServerLog(created);
        setActivities([newActivity, ...activities]);
        try {
          const refreshRes = await fetch(API_BASE);
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (Array.isArray(refreshData)) {
              setActivities(
                refreshData
                  .map(mapServerLog)
                  .sort((a, b) => (b.dateTs ?? 0) - (a.dateTs ?? 0))
              );
            }
          }
        } catch (_) {}
        alert("Activity added successfully.");
      }
      setFormData({ petName: "", activity: "", food: "", notes: "", files: [] });
    } catch (err) {
      console.error("❌ Error saving activity:", err);
      alert("Failed to save activity. Please try again.");
    }
  };

  // Edit existing activity (load into form)
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setFormData({
      petName: activity.petName || "",
      activity: activity.activity || "",
      food: activity.food || "",
      notes: activity.notes || "",
      files: [], // can't reconstruct File objects; let user reattach if needed
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingActivity(null);
    setFormData({ petName: "", activity: "", food: "", notes: "", files: [] });
  };

  // Delete activity
  const handleDeleteActivity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      setActivities(activities.filter((a) => a.id !== id));
      if (editingActivity && editingActivity.id === id) {
        handleCancelEdit();
      }
    } catch (err) {
      console.error("❌ Error deleting activity:", err);
      alert("Failed to delete activity. Please try again.");
    }
  };

  // Handle incident form change
  const handleIncidentChange = (e) => {
    const { name, value } = e.target;
    setIncidentData({ ...incidentData, [name]: value });
  };

  // Add incident
  const handleAddIncident = async (e) => {
    e.preventDefault();
    if (!incidentData.title || !incidentData.petName) {
      alert("Pet Name and Incident Title are required!");
      return;
    }
    try {
      if (editingIncident) {
        // Update on server
        const payload = {
          petName: incidentData.petName,
          title: incidentData.title,
          severity: incidentData.severity,
          action: incidentData.action,
        };
        const res = await fetch(`${INCIDENTS_API_BASE}/${editingIncident.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to update incident (${res.status})`);
        const updatedServer = await res.json();
        const updated = mapServerIncident(updatedServer);
        setIncidents(incidents.map((i) => (i.id === editingIncident.id ? updated : i)));
        setEditingIncident(null);
      } else {
        // Create on server
        const payload = {
          petName: incidentData.petName,
          title: incidentData.title,
          severity: incidentData.severity,
          action: incidentData.action,
        };
        const res = await fetch(INCIDENTS_API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to create incident (${res.status})`);
        const created = await res.json();
        const newIncident = mapServerIncident(created);
        setIncidents([newIncident, ...incidents]);
      }
      setIncidentData({ petName: "", title: "", severity: "Low", action: "" });
    } catch (err) {
      console.error("❌ Error saving incident:", err);
      alert("Failed to save incident. Please try again.");
    }
  };

  // Edit existing incident (load into form)
  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setIncidentData({
      petName: incident.petName || "",
      title: incident.title || "",
      severity: incident.severity || "Low",
      action: incident.action || "",
    });
  };

  // Cancel incident edit
  const handleCancelIncidentEdit = () => {
    setEditingIncident(null);
    setIncidentData({ petName: "", title: "", severity: "Low", action: "" });
  };

  // Delete incident
  const handleDeleteIncident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident?")) return;
    try {
      const res = await fetch(`${INCIDENTS_API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete incident (${res.status})`);
      setIncidents(incidents.filter((i) => i.id !== id));
      if (editingIncident && editingIncident.id === id) {
        handleCancelIncidentEdit();
      }
    } catch (err) {
      console.error("❌ Error deleting incident:", err);
      alert("Failed to delete incident. Please try again.");
    }
  };

  // Download PDF report
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Daycare Report", 14, 20);

  if (activities.length > 0) {
    autoTable(doc, {
      startY: 30,
      head: [["Pet Name", "Activity", "Food", "Notes", "Date"]],
      body: activities.map((a) => [
        a.petName,
        a.activity,
        a.food || "-",
        a.notes || "-",
        a.date,
      ]),
    });
  }

  if (incidents.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Pet Name", "Incident", "Severity", "Action", "Date"]],
      body: incidents.map((i) => [
        i.petName || "-",
        i.title,
        i.severity,
        i.action || "-",
        i.date,
      ]),
    });
  }

  doc.save("daycare_report.pdf");
};

  // Combined form submit decides which handler to use
  const handleCombinedSubmit = (e) => {
    e.preventDefault();
    if (formType === "activity") {
      return handleAddActivity(e);
    }
    return handleAddIncident(e);
  };

  // Helpers for incidents from activities
  const getIncidentsForPet = (name) =>
    incidents.filter(
      (i) => (i.petName || '').toLowerCase() === (name || '').toLowerCase()
    );

  const quickAddIncidentForPet = (name) => {
    setFormType('incident');
    setEditingIncident(null);
    setIncidentData((prev) => ({ ...prev, petName: name }));
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <div className="activity-logs" style={{ marginTop: "200px" }}>
      <h2>📝 Pet Activity & Incidents</h2>

      {/* Combined Activity / Incident Form */}
      <div className="card" ref={formTopRef}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="radio"
              name="formType"
              value="activity"
              checked={formType === 'activity'}
              onChange={() => setFormType('activity')}
            />
            Activity
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="radio"
              name="formType"
              value="incident"
              checked={formType === 'incident'}
              onChange={() => setFormType('incident')}
            />
            Incident
          </label>
        </div>

        <form
          className={`log-form ${formType === 'activity' ? 'activity-mode' : 'incident-mode'}`}
          onSubmit={handleCombinedSubmit}
        >
          {formType === 'activity' ? (
            <>
              <input
                type="text"
                name="petName"
                placeholder="Pet Name"
                value={formData.petName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="activity"
                placeholder="Activity (Walk, Play, Nap)"
                value={formData.activity}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="food"
                placeholder="Food/Amount"
                value={formData.food}
                onChange={handleChange}
              />
              <textarea
                name="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={handleChange}
              />
              <input
                type="file"
                name="files"
                accept="image/*,video/*"
                multiple
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="petName"
                placeholder="Pet Name"
                value={incidentData.petName}
                onChange={handleIncidentChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Incident Title"
                value={incidentData.title}
                onChange={handleIncidentChange}
                required
              />
              <select
                name="severity"
                value={incidentData.severity}
                onChange={handleIncidentChange}
                className={`severity-select severity-${(incidentData.severity || '').toLowerCase()}`}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <div style={{ flex: '1 1 100%' }}>
                <textarea
                  id="incident-action"
                  name="action"
                  placeholder="Describe the action taken"
                  value={incidentData.action}
                  onChange={handleIncidentChange}
                />
              </div>
            </>
          )}

          <div className="action-buttons">
            <button type="submit">
              {formType === 'activity'
                ? (editingActivity ? 'Update Activity' : 'Add Activity')
                : (editingIncident ? 'Update Incident' : 'Add Incident')}
            </button>
            {formType === 'activity' && editingActivity && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
            )}
            {formType === 'incident' && editingIncident && (
              <button type="button" className="cancel-btn" onClick={handleCancelIncidentEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Logged Activities */}
      <div className="card">
        <h3>📋 Logged Activities</h3>
        {/* Filters & Sorting */}
        <div className="filters" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Filter by pet name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="sort-select">
            <option value="dateDesc">Date: Newest first</option>
            <option value="dateAsc">Date: Oldest first</option>
            <option value="nameAsc">Name: A → Z</option>
            <option value="nameDesc">Name: Z → A</option>
          </select>
        </div>
        {activities.length === 0 ? (
          <p>No activities logged yet.</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Activity</th>
                <th>Food</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Media</th>
                <th>Incident Count</th>
                <th>Incidents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities
                .filter((a) => a.petName.toLowerCase().includes(filterText.toLowerCase()))
                .sort((a, b) => {
                  switch (sortKey) {
                    case 'nameAsc':
                      return (a.petName || '').localeCompare(b.petName || '');
                    case 'nameDesc':
                      return (b.petName || '').localeCompare(a.petName || '');
                    case 'dateAsc': {
                      const ta = a.dateTs ?? new Date(a.date).getTime();
                      const tb = b.dateTs ?? new Date(b.date).getTime();
                      return ta - tb;
                    }
                    case 'dateDesc':
                    default: {
                      const ta = a.dateTs ?? new Date(a.date).getTime();
                      const tb = b.dateTs ?? new Date(b.date).getTime();
                      return tb - ta;
                    }
                  }
                })
                .map((a) => (
                <tr key={a.id}>
                  <td>{a.petName}</td>
                  <td>{a.activity}</td>
                  <td>{a.food || "-"}</td>
                  <td>{a.notes || "-"}</td>
                  <td>{a.date}</td>
                  <td>
                    {Array.isArray(a.filesUrls) && a.filesUrls.length > 0 ? (
                      <div className="media-gallery" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {a.filesUrls.map((url, index) => (
                          /\.(mp4|webm|ogg)$/i.test(url) ? (
                            <video key={index} src={url} controls style={{ width: '100px', height: '60px', borderRadius: '6px' }} />
                          ) : (
                            <img key={index} src={url} alt={`media-${index}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                          )
                        ))}
                      </div>
                    ) : a.fileUrl ? (
                      (/\.(mp4|webm|ogg)$/i.test(a.fileUrl) ? (
                        <video src={a.fileUrl} controls style={{ width: '100px', height: '60px', borderRadius: '6px' }} />
                      ) : (
                        <img src={a.fileUrl} alt="media" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      ))
                    ) : (
                      a.files && a.files.length > 0 ? (
                        <div className="media-gallery" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {a.files.map((file, index) =>
                            file.type.startsWith('image/') ? (
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`media-${index}`}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                            ) : (
                              <video
                                key={index}
                                src={URL.createObjectURL(file)}
                                controls
                                style={{ width: '100px', height: '60px', borderRadius: '6px' }}
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <span>-</span>
                      )
                    )}
                  </td>
                  <td>
                    {(() => {
                      const count = getIncidentsForPet(a.petName).length;
                      return (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {count > 0 ? (
                            <span className={`severity-badge`} title={`Total incidents for ${a.petName}`}>{count}</span>
                          ) : (
                            <span>0</span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={() => quickAddIncidentForPet(a.petName)}
                    >
                      Add Incident
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEditActivity(a)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteActivity(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Logged Incidents */}
      <div className="card mt-4">
        <h3>🚨 Logged Incidents</h3>
        {incidents.length === 0 ? (
          <p>No incidents recorded yet.</p>
        ) : (
          <ul className="incident-list">
            {incidents.map((i) => (
              <li key={i.id} className="p-4 border-b">
                <p>
                  <strong>{i.title}</strong> ({i.date})
                </p>
                {i.petName && (
                  <p>
                    Pet: <strong>{i.petName}</strong>
                  </p>
                )}
                <p>
                  Severity: {" "}
                  <span className={`severity-badge severity-${(i.severity || '').toLowerCase()}`}>
                    {i.severity}
                  </span>
                </p>
                {i.action && <p>🛠️ Action: {i.action}</p>}
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEditIncident(i)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteIncident(i.id)}>Delete</button>
              </div>
            </li>
          ))}
          </ul>
        )}
      </div>

      {/* Report Section */}
      <div className="card mt-4">
        <h3>📊 Reports</h3>
        <button onClick={downloadPDF}>⬇️ Download PDF</button>
      </div>
    </div>
  );
}


/* ---------------- Bookings & Attendance ---------------- */
function BookingsAttendance() {
  const [bookings, setBookings] = useState([]);
  const API_BASE = "http://localhost:3001/daycare_booking/api/daycare_bookings";
  const displayStatus = (s) => (s === 'Discharged' ? 'Check-Out' : s);

  // Static fallback data
  const staticBookings = [
    {
      id: 101,
      animalName: "Buddy",
      species: "Dog",
      admissionDate: "2025-09-20",
      package: "Daycare",
      vaccination: "Completed",
      medicalNotes: "N/A",
      assignedStaff: "Sarah J.",
      status: "Checked-In",
    },
    {
      id: 102,
      animalName: "Whiskers",
      species: "Cat",
      admissionDate: "2025-09-22",
      package: "Observation",
      vaccination: "Pending",
      medicalNotes: "Allergic to chicken",
      assignedStaff: "Michael T.",
      status: "Pending Intake",
    },
    {
      id: 103,
      animalName: "Max",
      species: "Dog",
      admissionDate: "2025-09-23",
      package: "Grooming",
      vaccination: "Completed",
      medicalNotes: "Recent ear infection",
      assignedStaff: "Alex K.",
      status: "Discharged",
    },
  ];

  // Package options (customer view)
  const managerPackages = [
    { id: 1, name: "Hourly Care", duration: "5 Hour" },
    { id: 2, name: "Daily Care", duration: "1 Day" },
    { id: 3, name: "Weekly Bundle", duration: "7 Days" },
    { id: 4, name: "Monthly Pass", duration: "30 Days" },
  ];

  // Fetch bookings from backend 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) {
          if (res.status === 404) {
            setBookings(staticBookings);
            return;
          }
          throw new Error(`Failed to fetch bookings (${res.status})`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        } else {
          setBookings(staticBookings);
        }
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setBookings(staticBookings);
      }
    };
    fetchBookings();
  }, []);

  const handleRefreshBookings = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBookings(data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        }
      } catch (_) {}
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const updateBookingPartial = async (row, partial) => {
    const id = row._id || row.id;
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalName: row.animalName,
          species: row.species,
          admissionDate: row.admissionDate,
          package: row.package || row.reason || "",
          vaccination: row.vaccination,
          medicalNotes: row.medicalNotes,
          assignedStaff: row.assignedStaff,
          status: row.status,
          ...partial,
        }),
      });
      if (!res.ok) throw new Error(`Failed to update booking (${res.status})`);
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => ((b._id || b.id) === (updated._id || updated.id) ? updated : b)));
    } catch (err) {
      alert(err?.message || 'Failed to update booking');
    }
  };

  const handleCheckIn = (row) => updateBookingPartial(row, { status: 'Checked-In' });
  const handleCheckOut = (row) => updateBookingPartial(row, { status: 'Discharged' });
  const handleToggleMedical = (row) => {
    const nextNotes = row.medicalNotes ? '' : 'Requires attention';
    updateBookingPartial(row, { medicalNotes: nextNotes });
  };
  const handleQuickEdit = (row) => {
    const newPackage = window.prompt('Package', row.package || row.reason || '');
    if (newPackage === null) return;
    const newVacc = window.prompt('Vaccination (Completed/Pending)', row.vaccination || 'Pending');
    if (newVacc === null) return;
    const newNotes = window.prompt('Medical Notes', row.medicalNotes || '');
    if (newNotes === null) return;
    updateBookingPartial(row, { package: newPackage, vaccination: newVacc, medicalNotes: newNotes });
  };

  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    animalName: "",
    species: "",
    admissionDate: "",
    package: "",
    vaccination: "Pending",
    medicalNotes: "",
    assignedStaff: "",
    status: "Pending Intake",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddBooking = () => {
    setEditingBooking(null);
    setFormData({
      animalName: "",
      species: "",
      admissionDate: "",
      package: "",
      vaccination: "Pending",
      medicalNotes: "",
      assignedStaff: "",
      status: "Pending Intake",
    });
    setShowForm(true);
  };

  const validateBooking = (fd) => {
    const errs = {};
    if (!fd.animalName || fd.animalName.trim().length < 2) {
      errs.animalName = "Animal name is required (min 2 characters).";
    }
    if (!fd.species || fd.species.trim().length < 2) {
      errs.species = "Species is required.";
    }
    if (!fd.admissionDate) {
      errs.admissionDate = "Admission date is required.";
    } else {
      try {
        const today = new Date();
        today.setHours(0,0,0,0);
        const chosen = new Date(fd.admissionDate);
        if (isNaN(chosen.getTime())) {
          errs.admissionDate = "Invalid date.";
        } else if (chosen < today) {
          errs.admissionDate = "Admission date cannot be in the past.";
        }
      } catch {
        errs.admissionDate = "Invalid date.";
      }
    }
    if (fd.vaccination !== "Completed" && fd.vaccination !== "Pending") {
      errs.vaccination = "Vaccination must be Completed or Pending.";
    }
    if (fd.package && fd.package.length > 200) {
      errs.package = "Package must be 200 characters or less.";
    }
    return errs;
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setFormData({
      animalName: booking.animalName || "",
      species: booking.species || "",
      admissionDate: booking.admissionDate
        ? new Date(booking.admissionDate).toISOString().slice(0, 10)
        : "",
      package: booking.package || booking.reason || "",
      vaccination: booking.vaccination || "Pending",
      medicalNotes: booking.medicalNotes || "",
      assignedStaff: booking.assignedStaff || "",
      status: booking.status || "Pending Intake",
    });
    setShowForm(true);
  };

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    const errs = validateBooking(formData);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`.form_group input[name="${firstKey}"]`) || document.querySelector(`.form_group select[name="${firstKey}"]`) || document.querySelector(`.form_group textarea[name="${firstKey}"]`);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    try {
      const payload = { ...formData };
      if (editingBooking && editingBooking._id) {
        const res = await fetch(`${API_BASE}/${editingBooking._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to update booking (${res.status})`);
        const updated = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
      } else {
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to create booking (${res.status})`);
        const created = await res.json();
        setBookings((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error saving booking:", err);
      alert(err?.message || "Could not save booking. Please try again.");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings(bookings.filter((b) => (b._id || b.id) !== id));
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
      alert("Could not delete booking. Please try again.");
    }
  };

  const totalAnimals = bookings.length;
  const checkedIn = bookings.filter((b) => b.status === "Checked-In").length;
  const pending = bookings.filter((b) => b.status === "Pending Intake").length;
  const medicalCare = bookings.filter((b) => b.medicalNotes).length;

  // ====== Daily Capacity State (NEW) ======
  const [dailyCapacity, setDailyCapacity] = useState(20);
  const [published, setPublished] = useState(false);
  const bookedCount = bookings.length;
  const CAPACITY_API = "http://localhost:3001/daycare_capacity/api/capacity";

  const capacityUsed = Math.min((bookedCount / dailyCapacity) * 100, 100);
  const capacityStatus =
    bookedCount > dailyCapacity
      ? "Over Capacity ❌"
      : bookedCount === dailyCapacity
      ? "Full ⚠️"
      : `${dailyCapacity - bookedCount} Slots Left ✅`;

  const handleCapacityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setDailyCapacity(value);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('daycare_daily_capacity');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          setDailyCapacity(parsed);
        }
      }
      const pub = localStorage.getItem('daycare_capacity_published');
      setPublished(pub === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(CAPACITY_API);
        if (!res.ok) return;
        const data = await res.json();
        const v = parseInt(data?.dailyCapacity, 10);
        if (!cancelled && !isNaN(v) && v >= 1) setDailyCapacity(v);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('daycare_daily_capacity', String(dailyCapacity));
    } catch {}
  }, [dailyCapacity]);

  const togglePublish = () => {
    const next = !published;
    setPublished(next);
    try {
      localStorage.setItem('daycare_capacity_published', String(next));
    } catch {}
  };

  const handleUpdateCapacity = async () => {
    const value = Number(dailyCapacity);
    if (!Number.isFinite(value) || value < 1) {
      alert('Enter a valid capacity (>= 1).');
      return;
    }
    try {
      const res = await fetch(CAPACITY_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyCapacity: value }),
      });
      if (!res.ok) throw new Error(`Failed to update capacity (${res.status})`);
      const updated = await res.json();
      const v = parseInt(updated?.dailyCapacity, 10);
      if (!isNaN(v) && v >= 1) setDailyCapacity(v);
      alert(`Daily capacity updated to ${!isNaN(v) && v >= 1 ? v : value}`);
    } catch (e) {
      alert(e?.message || 'Could not update capacity.');
    }
  };

  return (
    <div className="DCB_bookings_section" style={{ marginTop: "200px" }}>
      <h2>📋 Booking & Attendance</h2>

      {/* ===== Daily Capacity Section ===== */}
      <div className="DCB_daily_capacity_card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>🐾 Daily Daycare Capacity</h3>
          <span className={`DCB_publish_badge ${published ? 'on' : 'off'}`}>
            {published ? 'Published to Customers' : 'Hidden from Customers'}
          </span>
          <button
            type="button"
            className="DCB_update_btn"
            onClick={togglePublish}
          >
            {published ? 'Hide from Customers' : 'Publish to Customers'}
          </button>
        </div>
        <div className="DCB_capacity_input">
          <label>Set Daily Capacity:</label>
          <input
            type="number"
            min="1"
            value={dailyCapacity}
            onChange={handleCapacityChange}
          />
          <button
              type="button"
              className="DCB_update_btn"
              onClick={handleUpdateCapacity}
              >
                 Update
          </button>

        </div>

        <div className="DCB_capacity_bar">
          <div
            className="DCB_capacity_progress"
            style={{
              width: `${capacityUsed}%`,
              background:
                bookedCount > dailyCapacity
                  ? "#e74c3c"
                  : bookedCount === dailyCapacity
                  ? "#f1c40f"
                  : "#27ae60",
            }}
          ></div>
        </div>

        <p className="DCB_capacity_status">
          {bookedCount} / {dailyCapacity} Booked — {capacityStatus}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="DCB_summary_cards">
        <div className="DCB_summary_card"><h4>Total Animals</h4><p>{totalAnimals}</p></div>
        <div className="DCB_summary_card green"><h4>Checked-In</h4><p>{checkedIn}</p></div>
        <div className="DCB_summary_card yellow"><h4>Pending Intake</h4><p>{pending}</p></div>
        <div className="DCB_summary_card red"><h4>Needing Medical Care</h4><p>{medicalCare}</p></div>
      </div>

      <div style={{ marginBottom: "15px", display: 'flex', gap: 8 }}>
        <button className="add-shift-btn" onClick={handleRefreshBookings}>Refresh</button>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <table className="DCB_bookings_table">
          <thead>
            <tr>
              <th>Animal</th><th>Species</th><th>Admission Date</th>
              <th>Package</th><th>Vaccination</th><th>Medical Notes</th>
              <th>Staff</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id || b.id}>
                <td>{b.animalName}</td>
                <td>{b.species}</td>
                <td>{b.admissionDate ? new Date(b.admissionDate).toISOString().slice(0,10) : ""}</td>
                <td>{b.package || b.reason}</td>
                <td>{b.vaccination}</td>
                <td>{b.medicalNotes}</td>
                <td>{b.assignedStaff}</td>
                <td>
                  <span className={`DCB_status_badge ${b.status.toLowerCase().replace(" ", "-")}`}>
                    {displayStatus(b.status)}
                  </span>
                </td>
                <td>
                  <div className="DCB_action_buttons">
                    <button className="edit-btn" onClick={() => handleEditBooking(b)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteBooking(b._id || b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="DCB_add_shift_form_cont visible">
          <div className="add_shift_form">
            <button className="form_close_button" onClick={() => setShowForm(false)}>×</button>
            <h2>{editingBooking ? "Edit Booking" : "Add Booking"}</h2>
            <form onSubmit={handleSaveBooking}>
              <div className="form_group">
                <label>Animal Name</label>
                <input type="text" name="animalName" value={formData.animalName} onChange={handleChange} required />
                {formErrors.animalName && <small className="error-text">{formErrors.animalName}</small>}
              </div>
              <div className="form_group">
                <label>Species</label>
                <input type="text" name="species" value={formData.species} onChange={handleChange} required />
                {formErrors.species && <small className="error-text">{formErrors.species}</small>}
              </div>
              <div className="form_group">
                <label>Admission Date</label>
                <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required />
                {formErrors.admissionDate && <small className="error-text">{formErrors.admissionDate}</small>}
              </div>
              <div className="form_group">
                <label>Package</label>
                <select name="package" value={formData.package} onChange={handleChange}>
                  <option value="" disabled>Select package</option>
                  {managerPackages.map((p) => (
                    <option key={p.id} value={`${p.name} — ${p.duration}`}>
                      {p.name} — {p.duration}
                    </option>
                  ))}
                </select>
                {formErrors.package && <small className="error-text">{formErrors.package}</small>}
              </div>
              <div className="form_group">
                <label>Vaccination</label>
                <select name="vaccination" value={formData.vaccination} onChange={handleChange}>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
                {formErrors.vaccination && <small className="error-text">{formErrors.vaccination}</small>}
              </div>
              <div className="form_group">
                <label>Medical Notes</label>
                <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} />
              </div>
              <div className="form_group">
                <label>Assigned Staff</label>
                <input type="text" name="assignedStaff" value={formData.assignedStaff} onChange={handleChange} />
              </div>
              <div className="form_group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Pending Intake">Pending Intake</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Discharged">Check-Out</option>
                </select>
              </div>
              <button type="submit" className="submit_btn">Save Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


/* ---------------- Main Dashboard ---------------- */
function DaycareManagerDashboard() {
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [bookings, setBookings] = useState([]);
  const handleDashboardContentChange = (content) => {
    setSelectedSection(content);
  };

  return (
    <div className="dashboard_container">
      <div className="DB dashboard_header_cont">
        <Header />
      </div>
      <div className="dashboard_content">

      {/* Sidebar */}
        <div className="sidebar_cont" style={{ marginTop: "50px" }}>
          <div className="sidebar">
            <h2 className="sidebar_logo">Petora</h2>
            <ul className="sidebar_menu">
              <li onClick={() => handleDashboardContentChange("Dashboard")} className={selectedSection === "Dashboard" ? "selected" : ""}>Dashboard</li>
              <li onClick={() => handleDashboardContentChange("Booking & Attendence")} className={selectedSection === "Booking & Attendence" ? "selected" : ""}>Booking & Attendence</li>
              <li onClick={() => handleDashboardContentChange("Activity Logs")} className={selectedSection === "Activity Logs" ? "selected" : ""}>Activity Logs</li>
              <li onClick={() => handleDashboardContentChange("Staff & Task")} className={selectedSection === "Staff & Task" ? "selected" : ""}>Staff & Task</li>
              <li onClick={() => handleDashboardContentChange("Reports & Finance")} className={selectedSection === "Reports & Finance" ? "selected" : ""}>Reports & Finance</li>
            </ul>
          </div>
        </div>

        {/* Content Section */}
        <div className="DCM_content">
          <div style={{width:'80%' }}>
            {selectedSection === "Dashboard" && <Profile />}
          </div>
          <div style={{ marginLeft: "20vw" }}>
            {selectedSection === "Booking & Attendence" && (
              <BookingsAttendance bookings={bookings} setBookings={setBookings} />
            )}
          </div>
          <div style={{ marginLeft: "20vw" }}>
            {selectedSection === "Activity Logs" && <ActivityLogs />}
          </div>
          <div style={{ marginLeft: "20vw" }}>
            {selectedSection === "Staff & Task" && <StaffScheduling />}
          </div>
          <div style={{ marginLeft: "20vw" }}>
            {selectedSection === "Reports & Finance" && <ReportsFinance/>}
          </div>
        </div>
        </div>
      
      
    </div>
  );
}

export default DaycareManagerDashboard;
