import React, { useState, useEffect } from "react";
import "./css/staff_availability.css";

function StaffAvailability() {
  const API_URL = "http://localhost:3001/vetStaff/api/vetStaffs";

  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    specialization: "Veterinary Surgeon",
    summary: "",
    available: true,
    workload: 0,
    maxWorkload: 5,
    photo: "",
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setStaffList(data.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddForm = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      specialization: "Veterinary Surgeon",
      summary: "",
      available: true,
      workload: 0,
      maxWorkload: 5,
      photo: "",
    });
    setFormOpen(true);
  };

  const openEditForm = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      specialization: staff.specialization,
      summary: staff.summary,
      available: staff.available,
      workload: staff.workload,
      maxWorkload: staff.maxWorkload,
      photo: staff.photo || "",
    });
    setFormOpen(true);
  };

  const onFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Compress & resize image before saving as Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData((prev) => ({ ...prev, photo: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  //  Save / Update staff
  const saveStaff = async (e) => {
    e.preventDefault();

    let photoToSave = formData.photo;
    if (editingStaff && !formData.photo.startsWith("data:image")) {
      photoToSave = editingStaff.photo;
    }

    const payload = { ...formData, photo: photoToSave };

    const url = editingStaff ? `${API_URL}/${editingStaff._id}` : API_URL;
    const method = editingStaff ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(editingStaff ? "✅ Staff updated!" : "✅ Staff added!");
        setFormOpen(false);
        fetchStaff();
        setTimeout(() => setSuccessMessage(""), 2500);
      } else {
        alert("Error saving staff: " + data.error);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  //  Delete staff
  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff profile?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchStaff();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      (filter === "All" || s.specialization === filter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="HM_staffavail_container">
      <h2 className="HM_staffavail_title">Staff Availability</h2>
      {successMessage && <div className="HM_success_popup">{successMessage}</div>}

      {/* Filters */}
      <div className="HM_staff_filters">
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Specializations</option>
           <option value="Veterinary Surgeon">Veterinary Surgeon</option>
              <option value="Animal Nutritionist">Animal Nutritionist</option>
              <option value="Vaccination Specialist">Vaccination Specialist</option>
              <option value="Surgery Specialist">Surgery Specialist</option>
        </select>
        <button onClick={openAddForm} className="HM_add_btn">
          + Add Staff
        </button>
      </div>

      {/*  Staff Sections */}
      <div className="HM_staff_sections">
        {/* Available */}
        <div className="HM_staff_column available">
          <h3 className="HM_section_title available-title sticky-header">
            Available Staff
          </h3>
          <div className="HM_staff_cards">
            {filteredStaff.filter((s) => s.available).length ? (
              filteredStaff
                .filter((s) => s.available)
                .map((staff) => (
                  <div key={staff._id} className="HM_staff_card available">
                    {staff.photo ? (
                      <img
                        src={staff.photo}
                        alt={staff.name}
                        className="HM_staff_photo"
                      />
                    ) : (
                      <div className="HM_staff_photo HM_photo_placeholder">
                        No Photo
                      </div>
                    )}
                    <div className="HM_staff_details">
                      <h4>{staff.name}</h4>
                      <p>{staff.specialization}</p>
                      <p>{staff.summary}</p>
                      <div className="HM_card_actions">
                        <button onClick={() => openEditForm(staff)}>Edit</button>
                        <button
                          className="danger"
                          onClick={() => deleteStaff(staff._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="HM_empty_state">No available staff found.</p>
            )}
          </div>
        </div>

        {/* Unavailable */}
        <div className="HM_staff_column unavailable">
          <h3 className="HM_section_title unavailable-title sticky-header">
            Unavailable Staff
          </h3>
          <div className="HM_staff_cards">
            {filteredStaff.filter((s) => !s.available).length ? (
              filteredStaff
                .filter((s) => !s.available)
                .map((staff) => (
                  <div key={staff._id} className="HM_staff_card unavailable">
                    {staff.photo ? (
                      <img
                        src={staff.photo}
                        alt={staff.name}
                        className="HM_staff_photo"
                      />
                    ) : (
                      <div className="HM_staff_photo HM_photo_placeholder">
                        No Photo
                      </div>
                    )}
                    <div className="HM_staff_details">
                      <h4>{staff.name}</h4>
                      <p>{staff.specialization}</p>
                      <p>{staff.summary}</p>
                      <div className="HM_card_actions">
                        <button onClick={() => openEditForm(staff)}>Edit</button>
                        <button
                          className="danger"
                          onClick={() => deleteStaff(staff._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="HM_empty_state">No unavailable staff found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="HM_popup_overlay" onClick={() => setFormOpen(false)}>
          <div className="HM_popup_card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStaff ? "Edit Staff" : "Add Staff"}</h3>
            <form onSubmit={saveStaff}>
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={onFormChange}
                required
              />

              <label>Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={onFormChange}
              >
              <option value="Veterinary Surgeon">Veterinary Surgeon</option>
              <option value="Animal Nutritionist">Animal Nutritionist</option>
              <option value="Vaccination Specialist">Vaccination Specialist</option>
              <option value="Surgery Specialist">Surgery Specialist</option>

              </select>

              <label>Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={onFormChange}
                rows={3}
              />

              <label>
                Available
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={onFormChange}
                />
              </label>

              <label>Photo</label>
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="HM_preview_img"
                />
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />

              <div className="HM_form_actions">
                <button type="button" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editingStaff ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAvailability;
