import React, { useState, useEffect, useRef } from "react";
import "./css/vet_appointment_requests.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("🛑 Error in AppointmentRequests:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
          ⚠️ Something went wrong while loading Appointment Requests.
        </div>
      );
    }
    return this.props.children;
  }
}

function AppointmentRequestsCore() {
  const [appointments, setAppointments] = useState([]);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [doctors, setDoctors] = useState([]); 
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const prevCount = useRef(0);


  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/vetAppointment/api/vetAppointments"
      );
      const result = await res.json();

      if (Array.isArray(result)) {
        setAppointments(result);
      } else if (result.success && Array.isArray(result.data)) {
        setAppointments(result.data);
      } else if (result.success && result.data) {
        setAppointments([result.data]);
      }

      if (prevCount.current < (result.length || 0)) {
        const diff = (result.length || 0) - prevCount.current;
        if (diff > 0) setNewRequestCount(diff);
      }
      prevCount.current = result.length || 0;
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };


  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3001/vetStaff/api/vetStaffs");
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((doc, i) => ({
          id: doc._id || i + 1,
          name: doc.name,
          specialization: doc.specialization,
          photo: doc.photo || "https://i.pravatar.cc/100",
          assignedAppointments: doc.workload || 0,
          available: doc.available,
          maxWorkload: doc.maxWorkload || 5,
        }));
        setDoctors(formatted);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors(); 
    const refreshHandler = () => fetchAppointments();
    window.addEventListener("appointmentsUpdated", refreshHandler);

    const interval = setInterval(fetchAppointments, 10000);
    return () => {
      window.removeEventListener("appointmentsUpdated", refreshHandler);
      clearInterval(interval);
    };
  }, []);

  
  const handleAssign = async (doctor) => {
    if (!selectedAppointment)
      return alert("⚠️ Please select an appointment first.");

    try {
      const res = await fetch(
        `http://localhost:3001/vetAppointment/api/vetAppointments/${selectedAppointment.appointmentID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Assigned",
            assignedDoctor: doctor.name,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(
          `✅ ${doctor.name} assigned to ${
            selectedAppointment.petName || selectedAppointment.animalName
          } successfully!`
        );

        await fetchAppointments();
        await fetchDoctors();
        window.dispatchEvent(new Event("appointmentsUpdated"));
        setSelectedAppointment(null);
      } else {
        alert("❌ Failed to assign doctor: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning doctor:", err);
    }
  };


  const handleUnassign = async (appt) => {
    try {
      await fetch(
        `http://localhost:3001/vetAppointment/api/vetAppointments/${appt.appointmentID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Pending", assignedDoctor: null }),
        }
      );
      await fetchAppointments();
      window.dispatchEvent(new Event("appointmentsUpdated"));
    } catch (err) {
      console.error("Error unassigning doctor:", err);
    }
  };

  const handleComplete = async (appt) => {
    try {
      await fetch(
        `http://localhost:3001/vetAppointment/api/vetAppointments/${appt.appointmentID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        }
      );
      await fetchAppointments();
      window.dispatchEvent(new Event("appointmentsUpdated"));
    } catch (err) {
      console.error("Error completing appointment:", err);
    }
  };


  const handleDelete = async (appt) => {
    try {
      await fetch(
        `http://localhost:3001/vetAppointment/api/vetAppointments/${appt.appointmentID}`,
        { method: "DELETE" }
      );
      await fetchAppointments();
      window.dispatchEvent(new Event("appointmentsUpdated"));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  
  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.name.toLowerCase();
    const specialization = doc.specialization.toLowerCase();
    return (
      name.includes(doctorSearch.toLowerCase()) ||
      specialization.includes(doctorSearch.toLowerCase())
    );
  });

  //  unavailable if max workload reached
  const isDoctorAvailable = (doctor) =>
    doctor.available && doctor.assignedAppointments < doctor.maxWorkload;

  //  Filter appointments by status
  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "All") return true;
    return appt.status === filter;
  });

  return (
    <div className="HMA_container">
      {/* Header */}
      <div className="HMA_headerBar_centered">
        <h2 className="HMA_title_centered">
          🐾 Appointment Requests{" "}
          {newRequestCount > 0 && (
            <span className="HMA_badge_centered">+{newRequestCount} New</span>
          )}
        </h2>
       
        <button
          className="HMA_refreshBtn_centered"
          onClick={() => {
            setNewRequestCount(0);
            fetchAppointments();
            fetchDoctors();
          }}
        >
          🔄 Refresh Appointments
        </button>
      </div>

      {/* Filters */}
      <div className="HMA_filterBar">
        {["All", "Pending", "Assigned", "Completed"].map((f) => (
          <button
            key={f}
            className={`HMA_filterBtn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {filteredAppointments.length === 0 ? (
        <p className="HMA_empty">No appointments found for this filter.</p>
      ) : (
        <div className="HMA_cardsGrid">
          {filteredAppointments.map((appt) => (
            <div key={appt._id || appt.appointmentID} className="HMA_card fadeIn">
              <div className="HMA_cardHeader">
                <h3>{appt.petName || appt.animalName || "Unnamed Pet"} 🐾</h3>
                <span
                  className={`HMA_status ${
                    appt.status ? appt.status.toLowerCase() : "pending"
                  }`}
                >
                  {appt.status || "Pending"}
                </span>
              </div>
              <p>
                <strong>Owner:</strong> {appt.ownerName || "—"}
              </p>
              <p>
                <strong>Date:</strong> {appt.date} at {appt.time}
              </p>
              <p>
                <strong>Reason:</strong> {appt.reason || appt.type || "—"}
              </p>
              <p>
                <strong>Doctor:</strong> {appt.assignedDoctor || "Not Assigned"}
              </p>

              <div className="HMA_cardActions">
                {appt.status === "Pending" && (
                  <button
                    className="HMA_assignBtn"
                    onClick={() => setSelectedAppointment(appt)}
                  >
                    Assign Doctor
                  </button>
                )}
                {appt.status === "Assigned" && (
                  <>
                    <button
                      className="HMA_editBtn"
                      onClick={() => setSelectedAppointment(appt)}
                    >
                      Reassign
                    </button>
                    <button
                      className="HMA_deleteBtn"
                      onClick={() => handleUnassign(appt)}
                    >
                      Unassign
                    </button>
                    <button
                      className="HMA_completeBtn"
                      onClick={() => handleComplete(appt)}
                    >
                      Complete
                    </button>
                  </>
                )}
                <button
                  className="HMA_deleteBtn"
                  onClick={() => handleDelete(appt)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Popup */}
      {selectedAppointment && (
        <div className="HMA_popupOverlay">
          <div className="HMA_popup scaleUp">
            <h3>
              Assign Doctor to{" "}
              {selectedAppointment.petName || selectedAppointment.animalName} (
              {selectedAppointment.reason || selectedAppointment.type})
            </h3>
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="HMA_searchInput"
            />
            <div className="HMA_doctorList">
              {filteredDoctors.map((doc) => {
                const available = isDoctorAvailable(doc);
                const workloadRatio = `${doc.assignedAppointments || 0} / ${
                  doc.maxWorkload || 5
                }`;

                return (
                  <div
                    key={doc.id}
                    className={`HMA_doctorCard ${
                      available ? "HMA_available" : "HMA_unavailable"
                    }`}
                  >
                    <img src={doc.photo} alt={doc.name} className="HMA_docPhoto" />
                    <h4>{doc.name}</h4>
                    <p>{doc.specialization}</p>
                    <p>
                      {available ? (
                        <span className="HMA_green">Available</span>
                      ) : (
                        <span className="HMA_red">Unavailable</span>
                      )}
                    </p>
                    <p className="HMA_workload">
                      Workload: <strong>{workloadRatio}</strong>
                    </p>
                    <button
                      className="HMA_confirmBtn"
                      disabled={!available}
                      onClick={() => handleAssign(doc)}
                    >
                      {selectedAppointment.assignedDoctor ? "Reassign" : "Assign"}
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="HMA_closeBtn"
              onClick={() => setSelectedAppointment(null)}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default function AppointmentRequests() {
  return (
    <ErrorBoundary>
      <AppointmentRequestsCore />
    </ErrorBoundary>
  );
}
