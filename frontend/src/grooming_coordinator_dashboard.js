import React, { useState, useEffect } from "react";
import "./css/dashboard_common.css";
import "./css/grooming_coordinator_dashboard.css";
import axios from "axios";


import { Profile, Header } from "./animal_manager_dashboard";

// Groomer images
import groomer1 from "./images/groomer1.jpg";
import groomer2 from "./images/groomer2.jpg";
import groomer3 from "./images/groomer3.jpg";
import groomer4 from "./images/groomer4.jpg";
import groomer5 from "./images/groomer5.jpeg";
import groomer6 from "./images/groomer6.jpg";

function GroomingCoordinatorDashboard() {
  const [dashboardContent, setDashboardContent] = useState("Dashboard");
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [packageImage, setPackageImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  // Analytics state is derived on the fly from reservations


useEffect(() => {
  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:3001/groomingReservation/api/groomingReservations");

      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  fetchReservations();
}, []);


const updateStatus = async (id, newStatus) => {
  try {
    // Find the reservation being updated
    const current = reservations.find((r) => r._id === id);

    if (newStatus === "Approved") {
      // Check if another reservation with same groomer, date, time is already approved
      const conflict = reservations.find(
        (res) =>
          res._id !== id &&
          res.groomer?.id === current.groomer?.id &&
          res.date === current.date &&
          res.time === current.time &&
          res.status === "Approved"
      );

      if (conflict) {
        alert(
          `⚠️ Another reservation with ${current.groomer?.name} at ${current.date} ${current.time} is already approved.`
        );
        return; // Stop further execution
      }
    }

    // Proceed with backend update
    const res = await axios.put(
      `http://localhost:3001/groomingReservation/api/groomingReservations/${id}/status`,
      { status: newStatus }
    );

    setReservations((prev) =>
      prev.map((r) => (r._id === id ? res.data : r))
    );
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

// Grooming Packages State
const [packages, setPackages] = useState([]);

// Fetch all grooming packages
useEffect(() => {
  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:3001/groomingPackage/api/groomingPackages");
      setPackages(res.data);
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
    }
  };

  fetchPackages();
}, []);

// 🗑️ Delete Package
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this package?")) return;

  try {
    await axios.delete(`http://localhost:3001/groomingPackage/api/groomingPackages/${id}`);
    alert("✅ Package deleted successfully!");
    setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
  } catch (error) {
    console.error("❌ Error deleting package:", error);
    alert("Failed to delete package. Please check console for details.");
  }
};

// ✏️ Edit Package 
const handleEdit = (pkg) => {
  setEditingPackage(pkg);
  setShowPackageForm(true);
  setSelectedSpecies(pkg.species || []);
  setPreviewImage(pkg.photo ? `http://localhost:3001/uploads/${pkg.photo}` : null);
};






  // --- Check Groomer Availability ---
  const checkAvailability = (reservation) => {
  // Find if any other reservation with same groomer/date/time is approved
  const conflict = reservations.find(
    (res) =>
      res._id !== reservation._id &&
      res.groomer?.id === reservation.groomer?.id &&
      res.date === reservation.date &&
      res.time === reservation.time &&
      res.status === "Approved"
  );

  return conflict ? "Not Available" : "Available";
};


  return (
    <div className="dashboard_container">
      <div className="dashboard_content">
        {/* Sidebar */}
        <div className="sidebar_cont" style={{ marginTop: "50px" }}>
          <div className="sidebar">
            <h2 className="sidebar_logo">Petora</h2>
            <ul className="sidebar_menu">
              <li
                onClick={() => {
                  setDashboardContent("Dashboard");
                  setSelectedSection("Dashboard");
                }}
                className={selectedSection === "Dashboard" ? "selected" : ""}
              >
                Dashboard
              </li>
              <li
                onClick={() => {
                  setDashboardContent("Reservations");
                  setSelectedSection("Reservations");
                }}
                className={selectedSection === "Reservations" ? "selected" : ""}
              >
                Reservations
              </li>
              <li
                onClick={() => {
                  setDashboardContent("Groomer Profiles");
                  setSelectedSection("Groomer Profiles");
                }}
                className={
                  selectedSection === "Groomer Profiles" ? "selected" : ""
                }
              >
                Groomer Profiles
              </li>

                <li
  onClick={() => {
    setDashboardContent("Grooming Packages");
    setSelectedSection("Grooming Packages");
  }}
  className={selectedSection === "Grooming Packages" ? "selected" : ""}
>
  Grooming Packages
</li>


              <li
                onClick={() => {
                  setDashboardContent("Analytics");
                  setSelectedSection("Analytics");
                }}
                className={selectedSection === "Analytics" ? "selected" : ""}
              >
                Analytics
              </li>
            </ul>
          </div>
        </div>

        {/* Header */}
        <div className="DB dashboard_header_cont">
          <Header />
        </div>

        {/* Content Section */}
        <div className="GCM_content">
          {dashboardContent === "Dashboard" && (
            <Profile style={{ marginTop: "100px" }} />
          )}

          {dashboardContent === "Reservations" && (
            <div style={{width: "78vw", display: "flex", justifyContent: "center", marginLeft:'20vw'}}>
            <div className="grooming_coordinator_section reservations-section">
              <h2>Reservations</h2>
              <table className="grooming_coordinator_table">
                <thead>
  <tr>
    <th>Pet ID</th>
    <th>Pet Name</th>
    <th>Species</th>
    <th>Date</th>
    <th>Time</th>
    <th>Package</th>
    <th>Notes</th>
    <th>Groomer</th>
    <th>Availability</th>
    <th>Action</th>
    <th>Status</th>
  </tr>
</thead>

                <tbody>
  {reservations.map((res) => (
    <tr key={res._id}>
      <td>{res.pet?.id}</td>
      <td>{res.pet?.name}</td>
      <td>{res.pet?.species}</td>
      <td>{res.date}</td>
      <td>{res.time}</td>
      <td>{res.package?.name}</td>
      <td>{res.notes || "-"}</td>
      <td>{res.groomer?.name}</td>
      <td>{checkAvailability(res)}</td>
      <td>
<button
  className={`grooming_coordinator_btn approve ${res.status === "Approved" ? "approved" : ""} ${
    res.status === "Pending" && checkAvailability(res) === "Available" ? "can-accept" : ""
  }`}
  onClick={() => updateStatus(res._id, "Approved")}
  disabled={checkAvailability(res) === "Not Available" || res.status === "Approved"} 
>
  Accept
</button>


  <button
    className={`grooming_coordinator_btn reject ${
      res.status === "Pending" && checkAvailability(res) === "Not Available" ? "needs-attention" : ""
    }`}
    onClick={() => updateStatus(res._id, "Canceled")}
  >
    Cancel
  </button>
</td>

      <td>{res.status}</td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
            </div>
          )}

          {dashboardContent === "Groomer Profiles" && (
            <div style={{width: "80vw", display: "flex", justifyContent: "center", marginLeft:'20vw'}}>
            <div className="grooming_coordinator_section">
              <h2>Groomer Profiles</h2>
              <div className="grooming_coordinator_profiles_grid">
                {[
                  { id: 1, name: "Alice Johnson", rating: 4.8, img: groomer1 },
                  { id: 2, name: "Michael Lee", rating: 4.6, img: groomer2 },
                  { id: 3, name: "Sophia Brown", rating: 4.9, img: groomer3 },
                  { id: 4, name: "Daniel Smith", rating: 4.7, img: groomer4 },
                  { id: 5, name: "Emma Wilson", rating: 4.5, img: groomer5 },
                  { id: 6, name: "James Miller", rating: 4.8, img: groomer6 },
                ].map((groomer) => (
                  <div
                    key={groomer.id}
                    className="grooming_coordinator_profile_card"
                  >
                    <img
                      src={groomer.img}
                      alt={groomer.name}
                      className="grooming_coordinator_profile_img"
                    />
                    <h3>{groomer.name}</h3>
                    <p>⭐ {groomer.rating}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

 {dashboardContent === "Grooming Packages" && (
  <div
    style={{
      width: "80vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginLeft: "20vw",
    }}
  >
    <div className="grooming_coordinator_section">
      <div className="package-header">
        <h2>Grooming Packages</h2>
        <button
          onClick={() => setShowPackageForm(true)}
          className="add-package-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add New Package
        </button>
      </div>

      {/* Overlay Form */}
      {showPackageForm && (
        <div className="package-form-overlay">
          <form
            className="package-form"
            onSubmit={async (e) => {
  e.preventDefault();

  if (!selectedSpecies.length) {
    alert("⚠️ Please select at least one species.");
    return;
  }

  const formData = new FormData();
  formData.append("packageName", e.target.packageName.value.trim());
  formData.append("servicesIncluded", e.target.servicesIncluded.value.trim());
  formData.append("description", e.target.description.value.trim());
  formData.append("price", e.target.price.value.trim());
  formData.append("species", JSON.stringify(selectedSpecies)); // send as JSON string
  if (packageImage) formData.append("photo", packageImage);

  try {
  let response;
  if (editingPackage) {
    
    // ✅ Update existing package
    response = await axios.put(
      `http://localhost:3001/groomingPackage/api/groomingPackages/${editingPackage._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("✅ Package updated successfully!");
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg._id === editingPackage._id ? response.data : pkg
      )
    );
  } else {
    // ✅ Add new package
    response = await axios.post(
      "http://localhost:3001/groomingPackage/api/groomingPackages",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("✅ Package added successfully!");
    setPackages((prev) => [...prev, response.data]);
  }

  // Reset form
  setShowPackageForm(false);
  setEditingPackage(null);
  e.target.reset();
  setPreviewImage(null);
  setPackageImage(null);
  setSelectedSpecies([]);
} catch (error) {
  console.error("❌ Error saving package:", error);
  alert("Failed to save package. Check console for details.");
}

}}

          >
            <div className="close-btn" onClick={() => setShowPackageForm(false)}>
              ×
            </div>

            <h3 className="form-title">
  {editingPackage ? "Update Package" : "Add New Package"}
</h3>


            {/* Package Name */}
            <div className="form-group">
              <label>Package Name</label>
              <input
  name="packageName"
  type="text"
  placeholder="Enter package name"
  required
  className="form-input"
  defaultValue={editingPackage ? editingPackage.packageName : ""}
/>

            </div>

            {/* Services Included */}
            <div className="form-group">
              <label>Services Included</label>
              <input
  name="servicesIncluded"
  type="text"
  placeholder="E.g. Bath, Haircut, Nail Trim"
  required
  className="form-input"
  defaultValue={editingPackage ? editingPackage.servicesIncluded : ""}
/>

            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
  name="description"
  placeholder="Enter package description"
  rows="3"
  required
  className="form-textarea"
  defaultValue={editingPackage ? editingPackage.description : ""}
/>

            </div>

            {/* Species */}
            <div className="form-group">
              <label>
                Species <span style={{ color: "red" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="species-input"
                  readOnly
                  value={selectedSpecies.join(", ")}
                  onClick={() => {
                    const select = document.getElementById("speciesSelect");
                    select.style.display =
                      select.style.display === "none" ? "block" : "none";
                  }}
                  placeholder="Click to select species"
                  required
                />
                <small
                  style={{
                    color: "#666",
                    fontSize: "11px",
                    marginTop: "4px",
                    display: "block",
                    fontStyle: "italic",
                  }}
                >
                  💡 To select multiple species: Click the options while holding
                  Ctrl (Windows) or Cmd (Mac)
                </small>
                <select
                  id="speciesSelect"
                  className="form-select"
                  multiple
                  required
                  value={selectedSpecies}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setSelectedSpecies(values);
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      e.target.style.display = "none";
                    }, 200);
                  }}
                  style={{ display: "none" }}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird</option>
                  <option value="Fish">Fish</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Pig">Pig</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label>Price (Rs.)</label>
              <input
  name="price"
  type="number"
  placeholder="Enter price in Rs."
  required
  min="100"
  step="0.01"
  className="form-input"
  defaultValue={editingPackage ? editingPackage.price : ""}
/>

            </div>

            {/* Package Image */}
            <div className="form-group">
              <label>Package Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("⚠️ File too large! Please select under 5MB.");
                        return;
                      }
                      setPackageImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="form-input file-input"
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Package preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setPackageImage(null);
                        setPreviewImage(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <small
                style={{
                  color: "#666",
                  fontSize: "11px",
                  marginTop: "4px",
                  display: "block",
                  fontStyle: "italic",
                }}
              >
                📸 Upload an image to showcase your package (Max size: 5MB)
              </small>
            </div>

            {/* Submit Button */}
            <div className="submit-btn-container">
              <button type="submit" className="submit-btn">
  {editingPackage ? "Update Package" : "Add Package"}
</button>

            </div>
          </form>
        </div>
      )}

     {/* ===== Grooming Package Table ===== */}
<table className="grooming_coordinator_table">
  <thead>
    <tr>
      <th>Photo</th>
      <th>Package Name</th>
      <th>Services Included</th>
      <th>Description</th>
      <th>Species</th>
      <th>Price (Rs.)</th>
      <th>Created Date</th>
      <th>Update</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    {packages.length > 0 ? (
      packages.map((pkg) => (
        <tr key={pkg._id}>
          <td>
            {pkg.photo ? (
              <img
                src={`http://localhost:3001/uploads/${pkg.photo}`}
                alt={pkg.packageName}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{ color: "#888" }}>No image</span>
            )}
          </td>
          <td>{pkg.packageName}</td>
          <td>{pkg.servicesIncluded}</td>
          <td>{pkg.description}</td>
          <td>{pkg.species.join(", ")}</td>
          <td>Rs. {pkg.price}</td>
          <td>{new Date(pkg.createdAt).toLocaleDateString()}</td>

          {/* --- Update Button --- */}
          <td>
            <button
              onClick={() => handleEdit(pkg)}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
          </td>

          {/* --- Delete Button --- */}
          <td>
            <button
              onClick={() => handleDelete(pkg._id)}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🗑️ Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
          No packages found.
        </td>
      </tr>
    )}
  </tbody>
</table>


    </div>
  </div>
)}




          {dashboardContent === "Analytics" && (
            <div style={{ width: "80vw", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "20vw" }}>
              <div className="grooming_coordinator_section">
              <h2>Analytics</h2>
              {/* Compute analytics data inline */}
              {(() => {
                const parseDay = (d) => {
                  // support YYYY-MM-DD or Date
                  if (!d) return null;
                  if (typeof d === "string") return new Date(d);
                  try { return new Date(d); } catch { return null; }
                };

                const now = new Date();
                const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
                const monthLabel = (date) => date.toLocaleString(undefined, { month: 'short', year: '2-digit' });
                const addMonths = (date, m) => { const nd = new Date(date); nd.setMonth(nd.getMonth()+m); return nd; };

                const months = [-3,-2,-1,0,1,2,3].map((off) => addMonths(now, off));
                const monthKeys = months.map(monthKey);
                const monthLabels = months.map(monthLabel);

                // Filter relevant time window
                const windowSet = new Set(monthKeys);
                const windowReservations = reservations.filter((r) => {
                  const d = parseDay(r.date);
                  if (!d || isNaN(d)) return false;
                  return windowSet.has(monthKey(d));
                });

                // Monthly totals (Approved preferred; fallback to any)
                const monthCounts = monthKeys.map((key) => windowReservations.filter((r) => {
                  const d = parseDay(r.date);
                  const k = d ? monthKey(d) : "";
                  return k === key && (r.status === "Approved" || r.status === "Pending" || r.status === "Canceled");
                }).length);
                const monthMax = Math.max(1, ...monthCounts);

                // Top species
                const speciesMap = {};
                windowReservations.forEach((r) => {
                  const sp = r.pet?.species || "Unknown";
                  speciesMap[sp] = (speciesMap[sp] || 0) + 1;
                });
                const speciesEntries = Object.entries(speciesMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
                const speciesMax = Math.max(1, ...speciesEntries.map(([,v])=>v));

                // Top groomers by selection
                const groomerMap = {};
                windowReservations.forEach((r) => {
                  const g = r.groomer?.name || "Unknown";
                  groomerMap[g] = (groomerMap[g] || 0) + 1;
                });
                const groomerEntries = Object.entries(groomerMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
                const groomerMax = Math.max(1, ...groomerEntries.map(([,v])=>v));

                // helper to download SVG by id
                const downloadSvgAsPng = (svgId, title, filename) => {
                  const svg = document.getElementById(svgId);
                  if (!svg) return;
                  const serializer = new XMLSerializer();
                  let source = serializer.serializeToString(svg);
                  if (!source.match(/^\s*<\?xml/)) {
                    source = `<?xml version="1.0" standalone="no"?>\r\n` + source;
                  }
                  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
                  const img = new Image();
                  const width = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal.width : svg.getAttribute('width');
                  const height = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal.height : svg.getAttribute('height');
                  img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const baseW = Number(width) || svg.clientWidth || 800;
                    const baseH = Number(height) || svg.clientHeight || 600;
                    const titleH = title ? 32 : 0;
                    canvas.width = baseW;
                    canvas.height = baseH + titleH;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    if (title) {
                      ctx.fillStyle = '#111827';
                      ctx.font = 'bold 16px Quicksand, Arial, sans-serif';
                      ctx.textBaseline = 'top';
                      ctx.fillText(title, 16, 8);
                    }
                    ctx.drawImage(img, 0, titleH);
                    const png = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = png;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };
                  img.src = url;
                };

                return (
                  <div className="analytics_stack">
                    {/* Monthly Reservations: Line + Dots */}
                    <div className="chart_card">
                      <div className="chart_title">Monthly Reservations (Prev 3 • Current • Next 3)</div>
                      {(() => {
                        const w = 760, h = 260, padL = 40, padR = 20, padT = 20, padB = 40;
                        const innerW = w - padL - padR;
                        const innerH = h - padT - padB;
                        const max = Math.max(1, ...monthCounts);
                        const pts = monthCounts.map((v, i) => {
                          const x = padL + (i/(monthCounts.length-1)) * innerW;
                          const y = padT + innerH - (v/max) * innerH;
                          return { x, y, v };
                        });
                        const path = pts.map((p, i) => `${i===0? 'M':'L'} ${p.x} ${p.y}`).join(' ');
                        return (
                          <div className="line_wrap">
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                              <button className="analytics_download_btn" onClick={() => downloadSvgAsPng('analytics-line-svg', 'Monthly Reservations (Prev 3 • Current • Next 3)', 'Monthly_Reservations.png')}>Download</button>
                            </div>
                            <svg id="analytics-line-svg" className="line_svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                              <defs>
                                <linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#6a5acd" />
                                  <stop offset="50%" stopColor="#3498db" />
                                  <stop offset="100%" stopColor="#27ae60" />
                                </linearGradient>
                              </defs>
                              {/* Axes */}
                              <line x1={padL} y1={padT} x2={padL} y2={h-padB} stroke="#e5e7eb" />
                              <line x1={padL} y1={h-padB} x2={w-padR} y2={h-padB} stroke="#e5e7eb" />
                              {/* X labels */}
                              {monthLabels.map((lbl,i)=>{
                                const x = padL + (i/(monthLabels.length-1))*innerW;
                                return <text key={lbl} x={x} y={h-padB+18} fontSize="11" textAnchor="middle" fill="#555">{lbl}</text>
                              })}
                              {/* Line */}
                              <path d={path} fill="none" stroke="url(#gradLine)" strokeWidth="3" className="line_path" />
                              {/* Dots */}
                              {pts.map((p,i)=> (
                                <g key={i}>
                                  <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#111827" strokeWidth="1" />
                                  <circle cx={p.x} cy={p.y} r="3.5" fill={i===3? "#f39c12" : "#6a5acd"} className="line_dot" />
                                  <text x={p.x} y={p.y-10} fontSize="11" textAnchor="middle" fill="#333">{p.v}</text>
                                </g>
                              ))}
                            </svg>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Top Species: Pie Chart (percentages, legend at right) */}
                    <div className="chart_card">
                      <div className="chart_title">Top Species by Appointments (Pie)</div>
                      {(() => {
                        if (!speciesEntries.length) return <div className="empty_text">No data</div>;
                        const total = speciesEntries.reduce((s, [, v]) => s + v, 0) || 1;
                        let start = 0;
                        const colors = ["#6a5acd","#ff7675","#55efc4","#ffeaa7","#74b9ff","#fd79a8"];
                        const R = 140, cx = 200, cy = 180;
                        const arcs = speciesEntries.map(([name,val],idx)=>{
                          const ang = (val/total)*Math.PI*2;
                          const x1 = cx + R*Math.cos(start);
                          const y1 = cy + R*Math.sin(start);
                          const x2 = cx + R*Math.cos(start+ang);
                          const y2 = cy + R*Math.sin(start+ang);
                          const large = ang>Math.PI ? 1:0;
                          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
                          const fill = colors[idx%colors.length];
                          start += ang;
                          const pct = Math.round((val/total)*100);
                          return { name, val, pct, d, fill };
                        });
                        return (
                          <div className="pie_wrap">
                            <div className="pie_chart_box">
                              <div className="pie_dl_row">
                                <button className="analytics_download_btn" onClick={() => downloadSvgAsPng('analytics-pie-svg', 'Top Species by Appointments', 'Top_Species.png')}>Download</button>
                              </div>
                              <svg id="analytics-pie-svg" width="420" height="360" viewBox="0 0 420 360">
                                {arcs.map((a,i)=> <path key={i} d={a.d} fill={a.fill} />)}
                              </svg>
                            </div>
                            <div className="pie_legend">
                              {arcs.map((a)=> (
                                <div key={a.name} className="legend_row">
                                  <span className="legend_color" style={{ background:a.fill }} />
                                  <span className="legend_label">{a.name}</span>
                                  <span className="legend_value">{a.pct}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="chart_card">
                      <div className="chart_title">Top Groomers by Selection</div>
                      {(() => {
                        if (!groomerEntries.length) return <div className="empty_text">No data</div>;
                        const w = 760, padL = 140, padR = 40, padT = 20, padB = 40;
                        const barH = 20, gap = 12;
                        const h = padT + padB + groomerEntries.length * (barH + gap);
                        return (
                          <div className="hbars_wrap">
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                              <button className="analytics_download_btn" onClick={() => downloadSvgAsPng('analytics-hbars-svg', 'Top Groomers by Selection', 'Top_Groomers.png')}>Download</button>
                            </div>
                            <svg id="analytics-hbars-svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                              <rect x="0" y="0" width={w} height={h} fill="#ffffff" />
                              {groomerEntries.map(([name, val], idx) => {
                                const y = padT + idx * (barH + gap);
                                const width = ((val / groomerMax) * (w - padL - padR));
                                return (
                                  <g key={name}>
                                    <text x={padL - 8} y={y + barH - 4} fontSize="12" textAnchor="end" fill="#333">{name}</text>
                                    <rect x={padL} y={y} width={width} height={barH} fill="#7a67ee" rx="4" />
                                    <text x={padL + width + 6} y={y + barH - 4} fontSize="12" fill="#333">{val}</text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default GroomingCoordinatorDashboard;
