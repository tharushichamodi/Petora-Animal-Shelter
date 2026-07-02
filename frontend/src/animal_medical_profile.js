import { useState, useEffect } from "react";
import {
  FaUserMd,
  FaWeight,
  FaNotesMedical,
  FaSyringe,
  FaCat,
  FaClipboardList,
  FaPaw,
} from "react-icons/fa";
import "./css/animal_medical_profile.css";

const initialFormData = {
  name: "",
  species: "",
  breed: "",
  gender: "",
  age: "",
  weight: "",
  allergies: "",
  vaccinationStatus: "Up to date",
  bloodType: "",
  lastVisit: "",
  nextCheckup: "",
  vetInCharge: "",
  notes: "",
  status: "Healthy",
  adoptionStatus: "Not Ready", 
  photo: "",
  animalId: null,
};

function Vet_Medical_Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [staffList, setStaffList] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/vetAnimalMedical_profile/api/vetAnimalMedical_profiles"
        );
        const data = await res.json();
        if (Array.isArray(data)) setProfiles(data);
      } catch (err) {
        showToast(err.message, "error");
      }
    };
    fetchData();
  }, []);

 //load available staff 
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:3001/vetStaff/api/vetStaffs");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setStaffList(data.data.filter((s) => s.available));
        }
      } catch (err) {
        console.error("Error loading staff:", err);
      }
    };
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
          setFormData({ ...formData, photo: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPhotoPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/vetAnimalMedical_profile/api/vetAnimalMedical_profiles/${editingId}`
      : "http://localhost:3001/vetAnimalMedical_profile/api/vetAnimalMedical_profiles";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (editingId)
        setProfiles(profiles.map((p) => (p._id === editingId ? data : p)));
      else setProfiles([...profiles, data]);
      showToast(editingId ? "✅ Profile updated!" : "✅ Profile added!");
      resetForm();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEdit = (id) => {
    const profile = profiles.find((p) => p._id === id);
    if (profile) {
      setFormData(profile);
      setPhotoPreview(profile.photo);
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(
        `http://localhost:3001/vetAnimalMedical_profile/api/vetAnimalMedical_profiles/${id}`,
        { method: "DELETE" }
      );
      setProfiles(profiles.filter((p) => p._id !== id));
      showToast("🗑️ Profile deleted!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speciesOptions = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish"];
  const bloodTypeOptions = [
    "DEA 1.1+",
    "DEA 1.1-",
    "DEA 4",
    "Feline A",
    "Feline B",
    "Feline AB",
    "Unknown",
  ];
  const adoptionStatusOptions = [
    "Not Ready",
    "Ready for Adoption",
    "Under Treatment",
  ]; 

  return (
    <div className="vet_med_main_container">
      {toast.message && (
        <div className={`vet_med_toast vet_med_toast_${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="vet_med_dashboard">
        <div className="vet_med_content_wrapper">
          <h1 className="vet_med_title">
            <FaPaw /> Veterinary Medical Profiles
          </h1>

          <input
            type="text"
            placeholder="🔍 Search by name, species, or breed..."
            className="vet_med_search_bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Profile Form */}
          <form className="vet_med_profile_form enhanced" onSubmit={handleSubmit}>
            <label>
              Animal Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Species
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
              >
                <option value="">Select Species</option>
                {speciesOptions.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Breed
              <input name="breed" value={formData.breed} onChange={handleChange} />
            </label>

            <label>
              Gender
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male ♂</option>
                <option value="Female">Female ♀</option>
              </select>
            </label>

            <label>
              Age (Years)
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>

            <label>
              Weight (kg)
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </label>

            <label>
              Vaccination Status
              <select
                name="vaccinationStatus"
                value={formData.vaccinationStatus}
                onChange={handleChange}
              >
                <option value="Up to date">Up to date</option>
                <option value="Pending">Pending</option>
                <option value="Not vaccinated">Not vaccinated</option>
              </select>
            </label>

            <label>
              Blood Type
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Select Blood Type</option>
                {bloodTypeOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Vet in Charge
              <select
                name="vetInCharge"
                value={formData.vetInCharge}
                onChange={handleChange}
              >
                <option value="">Select Vet</option>
                {staffList.map((vet) => (
                  <option key={vet._id} value={vet.name}>
                    {vet.name} ({vet.specialization})
                  </option>
                ))}
              </select>
            </label>

            {/* Adoption Status */}
            <label>
              Adoption Status
              <select
                name="adoptionStatus"
                value={formData.adoptionStatus}
                onChange={handleChange}
              >
                {adoptionStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="full-width">
              Notes
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </label>

            <label>
              Upload Photo
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
            </label>

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="vet_med_photo_preview"
              />
            )}

            <div className="form-buttons">
              <button type="submit" className="vet_med_btn_submit">
                {editingId ? "Update Profile" : "Add Profile"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="vet_med_btn_cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Profile List */}
          <div className="vet_med_profile_list">
            <h2 className="vet_med_section_title">
              <FaClipboardList /> Animal Medical Records
            </h2>
            {filteredProfiles.length === 0 ? (
              <p className="vet_med_empty">No profiles found.</p>
            ) : (
              filteredProfiles.map((p) => (
                <div key={p._id} className="vet_med_profile_card">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="vet_med_card_img"
                    />
                  ) : (
                    <div className="vet_med_card_placeholder">
                      <FaCat size={50} color="#9ca3af" />
                    </div>
                  )}
                  <h3>{p.name}</h3>
                  <p>
                    <strong>Species:</strong> {p.species}
                  </p>
                  <p>
                    <strong>Breed:</strong> {p.breed}
                  </p>
                  <p>
                    <strong>Gender:</strong> {p.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Adoption:</strong> {p.adoptionStatus || "N/A"}
                  </p>
                  <p>
                    <strong>Vet:</strong> {p.vetInCharge || "Unassigned"}
                  </p>
                  <div className="vet_med_actions">
                    <button onClick={() => handleEdit(p._id)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vet_Medical_Profiles;
