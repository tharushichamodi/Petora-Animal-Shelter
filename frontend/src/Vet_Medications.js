import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "./css/Vet_Medications.css";

const BACKEND_URL = "http://localhost:3001/vetMedication/api/vetMedications";

// ✅ Export to PDF only
const exportToPDF = (medications) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Veterinary Medication Schedule", 105, 15, { align: "center" });

  const headers = ["Pet Name", "Medication", "Dosage", "Date", "Time", "Notes", "Status"];
  const rows = medications.map((m) => [
    m.petName,
    m.medication,
    m.dosage,
    m.date,
    m.time,
    m.notes || "-",
    m.given ? "Given" : "Not Given",
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [203, 132, 66] }, // gold header
  });

  doc.save("Vet_Medications.pdf");
};

export default function VetMedications() {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({
    petName: "",
    medication: "",
    dosage: "",
    date: "",
    time: "",
    notes: "",
    given: false,
  });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const res = await axios.get(BACKEND_URL);
      setMedications(res.data);
    } catch (err) {
      console.error("Error fetching medications:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMed({ ...newMed, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    if (!newMed.petName || !newMed.medication || !newMed.dosage || !newMed.date || !newMed.time) {
      return "Please fill all required fields.";
    }
    if (isNaN(parseFloat(newMed.dosage))) return "Dosage must be a valid number.";
    const dt = new Date(`${newMed.date}T${newMed.time}`);
    if (dt < new Date()) return "Date and time cannot be in the past.";
    return null;
  };

  const handleAddOrUpdate = async () => {
    const error = validateForm();
    if (error) {
      setPopupMessage(error);
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    try {
      if (editId) {
        const res = await axios.put(`${BACKEND_URL}/${editId}`, newMed);
        setMedications((prev) => prev.map((m) => (m._id === editId ? res.data : m)));
        setPopupMessage("✅ Medication updated successfully!");
      } else {
        const res = await axios.post(BACKEND_URL, newMed);
        setMedications([res.data, ...medications]);
        setPopupMessage("✅ Medication added successfully!");
      }
      setPopupType("success");
      setShowPopup(true);
      setEditId(null);
      setNewMed({
        petName: "",
        medication: "",
        dosage: "",
        date: "",
        time: "",
        notes: "",
        given: false,
      });
    } catch (err) {
      setPopupMessage("Failed to save medication.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleEdit = (m) => {
    setNewMed(m);
    setEditId(m._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setMedications((prev) => prev.filter((m) => m._id !== id));
      setPopupMessage("🗑️ Deleted successfully!");
      setPopupType("success");
      setShowPopup(true);
    } catch {
      setPopupMessage("Error deleting medication.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const filteredMedications = medications
    .filter((m) => {
      if (filter === "given" && !m.given) return false;
      if (filter === "notGiven" && m.given) return false;
      if (!m.petName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const getStatusClass = (m) => {
    if (m.given) return "status-given";
    const dt = new Date(`${m.date}T${m.time}`);
    return dt < new Date() ? "status-overdue" : "status-upcoming";
  };

  return (
    <div className="vet_medications_container">
      <h2 className="vet_medications_title">💊 Vet Medication Tracker</h2>

      <input
        type="text"
        placeholder="🔍 Search by Pet Name..."
        className="vet_medications_search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Popup */}
      {showPopup && (
        <div className={`popup_overlay ${popupType}`}>
          <div className={`popup_box ${popupType}`}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="vet_medications_form">
        <div className="form_grid">
          <input name="petName" placeholder="Pet Name *" value={newMed.petName} onChange={handleInputChange} />
          <input name="medication" placeholder="Medication Name *" value={newMed.medication} onChange={handleInputChange} />
          <input name="dosage" placeholder="Dosage (mg/ml) *" value={newMed.dosage} onChange={handleInputChange} />
          <input type="date" name="date" value={newMed.date} onChange={handleInputChange} />
          <input type="time" name="time" value={newMed.time} onChange={handleInputChange} />
          <label className="vet_medications_checkbox">
            <input type="checkbox" name="given" checked={newMed.given} onChange={handleInputChange} /> Mark as Given
          </label>
        </div>
        <textarea name="notes" placeholder="Notes (optional)" value={newMed.notes} onChange={handleInputChange}></textarea>
        <button onClick={handleAddOrUpdate} className="vet_btn_primary">
          {editId ? <><FaEdit /> Update</> : <><FaPlus /> Add</>}
        </button>
      </div>

      {/* Filters + Export */}
      <div className="vet_medications_toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="given">✅ Given</option>
          <option value="notGiven">❌ Not Given</option>
        </select>
        <button onClick={() => exportToPDF(filteredMedications)} className="vet_btn_pdf">
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* List */}
      <div className="vet_medications_list">
        {filteredMedications.length === 0 && <p>No medications found.</p>}
        {filteredMedications.map((m) => (
          <div key={m._id} className={`vet_card ${getStatusClass(m)}`}>
            <div className="vet_card_top">
              <strong>{m.petName}</strong>
              <span className={`status_tag ${getStatusClass(m)}`}>{m.given ? "Given" : "Pending"}</span>
            </div>
            <p>{m.medication} — {m.dosage}</p>
            <p>{m.date} • {m.time}</p>
            {m.notes && <p className="vet_notes">📝 {m.notes}</p>}
            <div className="vet_card_actions">
              <button onClick={() => handleEdit(m)} className="btn_edit"><FaEdit /> Edit</button>
              <button onClick={() => handleDelete(m._id)} className="btn_delete"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
