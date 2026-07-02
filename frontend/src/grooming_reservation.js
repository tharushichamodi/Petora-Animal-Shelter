import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/grooming_reservation.css";
import axios from "axios";
import jsPDF from "jspdf"; 

const PETS = [
  { id: "pet-1", name: "Buddy", species: "Dog" },
  { id: "pet-2", name: "Misty", species: "Cat" },
  { id: "pet-3", name: "Coco", species: "Rabbit" },
  { id: "pet-4", name: "Max", species: "Dog" },
  { id: "pet-5", name: "Luna", species: "Cat" },
  { id: "pet-6", name: "Bella", species: "Dog" },
  { id: "pet-7", name: "Oliver", species: "Cat" },
  { id: "pet-8", name: "Daisy", species: "Rabbit" },
  { id: "pet-9", name: "Charlie", species: "Dog" },
  { id: "pet-11", name: "Simba", species: "Hamster" },
];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];


function GroomingReservation() {
  const navigate = useNavigate();

  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedGroomer, setSelectedGroomer] = useState(null);
  const [errors, setErrors] = useState({});

  const [showPackages, setShowPackages] = useState(false);
  const [showGroomers, setShowGroomers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  const [packageSearch, setPackageSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [groomerSearch, setGroomerSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [packages, setPackages] = useState([]);
  const [groomers, setGroomers] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");

  const [showOverlay, setShowOverlay] = useState(false); // NEW
  const [overlayReservation, setOverlayReservation] = useState(null); // NEW

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
  pet: "",
  date: "",
  time: "",
  package: "",
  groomer: ""
});

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


const fetchReservation = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3001/groomingReservation/api/groomingReservations/${id}`);
    setOverlayReservation(res.data);
    setShowOverlay(true);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    alert("Failed to fetch reservation details.");
  }
};


  useEffect(() => {
    try {
      const pkg = JSON.parse(localStorage.getItem("grooming.selectedPackage") || "null");
      if (pkg) setSelectedPackage(pkg);
    } catch {}
    try {
      const gr = JSON.parse(localStorage.getItem("grooming.selectedGroomer") || "null");
      if (gr) setSelectedGroomer(gr);
    } catch {}
    try {
      const draft = JSON.parse(localStorage.getItem("grooming.reservationDraft") || "null");
      if (draft) {
        setPetId(draft.petId || "");
        setDate(draft.date || "");
        setTime(draft.time || "");
        setNotes(draft.notes || "");
      }
    } catch {}
    loadBookings();
  }, []);

  useEffect(() => {
    const checkStatuses = async () => {
      try {
        const snapshot = JSON.parse(localStorage.getItem("grooming.statusSnapshot") || "{}");
        const nextSnapshot = { ...snapshot };
        const ids = (bookings || []).map(b => b.id).filter(Boolean);
        const results = await Promise.all(ids.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:3001/groomingReservation/api/groomingReservations/${id}`);
            return { id, data: res.data };
          } catch {
            return { id, data: null };
          }
        }));
        const newlyApproved = [];
        results.forEach(r => {
          if (!r.data) return;
          const prev = snapshot[r.id];
          const curr = r.data.status;
          if (prev !== "Approved" && curr === "Approved") {
            newlyApproved.push({
              id: r.id,
              title: "Reservation Approved",
              message: `Your reservation for ${r.data.pet?.name || "Pet"} on ${r.data.date} at ${r.data.time} was approved.`,
            });
          }
          nextSnapshot[r.id] = curr;
        });
        if (newlyApproved.length) setNotifications(prev => [...newlyApproved, ...prev]);
        localStorage.setItem("grooming.statusSnapshot", JSON.stringify(nextSnapshot));
      } catch {}
    };
    checkStatuses();
    const t = setInterval(checkStatuses, 15000);
    return () => clearInterval(t);
  }, [bookings]);

  // Load packages from backend groomingPackage API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:3001/groomingPackage/api/groomingPackages");
        const mapped = (res.data || []).map(p => ({
          id: p._id,
          name: p.packageName,
          price: Number(p.price) || 0,
          duration: "",
          species: Array.isArray(p.species) ? p.species : []
        }));
        setPackages(mapped);
      } catch (err) {
        console.error("Error loading packages:", err);
        setPackages([]);
      }
    };
    fetchPackages();
  }, []);

  // Load groomers from backend groomers API + join with employees for names
  useEffect(() => {
    const fetchGroomers = async () => {
      try {
        const [grRes, empRes] = await Promise.all([
          axios.get("http://localhost:3001/groomer/api/groomers"),
          axios.get("http://localhost:3001/employee/api/employees"),
        ]);

        const employees = empRes.data || [];
        const empMap = new Map(employees.map(e => [Number(e.empID), e]));

        const mapped = (grRes.data || []).map(g => {
          const emp = empMap.get(Number(g.empID));
          const fullName = emp ? `${emp.firstName} ${emp.LastName}` : null;
          return {
            id: g._id,
            name: fullName || g.name || g.fullName || g.groomerName || (g.empID ? `Groomer ${g.empID}` : (g.groomerID ? `Groomer ${g.groomerID}` : "Groomer")),
            rating: Number(g.ratings) || 0,
            jobs: Number(g.jobs || g.completedJobs || g.totalJobs || 0),
          };
        });
        setGroomers(mapped);
      } catch (err) {
        console.error("Error loading groomers:", err);
        setGroomers([]);
      }
    };
    fetchGroomers();
  }, []);

  useEffect(() => {
    const draft = { petId, date, time, notes };
    localStorage.setItem("grooming.reservationDraft", JSON.stringify(draft));
  }, [petId, date, time, notes]);

  const loadBookings = () => {
    const existing = JSON.parse(localStorage.getItem("grooming.bookings") || "[]");
    setBookings(existing);
  };

  const saveBookings = (arr) => {
    localStorage.setItem("grooming.bookings", JSON.stringify(arr));
    setBookings(arr);
  };

  //validation
  const validate = () => {
    const e = {};
    if (!petId) e.petId = "Please select a pet.";
    if (!date) e.date = "Please choose a date.";
    if (!time) e.time = "Please choose a time slot.";
    if (!selectedPackage) e.package = "Please select a package.";
    // species validation: ensure selected package allows selected pet's species
    if (selectedPackage && petId) {
      const pet = PETS.find(p => p.id === petId);
      const speciesAllowed = !selectedPackage.species || selectedPackage.species.length === 0 ||
        selectedPackage.species.includes(pet?.species);
      if (!speciesAllowed) {
        e.package = "Selected package is not available for this pet's species.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleReserve = async () => {
  if (!validate()) return;

  const reservation = {
    pet: PETS.find(p => p.id === petId),
    date,
    time,
    package: selectedPackage,
    groomer: selectedGroomer,
    notes,
    status: "Pending",
  };

  try {
    const response = await axios.post(
      "http://localhost:3001/groomingReservation/api/groomingReservations",
      reservation
    );

    console.log("Reservation saved:", response.data);
    alert("Reservation successfully created!");

    // Clear form
    setPetId("");
    setDate("");
    setTime("");
    setNotes("");
    setSelectedPackage(null);
    setSelectedGroomer(null);
    localStorage.removeItem("grooming.reservationDraft");

    // Save locally
    const newBooking = { id: response.data._id, ...reservation };
    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    setShowBookings(true);
    setSelectedBooking(newBooking);

    // 🔹 Show overlay
    fetchReservation(response.data._id);

  } catch (error) {
    console.error("Error saving reservation:", error);
    alert("Failed to create reservation. Try again.");
  }
};

// REPLACE current startReschedule with this:
const startReschedule = () => {
  setRescheduleData({
    pet: overlayReservation.pet?.id || "",
    date: overlayReservation.date || "",
    time: overlayReservation.time || "",
    package: overlayReservation.package?.id || "",
    groomer: overlayReservation.groomer?.id || "",
    notes: overlayReservation.notes || ""
  });
  setIsRescheduling(true);
};

// REPLACE current handleReschedule with this:
const handleReschedule = async () => {
  try {
    // Build an updated payload that matches your schema
    const updatedPayload = {
      pet: PETS.find(p => p.id === rescheduleData.pet) || overlayReservation.pet,
      date: rescheduleData.date,
      time: rescheduleData.time,
      package: packages.find(p => p.id === rescheduleData.package) || overlayReservation.package,
      groomer: groomers.find(g => g.id === rescheduleData.groomer) || overlayReservation.groomer,
      notes: rescheduleData.notes || overlayReservation.notes,
      // keep status/createdAt etc. as-is unless you want to change them:
      status: overlayReservation.status || "Pending"
    };

    // ✅ Use the plural endpoint like your POST/GET use
    const res = await axios.put(
      `http://localhost:3001/groomingReservation/api/groomingReservations/${overlayReservation._id}`,
      updatedPayload
    );

    setOverlayReservation(res.data); // refresh overlay with updated data from backend
    setIsRescheduling(false);
    alert("Reservation updated successfully!");
  } catch (error) {
    console.error("Error updating reservation:", error);
    alert("Failed to update reservation. Try again.");
  }
};

// Add this inside GroomingReservation, but outside any other function
const handleDeleteReservation = async () => {
  if (!overlayReservation?._id) return;

  if (!window.confirm("Are you sure you want to delete this reservation?")) return;

  try {
    await axios.delete(`http://localhost:3001/groomingReservation/api/groomingReservations/${overlayReservation._id}`);
    alert("Reservation deleted successfully!");

    // Remove locally stored booking
    const updatedBookings = bookings.filter(b => b.id !== overlayReservation._id);
    saveBookings(updatedBookings);

    // Close overlay
    setShowOverlay(false);
    setSelectedBooking(null);
  } catch (error) {
    console.error("Error deleting reservation:", error);
    alert("Failed to delete reservation. Try again.");
  }
};

const handleDownloadPDF = () => {
  if (!overlayReservation) return;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Grooming Reservation Details", 20, 20);

  // Reservation info
  doc.setFontSize(12);
  doc.text(`Reservation ID: ${overlayReservation._id || "N/A"}`, 20, 40);
  doc.text(`Pet: ${overlayReservation.pet?.name || "N/A"} (${overlayReservation.pet?.species || "N/A"})`, 20, 50);
  doc.text(`Date: ${overlayReservation.date}`, 20, 60);
  doc.text(`Time: ${overlayReservation.time}`, 20, 70);
  doc.text(`Package: ${overlayReservation.package?.name || "N/A"} - ${overlayReservation.package?.price || ""}`, 20, 80);
  doc.text(`Groomer: ${overlayReservation.groomer?.name || "N/A"} (${overlayReservation.groomer?.experience || ""})`, 20, 90);
  doc.text(`Notes: ${overlayReservation.notes || "None"}`, 20, 100);
  doc.text(`Status: ${overlayReservation.status || "Pending"}`, 20, 110);

  // Save the file
  doc.save(`Reservation_${overlayReservation._id || "details"}.pdf`);
};

  const minDate = new Date().toISOString().split("T")[0];
  const isCoreValid = petId && date && time;

  //filtering & searching
  const selectedPetSpecies = petId ? (PETS.find(p => p.id === petId)?.species || "") : "";
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(packageSearch.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && pkg.price <= 2000) ||
      (priceFilter === "mid" && pkg.price > 2000 && pkg.price <= 3000) ||
      (priceFilter === "high" && pkg.price > 4000);
    const matchesSpecies = !selectedPetSpecies || !pkg.species || pkg.species.length === 0 || pkg.species.includes(selectedPetSpecies);
    return matchesSearch && matchesPrice && matchesSpecies;
  });

  const filteredGroomers = groomers.filter(gr => {
    const matchesSearch = gr.name.toLowerCase().includes(groomerSearch.toLowerCase());
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4plus" && gr.rating >= 4.0) ||
      (ratingFilter === "45plus" && gr.rating >= 4.5);
    return matchesSearch && matchesRating;
  });

  const handleOpenBookings = () => {
    loadBookings();
    setShowBookings(true);
  };

  const handleCloseBookings = () => {
    setShowBookings(false);
    setSelectedBooking(null);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setReschedDate(booking.date);
    setReschedTime(booking.time);
  };

  const handleCancelBooking = (id) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b);
    saveBookings(updated);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(updated.find(b => b.id === id));
    }
  };

  const handleSaveReschedule = (id) => {
    if (!reschedDate || !reschedTime) {
      alert("Pick a date/time to reschedule.");
      return;
    }
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, date: reschedDate, time: reschedTime, status: "Rescheduled" };
      }
      return b;
    });
    saveBookings(updated);
    const updatedBooking = updated.find(b => b.id === id);
    setSelectedBooking(updatedBooking);
    alert("Booking rescheduled.");


    

  };

  return (
    <div className="grooming_reservation_container">
      {/* HEADER */}
      <header className="grooming_reservation_header">
        <h1 className="grooming_title">Grooming Reservation</h1>
        <div className="grooming_actions">
          <button className="grooming_btn grooming_btn_secondary" onClick={handleOpenBookings}>
            My Bookings
          </button>
          <button
            className="grooming_btn grooming_btn_secondary"
            onClick={() => setShowNotifications(v => !v)}
          >
            Notifications{notifications.length ? ` (${notifications.length})` : ""}
          </button>
          <button
            className="grooming_btn grooming_btn_primary"
            onClick={() => {
              if (!isCoreValid) {
                alert("Please select Pet, Date, and Time before payment.");
              } else {
                navigate("/payment_portal");
              }
            }}
          >
            Payment
          </button>
        </div>
      </header>

      {showNotifications && (
        <div style={{ maxWidth: 600, margin: "10px auto", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 600 }}>Notifications</div>
            <div>
              <button
                className="grooming_btn grooming_btn_secondary"
                onClick={() => setNotifications([])}
              >
                Mark all as read
              </button>
            </div>
          </div>
          <div>
            {notifications.length === 0 ? (
              <div style={{ color: "#666", fontSize: 14, padding: "8px 0" }}>No new notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={`${n.id}-${n.title}`} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 14, color: "#333" }}>{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grooming_grid">
        {/* Pet & Schedule */}
        <section className="grooming_card">
          <h3 className="grooming_section_title">1) Pet &amp; Schedule</h3>
          <div className="grooming_field">
            <label className="grooming_label">Pet</label>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} className="grooming_select">
              <option value="">— Select pet —</option>
              {PETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.species}
                </option>
              ))}
            </select>
            {errors.petId && <span className="grooming_error">{errors.petId}</span>}
          </div>

          <div className="grooming_row">
            <div className="grooming_field">
              <label className="grooming_label">Date</label>
              <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="grooming_input" />
              {errors.date && <span className="grooming_error">{errors.date}</span>}
            </div>
            <div className="grooming_field">
              <label className="grooming_label">Time Slot</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="grooming_select">
                <option value="">— Select time —</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.time && <span className="grooming_error">{errors.time}</span>}
            </div>
          </div>

          <div className="grooming_field">
            <label className="grooming_label">Notes (optional)</label>
            <textarea className="grooming_textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter grooming requirenments" />
          </div>
        </section>

        {/* Package & Groomer Sections */}
        <section className="grooming_card">
          <h3 className="grooming_section_title">2) Package</h3>
          {selectedPackage ? (
            <div className="grooming_selected_box">
              <div>
                <div className="grooming_selected_title">{selectedPackage.name}</div>
                <div className="grooming_selected_meta">Duration: {selectedPackage.duration} • Price: Rs. {selectedPackage.price}</div>
              </div>
              <button className="grooming_link_btn" onClick={() => setShowPackages(true)}>Change</button>
            </div>
          ) : (
            <div className="grooming_empty_box">
              No package selected.
              <button className="grooming_link_btn" onClick={() => setShowPackages(true)}>Choose Package</button>
            </div>
          )}
        </section>

        <section className="grooming_card">
          <h3 className="grooming_section_title">3) Groomer Preference</h3>
          {selectedGroomer ? (
            <div className="grooming_selected_box">
              <div>
                <div className="grooming_selected_title">{selectedGroomer.name}</div>
                <div className="grooming_selected_meta">Rating: {selectedGroomer.rating} • Completed: {selectedGroomer.jobs}</div>
              </div>
              <button className="grooming_link_btn" onClick={() => setShowGroomers(true)}>Change</button>
            </div>
          ) : (
            <div className="grooming_empty_box">
              No groomer selected.
              <button className="grooming_link_btn" onClick={() => setShowGroomers(true)}>Select Groomer</button>
            </div>
          )}
        </section>

        {/* Summary */}
        <section className="grooming_card grooming_summary_card">
          <h3 className="grooming_section_title">Summary</h3>
          <ul className="grooming_summary_list">
            <li><span>Pet</span><strong>{petId ? PETS.find(p => p.id === petId)?.name : "—"}</strong></li>
            <li><span>Date</span><strong>{date || "—"}</strong></li>
            <li><span>Time</span><strong>{time || "—"}</strong></li>
            <li><span>Package</span><strong>{selectedPackage ? selectedPackage.name : "—"}</strong>
            {errors.package && <span className="grooming_error">{errors.package}</span>}</li>
            <li><span>Groomer</span><strong>{selectedGroomer ? selectedGroomer.name : "—"}</strong></li>
           


          </ul>
          <div className="grooming_summary_actions">
            <button className="grooming_btn grooming_btn_primary" onClick={handleReserve}>Reserve Slot</button>
          </div>
        </section>
      </div>

      {/* PACKAGE OVERLAY */}
{showPackages && (
  <div className="grooming_overlay">
    <div className="grooming_overlay_box"> {/* background box */}
      <div className="grooming_overlay_content">
        <h3>Select a Package</h3>
        <input
          type="text"
          placeholder="Search package..."
          value={packageSearch}
          onChange={(e) => setPackageSearch(e.target.value)}
          className="grooming_input"
        />
        <div className="grooming_filter_row">
          <button onClick={() => setPriceFilter("all")}>All</button>
          <button onClick={() => setPriceFilter("low")}>Low</button>
          <button onClick={() => setPriceFilter("mid")}>Mid</button>
          <button onClick={() => setPriceFilter("high")}>High</button>
        </div>
        <ul className="grooming_list">
          {filteredPackages.map((pkg) => (
            <li key={pkg.id} className="grooming_box_item">
              <div className="grooming_box_content">
                <h4>{pkg.name}</h4>
                <p>{pkg.duration}</p>
                <p>Rs. {pkg.price}</p>
              </div>
              <button
                className="grooming_btn grooming_btn_primary"
                onClick={() => {
                  setSelectedPackage(pkg);
                  localStorage.setItem("grooming.selectedPackage", JSON.stringify(pkg));
                  setShowPackages(false);
                }}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <button className="grooming_overlay_close" onClick={() => setShowPackages(false)}>Close</button>
      </div>
    </div>
  </div>
)}


      {/* GROOMER OVERLAY */}
{showGroomers && (
  <div className="grooming_overlay">
    <div className="grooming_overlay_box">   {/* background box added */}
      <div className="grooming_overlay_content">
        <h3>Select a Groomer</h3>
        <input
          type="text"
          placeholder="Search groomer..."
          value={groomerSearch}
          onChange={(e) => setGroomerSearch(e.target.value)}
          className="grooming_input"
        />
        <div className="grooming_filter_row">
          <button onClick={() => setRatingFilter("all")}>All</button>
          <button onClick={() => setRatingFilter("4plus")}>4+</button>
          <button onClick={() => setRatingFilter("45plus")}>4.5+</button>
        </div>
        <ul className="grooming_list">
          {filteredGroomers.map((gr) => (
            <li key={gr.id} className="grooming_box_item">
              <div className="grooming_box_content">
                <h4>{gr.name}</h4>
                <div className="grooming_rating">
                  {"★".repeat(Math.floor(gr.rating))}
                  {"☆".repeat(5 - Math.floor(gr.rating))}
                  <span className="rating_value">({gr.rating})</span>
                </div>
                <p>Completed Jobs: {gr.jobs}</p>
              </div>
              <button
                className="grooming_btn grooming_btn_primary"
                onClick={() => {
                  setSelectedGroomer(gr);
                  localStorage.setItem("grooming.selectedGroomer", JSON.stringify(gr));
                  setShowGroomers(false);
                }}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <button className="grooming_overlay_close" onClick={() => setShowGroomers(false)}>Close</button>
      </div>
    </div>
  </div>
)}



      {/* ===============================
    RESERVATION CONFIRMATION OVERLAY
================================ */}
{showOverlay && overlayReservation && (
  <div className="grooming_overlay">
    <div className="grooming_modal">
      <h3>Reservation Details</h3>

      {!isRescheduling ? (
        <>
          <div className="grooming_booking_details">
            <p><strong>Pet:</strong> {overlayReservation.pet?.name} ({overlayReservation.pet?.species})</p>
            <p><strong>Date:</strong> {overlayReservation.date}</p>
            <p><strong>Time:</strong> {overlayReservation.time}</p>
            <p><strong>Package:</strong> {overlayReservation.package?.name || "—"}</p>
            <p><strong>Groomer:</strong> {overlayReservation.groomer?.name || "—"}</p>
            <p><strong>Status:</strong> {overlayReservation.status}</p>
          </div>
          <div className="grooming_booking_actions">
            <button className="grooming_btn grooming_btn_primary" onClick={() => setShowOverlay(false)}>Close</button>
            <button className="grooming_btn grooming_btn_secondary" onClick={startReschedule}>Reschedule</button>
            <button className="grooming_btn cancel" onClick={handleDeleteReservation}>Delete</button>
          <div 
                className="overlay-header" 
                  style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "15px" 
                }}
>
  <h2 style={{ margin: 0 }}>Reservation Details</h2>

  <button 
    className="grooming_btn pdf" 
    onClick={handleDownloadPDF}
    style={{ marginLeft: "20px" }}
  >
    Download PDF
  </button>
</div>

          </div>
        </>
      ) : (
        <>
  <div className="grooming_reschedule_form">
    <label>Pet:</label>
    <select
      value={rescheduleData.pet}
      onChange={(e) => setRescheduleData({ ...rescheduleData, pet: e.target.value })}
    >
      <option value="">— Select pet —</option>
      {PETS.map((p) => (
        <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
      ))}
    </select>

    <label>Date:</label>
    <input
      type="date"
      value={rescheduleData.date}
      onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
      min={new Date().toISOString().split("T")[0]}
    />

    <label>Time:</label>
    <select
      value={rescheduleData.time}
      onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
    >
      <option value="">— Select time —</option>
      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>

    <label>Package:</label>
    <select
      value={rescheduleData.package}
      onChange={(e) => setRescheduleData({ ...rescheduleData, package: e.target.value })}
    >
      <option value="">— Select package —</option>
      {(() => {
        const petSp = (PETS.find(p => p.id === rescheduleData.pet)?.species) || "";
        const filtered = packages.filter(pkg => !petSp || !pkg.species || pkg.species.length === 0 || pkg.species.includes(petSp));
        return filtered.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
        ));
      })()}
    </select>

    <label>Groomer:</label>
    <select
      value={rescheduleData.groomer}
      onChange={(e) => setRescheduleData({ ...rescheduleData, groomer: e.target.value })}
    >
      <option value="">— Select groomer —</option>
      {groomers.map((g) => (
        <option key={g.id} value={g.id}>{g.name}</option>
      ))}
    </select>

    <label>Notes:</label>
    <textarea
      value={rescheduleData.notes}
      onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
      placeholder="Enter requirenmments like long hair or short hair like wise make a suitable note related to pet grooming"
    />
  </div>

  <div className="grooming_booking_actions">
    <button className="grooming_btn grooming_btn_primary" onClick={handleReschedule}>Save</button>
    <button className="grooming_btn grooming_btn_secondary" onClick={() => setIsRescheduling(false)}>Cancel</button>
  </div>
</>

      )}
    </div>
  </div>
)}


    </div>
  );
}

export default GroomingReservation;


