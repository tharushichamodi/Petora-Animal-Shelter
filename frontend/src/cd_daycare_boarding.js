import { useState, useEffect } from "react";
import { FaPaw, FaCamera, FaVideo, FaClipboardList } from "react-icons/fa";
import "./css/cd_daycare_boarding.css";


import dayCare from "./images/daycare1.jpeg";
import dayCare2 from "./images/daycare2.jpeg";  
import dayCare3 from "./images/daycare3.jpeg";
import dayCare4 from "./images/daycare4.jpeg";

function DaycareBoarding() {
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]); // track customer bookings (synced with backend)
  const [dailyCapacity, setDailyCapacity] = useState(10); // will be fetched from backend
  const [published, setPublished] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activityLogs, setActivityLogs] = useState([]);

  const API_BASE = "http://localhost:3001/daycare_booking/api/daycare_bookings";
  const CAPACITY_API = "http://localhost:3001/daycare_capacity/api/capacity";
  const ACTIVITY_API = "http://localhost:3001/daycare_activitylog/api/activity_logs";
  
  // Demo packages (static content)
  const [packages] = useState([
    { id: 1, name: "Hourly Care", duration: "5 Hour", price: 2000, image: dayCare, features: ["Supervised Play", "Indoor/Outdoor Access","Feeding as per schedule"] },
    { id: 2, name: "Daily Care", duration: "1 Day", price: 4500, image: dayCare2, features: ["AM & PM Walks", "Feeding & Hydration", "Nap Time"] },
    { id: 3, name: "Weekly Bundle", duration: "7 Days", price: 20000, image: dayCare3, features: ["Everyday Care", "Basic Training", "Photo Updates"] },
    { id: 4, name: "Monthly Pass", duration: "30 Days", price: 75000, image: dayCare4, features: ["Priority Slots", "Enrichment Games", "Health Check Notes"] },
  ]);
  const [packageQuery, setPackageQuery] = useState("");
  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    species: "",
    date: "",
    package: "",
    vaccination: "Completed",
    medicalNotes: "",
  });

  useEffect(() => {
    // Static demo pet cards (unrelated to DB capacity; safe to keep visual content)
    setPets([
      {
        id: 1,
        name: "Buddy",
        activities: [
          { date: "2025-10-10", activity: "Morning Walk", notes: "Energetic and happy" },
          { date: "2025-10-11", activity: "Lunch & Nap", notes: "Ate well and rested calmly" },
        ],
        photos: [
          { id: 1, url: "/images/pet1.jpg", caption: "Morning playtime" },
          { id: 2, url: "/images/pet2.jpg", caption: "Nap time" },
        ],
        videos: [
          { id: 1, url: "/videos/play1.mp4", caption: "Running in the yard" },
        ],
      },
      {
        id: 2,
        name: "Luna",
        activities: [
          { date: "2025-10-10", activity: "Feeding", notes: "Ate chicken meal" },
          { date: "2025-10-11", activity: "Playtime", notes: "Loved playing fetch" },
        ],
        photos: [
          { id: 1, url: "/images/pet3.jpg", caption: "After lunch" },
          { id: 2, url: "/images/pet4.jpg", caption: "Playground time" },
        ],
        videos: [
          { id: 1, url: "/videos/play2.mp4", caption: "Chasing the ball" },
        ],
      },
    ]);

    // Fetch bookings from backend (replaces demo bookings)
    (async () => {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`Failed to fetch bookings (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((b, i) => ({
            id: b._id || b.id || i + 1,
            ownerName: b.ownerName || "",
            petName: b.animalName || b.petName || "",
            species: b.species || "",
            date: b.admissionDate ? new Date(b.admissionDate).toISOString().slice(0,10) : (b.date || ""),
            // prefer 'package' but fall back to 'reason' from older records
            package: b.package || b.reason || "",
            vaccination: b.vaccination || "",
            medicalNotes: b.medicalNotes || "",
          }));
          setBookings(mapped);
        }
      } catch (_) {
        // keep empty on error
      }
    })();
  }, []);

  // Fetch activity logs for customers (read-only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(ACTIVITY_API);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
          setActivityLogs(sorted);
        }
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // reflect manager toggle for capacity visibility
    const readPublish = () => {
      try {
        setPublished(localStorage.getItem('daycare_capacity_published') === 'true');
      } catch {}
    };
    readPublish();
    const onStorage = (e) => {
      if (e.key === 'daycare_capacity_published') readPublish();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    // Fetch current daily capacity from backend
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(CAPACITY_API);
        if (!res.ok) throw new Error(`Failed to fetch capacity (${res.status})`);
        const cap = await res.json();
        const value = parseInt(cap?.dailyCapacity, 10);
        if (!cancelled && !isNaN(value) && value >= 1) setDailyCapacity(value);
      } catch (_) {
        // keep default on error
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(CAPACITY_API);
        if (!res.ok) return;
        const cap = await res.json();
        const value = parseInt(cap?.dailyCapacity, 10);
        if (!isNaN(value) && value >= 1) setDailyCapacity(value);
      } catch (_) {}
    }, 60000);
    return () => clearInterval(id);
  }, []);

  // --- Capacity status ---
  const capacityUsed = Math.min((bookings.length / dailyCapacity) * 100, 100);
  const slotsLeft = dailyCapacity - bookings.length;

  const checkCapacityStatus = (bookings) => {
    if (bookings >= dailyCapacity) return "❌ Full Capacity";
    if (bookings === dailyCapacity - 1) return "⚠️ Almost Full";
    return `✅ ${Math.max(0, dailyCapacity - bookings)} Slots Left`;
  };

  // --- Handle form changes ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.ownerName.trim()) {
      alert("Owner Name is required.");
      const el = document.querySelector('input[name="ownerName"]');
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    if (bookings.length >= dailyCapacity) {
      alert("❌ Booking limit reached! Please choose another day.");
      return;
    }

    try {
      const payload = {
        ownerName: formData.ownerName,
        animalName: formData.petName,
        species: formData.species,
        admissionDate: formData.date,
        // Send only 'package'
        package: formData.package,
        vaccination: formData.vaccination,
        medicalNotes: formData.medicalNotes,
        assignedStaff: "",
        status: "Pending Intake",
      };
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to save booking (${res.status})`);
      const created = await res.json();
      const createdBooking = {
        id: created._id || created.id || bookings.length + 1,
        ownerName: created.ownerName || formData.ownerName,
        petName: created.animalName || formData.petName,
        species: created.species || formData.species,
        date: created.admissionDate ? new Date(created.admissionDate).toISOString().slice(0,10) : formData.date,
        package: created.package || created.reason || formData.package,
        vaccination: created.vaccination || formData.vaccination,
        medicalNotes: created.medicalNotes || formData.medicalNotes,
      };
      setBookings([...bookings, createdBooking]);
      setFormData({ ownerName: "", petName: "", species: "", date: "", package: "", vaccination: "Completed", medicalNotes: "" });
      setSuccessMsg("Booking saved successfully.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      alert(err?.message || 'Could not save booking. Please try again.');
    }
  };

  const choosePackage = (pkg) => {
    setFormData((prev) => ({ ...prev, package: `${pkg.name} — ${pkg.duration}` }));
    const el = document.querySelector('.DCD_booking_section');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredPackages = packages.filter((p) => {
    const q = packageQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      p.name,
      p.duration,
      String(p.price),
      ...(Array.isArray(p.features) ? p.features : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="DCD_pet_container">
      {showSuccess && (
        <div className="DCD_toast success">{successMsg || "Saved successfully"}</div>
      )}

      <header className="DCD_header">
        <h1>🐶 My Pets Dashboard</h1>
        <p>View each pet’s activities, photos, videos, and booking capacity</p>
      </header>
    
      {/* --- Daycare Packages --- */}
      <section className="DCD_packages_section">
        <h1>🧺 Daycare Packages</h1>
        <div className="DCD_searchbar_wrapper">
          <input
            type="text"
            placeholder="Search packages by name, duration, features, or price..."
            value={packageQuery}
            onChange={(e) => setPackageQuery(e.target.value)}
            className="DCD_search_input"
          />
        </div>
        <div className="DCD_packages_grid">
          {filteredPackages.map((p) => (
            <div key={p.id} className="DCD_package_card">
              {p.image && <img src={p.image} alt={p.name} />}
              <h3>{p.name}</h3>
              <p>{p.duration}</p>
              <p className="DCD_package_price">LKR {p.price.toLocaleString()}</p>
              <ul>
                {p.features.map((f, i) => (<li key={i}>{f}</li>))}
              </ul>
              <button type="button" className="submit_btn" onClick={() => choosePackage(p)}>Choose</button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Activity Logs (Read-only, from backend) --- */}
      <section className="DCD_activitylogs_section">
        <h2>📝 Daycare Activity Log</h2>
        {activityLogs.length === 0 && (
          <p style={{ opacity: 0.7 }}>No activities yet.</p>
        )}
        <ul className="DCD_activity_list">
          {activityLogs.map((log) => (
            <li key={(log && (log._id || log.activityID)) || Math.random()} className="DCD_activity_item">
              <div className="DCD_activity_date">
                <strong>{log?.date ? new Date(log.date).toISOString().slice(0, 10) : ""}</strong>
              </div>
              <h1 className="DCD_activity_title">{log?.petName || "Unknown Pet"}</h1>
              <div className="DCD_activity_text">
                {log?.activity || ""}{log?.food ? ` (${log.food})` : ""}
              </div>
              {log?.notes && <div className="notes">{log.notes}</div>}
              {(() => {
                const toAbs = (u) => (/^https?:\/\//i.test(String(u)) ? String(u) : `http://localhost:3001${u}`);
                let list = [];
                if (Array.isArray(log?.files) && log.files.length > 0) {
                  list = log.files.map(toAbs);
                } else if (log?.file) {
                  list = [toAbs(log.file)];
                } else if (Array.isArray(log?.filesUrls) && log.filesUrls.length > 0) {
                  list = log.filesUrls;
                } else if (log?.fileUrl) {
                  list = [log.fileUrl];
                }
                return list.length > 0 ? (
                  <div className="DCD_media_grid">
                    {list.map((url, i) => (
                      <div key={i} className="DCD_media_item">
                        {/\.(mp4|webm|ogg)$/i.test(url) ? (
                          <video src={url} controls />
                        ) : (
                          <img src={url} alt="activity" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
            </li>
          ))}
        </ul>
      </section>


      {/* --- Booking Section (Separate) --- */}
      <div className="DCD_booking_section">
        <h2>📋 Add New Booking</h2>

        {published && (
          <div className="DCD_capacity_status_box">
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{
                  width: `${capacityUsed}%`,
                  backgroundColor:
                    bookings.length >= dailyCapacity
                      ? "#e74c3c"
                      : slotsLeft <= 2
                      ? "#f1c40f" /*almost full*/
                      : "#27ae60",/*available*/
                }}
              ></div>
            </div>
            <p>
              {bookings.length} / {dailyCapacity} Booked —{" "}
              {slotsLeft > 0 ? `${slotsLeft} Slots Left` : "❌ Fully Booked"}
            </p>
          </div>
        )}

        <form className="DCD_booking_form" onSubmit={handleBookingSubmit}>
          <div className="form_group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label>Pet Name</label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label>Species</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
          <div className="form_group">
            <label>Booking Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label>Package</label>
            <select
              name="package"
              value={formData.package}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select package</option>
              {packages.map((p) => (
                <option key={p.id} value={`${p.name} — ${p.duration}`}>
                  {p.name} — {p.duration}
                </option>
              ))}
            </select>
          </div>
          <div className="form_group">
            <label>Vaccination</label>
            <select name="vaccination" value={formData.vaccination} onChange={handleChange}>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="form_group">
            <label>Medical Notes</label>
            <textarea
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={bookings.length >= dailyCapacity}
            className="submit_btn"
          >
            {bookings.length >= dailyCapacity
              ? "Full — Try Another Day"
              : "Submit Booking"}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default DaycareBoarding;
