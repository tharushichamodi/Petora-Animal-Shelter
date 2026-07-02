import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaPaw,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaTrash,
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
} from "react-icons/fa";
import "./css/vet_assign_staff.css";

function AssignStaff() {
  const [staffList, setStaffList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [confirmAssign, setConfirmAssign] = useState(null);
  const [activeTab, setActiveTab] = useState("Doctors");

  const STAFF_API = "http://localhost:3001/vetStaff/api/vetStaffs";
  const APPOINTMENT_API =
    "http://localhost:3001/vetAppointment/api/vetAppointments";

  //  Fetch staff from backend
  const fetchStaff = async () => {
    try {
      const res = await fetch(STAFF_API);
      const data = await res.json();
      if (data.success) setStaffList(data.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const res = await fetch(APPOINTMENT_API);
      const data = await res.json();
      if (Array.isArray(data)) setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchAppointments();
  }, []);

  // Assign doctor
  const confirmAssignment = async () => {
    const { appt, staff } = confirmAssign;
    if (!staff || !appt) return alert("Please select a doctor first.");

    try {
      const res = await fetch(`${APPOINTMENT_API}/${appt.appointmentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDoctor: staff.name,
          status: "Assigned",
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ ${staff.name} assigned to ${appt.animalName || appt.petName} successfully!`);
        await fetchAppointments();
        await fetchStaff();
        setConfirmAssign(null);
      } else {
        alert("❌ Failed to assign doctor: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning doctor:", err);
    }
  };

  //  Delete (unassign)
  const deleteAssignment = async (appt) => {
    try {
      await fetch(`${APPOINTMENT_API}/${appt.appointmentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDoctor: null,
          status: "Pending",
        }),
      });
      await fetchAppointments();
    } catch (err) {
      console.error("Error removing assignment:", err);
    }
  };

  //  Complete appointment
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${APPOINTMENT_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Assigned Schedule", 40, 40);
    const head = [["Pet", "Type", "Date", "Time", "Doctor", "Status"]];
    const body = appointments.map((a) => [
      a.petName || a.animalName,
      a.reason || a.type,
      a.date,
      a.time,
      a.assignedDoctor || "Unassigned",
      a.status,
    ]);
    autoTable(doc, { head, body, startY: 60 });
    doc.save("assigned_schedule.pdf");
  };

  // Doctor search + filter
  const filteredStaff = staffList.filter((s) => {
    const matchesSearch = s.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.specialization === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="vet_assignstaff_container">
      <h2 className="vet_assignstaff_title">
        <FaUserMd /> Assign Staff to Appointments
      </h2>

      {/* Tabs */}
      <div className="vet_tabs">
        <button
          className={activeTab === "Doctors" ? "active" : ""}
          onClick={() => setActiveTab("Doctors")}
        >
          Doctors
        </button>
        <button
          className={activeTab === "Appointments" ? "active" : ""}
          onClick={() => setActiveTab("Appointments")}
        >
          Appointments
        </button>
      </div>

      {/* ---------------- DOCTORS TAB ---------------- */}
      {activeTab === "Doctors" && (
        <>
          <div className="vet_staff_filters">
            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Veterinary Surgeon">Veterinary Surgeon</option>
              <option value="Animal Nutritionist">Animal Nutritionist</option>
              <option value="Vaccination Specialist">Vaccination Specialist</option>
              <option value="Surgery Specialist">Surgery Specialist</option>
         
            </select>
            <button className="vet_export_btn" onClick={exportPDF}>
              <FaDownload /> Download PDF
            </button>
          </div>

          {/* Staff Cards */}
          <div className="vet_staff_cards">
            {filteredStaff.map((staff) => (
              <div
                key={staff._id}
                className={`vet_staff_card ${
                  staff.available ? "available" : "unavailable"
                }`}
              >
                <div className="vet_status_tag">
                  {staff.available ? "Available ✅" : "Unavailable 🔴"}
                </div>
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className="vet_staff_photo"
                />
                <h4>{staff.name}</h4>
                <p>{staff.specialization}</p>
                <p>
                  Workload:{" "}
                  <strong>
                    {
                      appointments.filter(
                        (a) => a.assignedDoctor === staff.name
                      ).length
                    }
                  </strong>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- APPOINTMENTS TAB ---------------- */}
      {activeTab === "Appointments" && (
        <div className="vet_appointment_section">
          {appointments.map((appt) => (
            <div key={appt._id} className="vet_appointment_card">
              <p>
                <FaPaw /> <strong>Pet:</strong> {appt.petName || appt.animalName}
              </p>
              <p>
                <strong>Type:</strong> {appt.reason}
              </p>
              <p>
                <FaCalendarAlt /> {appt.date} <FaClock /> {appt.time}
              </p>
              <p>
                <strong>Doctor:</strong> {appt.assignedDoctor || "Unassigned"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`vet_status_badge ${
                    appt.status === "Completed"
                      ? "completed"
                      : appt.status === "Assigned"
                      ? "assigned"
                      : "pending"
                  }`}
                >
                  {appt.status === "Completed" && <FaCheckCircle />}
                  {appt.status === "Assigned" && <FaHourglass />}
                  {appt.status === "Pending" && <FaTimesCircle />}
                  {appt.status}
                </span>
              </p>

              {/* Assign Doctor */}
              {appt.status !== "Completed" && (
                <div className="vet_assign_picker">
                  <select
                    className="vet_assign_select"
                    onChange={(e) => {
                      const selected = staffList.find(
                        (s) => s._id === e.target.value
                      );
                      if (selected) setConfirmAssign({ appt, staff: selected });
                    }}
                  >
                    <option value="">Select Doctor</option>
                    {staffList
                      .filter((s) => s.available)
                      .map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} — {s.specialization}
                        </option>
                      ))}
                  </select>
                  <button
                    className="vet_assign_btn"
                    onClick={() => {
                      if (
                        confirmAssign?.staff &&
                        confirmAssign?.appt?._id === appt._id
                      )
                        confirmAssignment();
                      else alert("Please select a doctor first.");
                    }}
                  >
                    Assign
                  </button>
                </div>
              )}

              {/* Delete (Unassign) */}
              {appt.assignedDoctor && (
                <button
                  className="vet_delete_btn"
                  onClick={() => deleteAssignment(appt)}
                >
                  <FaTrash /> Unassign Doctor
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm popup */}
      {confirmAssign && (
        <div className="vet_confirm_popup">
          <div className="vet_popup_content">
            <p>
              Assign <strong>{confirmAssign.staff.name}</strong> to{" "}
              <strong>
                {confirmAssign.appt.petName || confirmAssign.appt.animalName}
              </strong>
              ?
            </p>
            <div className="vet_popup_actions">
              <button onClick={confirmAssignment} className="vet_confirm_btn">
                Yes
              </button>
              <button
                onClick={() => setConfirmAssign(null)}
                className="vet_cancel_btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignStaff;
