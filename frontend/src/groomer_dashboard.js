import React, { useEffect, useState } from "react";
import "./css/dashboard_common.css";
import "./css/groomer_dashboard.css";
import { Profile, Header } from "./animal_manager_dashboard";
import axios from "axios";
import jsPDF from "jspdf";

function GroomerDashboard() {
  const [dashboardContent, setDashboardContent] = useState("Dashboard");
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [myReservations, setMyReservations] = useState([]);
  const [groomerId, setGroomerId] = useState("");
  const [groomerName, setGroomerName] = useState("");
  const [stats, setStats] = useState({ total: 0, mine: 0 });

  // Load current groomer id and fetch assigned reservations
  useEffect(() => {
    // Resolve groomerId preference order:
    // 1) auth.groomerId (direct id)
    // 2) auth.userID -> look up groomer by userID
    // 3) grooming.selectedGroomer.id (fallback for testing)
    const resolveGroomerId = async () => {
      const direct = localStorage.getItem("auth.groomerId");
      if (direct) return direct;

      const userIdStr = localStorage.getItem("auth.userID");
      if (userIdStr) {
        try {
          const grRes = await axios.get("http://localhost:3001/groomer/api/groomers");
          const list = grRes.data || [];
          const match = list.find((g) => String(g.userID) === String(userIdStr));
          if (match?._id) return match._id;
        } catch {}
      }

      try {
        const sel = JSON.parse(localStorage.getItem("grooming.selectedGroomer") || "null");
        if (sel?.id) return sel.id;
      } catch {}
      return "";
    };

    const fetchMyReservations = async (gid) => {
      try {
        const res = await axios.get(
          "http://localhost:3001/groomingReservation/api/groomingReservations"
        );
        const all = res.data || [];
        const gidStr = String(gid || "").trim();
        const mine = gidStr
          ? all.filter((r) => {
              const rid = r?.groomer?.id ? String(r.groomer.id).trim() : "";
              const rid2 = r?.groomer?._id ? String(r.groomer._id).trim() : "";
              return r.status === "Approved" && (rid === gidStr || rid2 === gidStr);
            })
          : [];
        setMyReservations(mine);
        setStats({ total: all.length, mine: mine.length });
      } catch (err) {
        console.error("Error loading my reservations:", err);
        setMyReservations([]);
        setStats({ total: 0, mine: 0 });
      }
    };

    (async () => {
      const gid = await resolveGroomerId();
      setGroomerId(gid);
      await fetchMyReservations(gid);
    })();
  }, []);

  // When switching to Reservations, refresh list
  useEffect(() => {
    const refresh = async () => {
      if (dashboardContent !== "Reservations" || !groomerId) return;
      try {
        const res = await axios.get(
          "http://localhost:3001/groomingReservation/api/groomingReservations"
        );
        const all = res.data || [];
        const gidStr = String(groomerId || "").trim();
        const mine = all.filter((r) => {
          const rid = r?.groomer?.id ? String(r.groomer.id).trim() : "";
          const rid2 = r?.groomer?._id ? String(r.groomer._id).trim() : "";
          return r.status === "Approved" && (rid === gidStr || rid2 === gidStr);
        });
        setMyReservations(mine);
        setStats({ total: all.length, mine: mine.length });
      } catch {}
    };
    refresh();
  }, [dashboardContent, groomerId]);

  // Resolve Groomer Name from groomerId using groomers and employees
  useEffect(() => {
    const run = async () => {
      if (!groomerId) {
        setGroomerName("");
        return;
      }
      try {
        const [grRes, empRes] = await Promise.all([
          axios.get("http://localhost:3001/groomer/api/groomers"),
          axios.get("http://localhost:3001/employee/api/employees"),
        ]);
        const groomers = grRes.data || [];
        const employees = empRes.data || [];
        const g = groomers.find((x) => String(x._id) === String(groomerId));
        if (!g) {
          setGroomerName("");
          return;
        }
        const emp = employees.find((e) => String(e.empID) === String(g.empID));
        const fullName = emp ? `${emp.firstName} ${emp.LastName}` : (g.name || (g.empID ? `Groomer ${g.empID}` : "Groomer"));
        setGroomerName(fullName);
      } catch {
        setGroomerName("");
      }
    };
    run();
  }, [groomerId]);

  useEffect(() => {
    if (dashboardContent !== "Reservations" || !groomerId) return;
    const t = setInterval(async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/groomingReservation/api/groomingReservations"
        );
        const all = res.data || [];
        const gidStr = String(groomerId || "").trim();
        const mine = all.filter((r) => {
          const rid = r?.groomer?.id ? String(r.groomer.id).trim() : "";
          const rid2 = r?.groomer?._id ? String(r.groomer._id).trim() : "";
          return r.status === "Approved" && (rid === gidStr || rid2 === gidStr);
        });
        setMyReservations(mine);
        setStats({ total: all.length, mine: mine.length });
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [dashboardContent, groomerId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(16);
    doc.text("My Grooming Reservations", 14, y);
    y += 8;
    const subtitle = groomerName ? `Groomer: ${groomerName}` : (groomerId ? `Groomer ID: ${groomerId}` : "");
    if (subtitle) {
      doc.setFontSize(11);
      doc.text(subtitle, 14, y);
      y += 6;
    }

    // Headers
    doc.setFontSize(12);
    const headers = ["Pet Name", "Species", "Date", "Time", "Package", "Status"];
    const colX = [14, 54, 90, 120, 145, 180];
    headers.forEach((h, i) => doc.text(h, colX[i], y));
    y += 6;

    // Rows
    doc.setFontSize(10);
    myReservations.forEach((r) => {
      const row = [
        r.pet?.name || "-",
        r.pet?.species || "-",
        r.date || "-",
        r.time || "-",
        r.package?.name || "-",
        r.status || "-",
      ];
      row.forEach((cell, i) => {
        doc.text(String(cell), colX[i], y);
      });
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save("My_Reservations.pdf");
  };

  return (
    <div className="dashboard_container groomer_dashboard_page">
      <div className="dashboard_content">
        {/* Sidebar */}
        <div className="sidebar_cont" style={{ marginTop: "50px" }}>
          <div className="sidebar">
            <h2 className="sidebar_logo">Petora</h2>
            <ul className="sidebar_menu">
              {["Dashboard", "Reservations", "Working Space", "Daily Summary"].map(
                (item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setDashboardContent(item);
                      setSelectedSection(item);
                    }}
                    className={selectedSection === item ? "selected" : ""}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Header */}
        <div className="DB dashboard_header_cont">
          <Header />
        </div>

        {/* Main Content */}
        <div className="GCM_content">
          {dashboardContent === "Dashboard" && (
            <div className="groomer_dashboard_section">
              <Profile style={{ marginTop: "100px" }} />
            </div>
          )}

          {dashboardContent === "Reservations" && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "80px" }}>
              <div className="groomer_dashboard_section">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0 }}>My Reservations</h2>
                  <button className="groomer_btn download" onClick={handleDownloadPDF}>Download PDF</button>
                </div>
                <div style={{ marginBottom: "10px", color: "#666" }}>
                  {groomerName ? `Groomer: ${groomerName}` : (groomerId ? `Groomer ID: ${groomerId}` : "No groomer selected")}
                </div>
                <table className="groomer_table">
                  <thead>
                    <tr>
                      <th>Pet Name</th>
                      <th>Species</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Package</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myReservations.length > 0 ? (
                      myReservations.map((r) => (
                        <tr key={r._id}>
                          <td>{r.pet?.name}</td>
                          <td>{r.pet?.species}</td>
                          <td>{r.date}</td>
                          <td>{r.time}</td>
                          <td>{r.package?.name || "-"}</td>
                          <td>{r.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: 12 }}>
                          {groomerId
                            ? "No approved reservations assigned to you yet."
                            : "Please ensure a groomer id is available (auth.groomerId)."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


  {dashboardContent === "Working Space" && (
  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "80px" }}>
    <div className="groomer_dashboard_section">
      <h2>Working Space</h2>
      <p>View accepted reservations and mark as completed.</p>
      <table className="groomer_table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Package</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Buddy</td>
            <td>2025-10-11</td>
            <td>11:00 AM</td>
            <td>Haircut + Bath</td>
            <td>
              <textarea
                placeholder="Add notes here..."
                className="groomer_note_area"
              ></textarea>
            </td>
            <td>
              <button className="groomer_btn complete">Completed</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


          {dashboardContent === "Daily Summary" && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "80px" }}>
            <div className="groomer_dashboard_section">
              <h2>Daily Summary</h2>
              <div className="groomer_summary_cards">
                <div className="groomer_summary_card pending">
                  <h3>Pending</h3>
                  <p>3</p>
                </div>
                <div className="groomer_summary_card accepted">
                  <h3>Accepted</h3>
                  <p>2</p>
                </div>
                <div className="groomer_summary_card completed">
                  <h3>Completed</h3>
                  <p>1</p>
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default GroomerDashboard;
