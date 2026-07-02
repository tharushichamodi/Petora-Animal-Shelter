import { useState } from "react";
import "./HealthVetCare.css";
import PaymentPortal from "./payment_portal";
import {
  FaDog,
  FaUserMd,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

function HealthVetCare() {
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    petBreed: "",
    petAge: "",
    petWeight: "",
    ownerName: "",
    ownerEmail: "",
    appointmentType: "",
    appointmentDate: "",
    appointmentTime: "",
    paymentOption: "",
  });

  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentPortal, setShowPaymentPortal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // ✅ Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/vetAppointment/api/vetAppointments"
      );
      const data = await res.json();

      const normalized = data
        .map((a) => ({
          id: a.appointmentID,
          pet: a.animalName || a.petName || "Unknown",
          type: a.petType || "—",
          breed: a.petBreed || "—",
          reason: a.reason || a.type || "—",
          date: a.date,
          time: a.time,
          status: a.status || "Pending",
          payment: a.paymentMethod || "N/A",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setAppointments(normalized);
      setShowAppointmentsModal(true);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setStatus("error");
      setErrorMessage("Unable to load appointments. Please try again.");
    }
  };

  // ✅ Save appointment to backend
  const saveAppointment = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/vetAppointment/api/vetAppointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             petName: formData.petName,
            petType: formData.petType,
            petBreed: formData.petBreed,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            date: formData.appointmentDate,
            time: formData.appointmentTime,
            reason: formData.appointmentType,
            paymentMethod: formData.paymentOption,
          }),
        }
      );

      if (res.ok) {
        setShowSuccessModal(true);
        setStatus("success");
        setFormData({
          petName: "",
          petType: "",
          petBreed: "",
          petAge: "",
          petWeight: "",
          ownerName: "",
          ownerEmail: "",
          appointmentType: "",
          appointmentDate: "",
          appointmentTime: "",
          paymentOption: "",
        });
        setErrorMessage("");
      } else {
        try {
          const errorData = await res.json();
          // eslint-disable-next-line no-console
          console.error("Failed to save appointment:", errorData);
          setErrorMessage(errorData.message || "Failed to save appointment.");
        } catch (parseError) {
          // eslint-disable-next-line no-console
          console.error("Failed to save appointment (invalid JSON).");
          setErrorMessage("Server returned an invalid response.");
        }
        setStatus("error");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving appointment:", error);
      setErrorMessage("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentOption) {
      setStatus("error");
      setErrorMessage("Please select a payment option.");
      return;
    }

    if (paymentDone) {
      await saveAppointment();
      return;
    }

    if (formData.paymentOption === "Pay Now") {
      setShowPaymentPortal(true);
      return;
    }

    await saveAppointment();
  };

  // ✅ Payment success
  const handlePaymentSuccess = async () => {
    setShowPaymentPortal(false);
    setPaymentDone(true);
    await saveAppointment();
  };

  return (
    <div className="vetCustomer_layout">
      <div className="vetCustomer_content_area">
        <div className="vetCustomer_header_icon">
          <FaUserMd className="vetCustomer_icon vetCustomer_icon_doctor" />
        </div>

        <h1 className="vetCustomer_title">🐾 Health & Veterinary Care</h1>
        <p className="vetCustomer_subtitle">
          Schedule and view your pet’s health appointments.
        </p>

        {/* ---------------- Booking Form ---------------- */}
        <form className="vetCustomer_form" onSubmit={handleSubmit}>
          <div className="vetCustomer_form_group">
            <label>
              <FaDog className="vetCustomer_label_icon" /> Pet Name
            </label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vetCustomer_form_group">
            <label>Pet Type</label>
            <select
              name="petType"
              value={formData.petType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="vetCustomer_form_group">
            <label>Breed</label>
            <input
              type="text"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vetCustomer_row">
            <div className="vetCustomer_form_group">
              <label>Age (years)</label>
              <input
                type="number"
                name="petAge"
                value={formData.petAge}
                onChange={handleChange}
                required
              />
            </div>
            <div className="vetCustomer_form_group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="petWeight"
                value={formData.petWeight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="vetCustomer_form_group">
            <label>
              <FaUserMd className="vetCustomer_label_icon" /> Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vetCustomer_form_group">
            <label>
              <FaEnvelope className="vetCustomer_label_icon" /> Email
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="vetCustomer_form_group">
            <label>Appointment Type</label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Checkup">Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Surgery">Surgery</option>
              <option value="Dental Care">Dental Care</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="vetCustomer_row">
            <div className="vetCustomer_form_group">
              <label>
                <FaCalendarAlt className="vetCustomer_label_icon" /> Date
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="vetCustomer_form_group">
              <label>
                <FaClock className="vetCustomer_label_icon" /> Time
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ✅ Payment Section */}
          <div className="vetCustomer_form_group">
            <label>Payment Option</label>
            <div className="vetCustomer_payment_options">
              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="Pay Now"
                  checked={formData.paymentOption === "Pay Now"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentOption: e.target.value })
                  }
                />
                💳 Pay Now
              </label>

              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="Pay at Visit"
                  checked={formData.paymentOption === "Pay at Visit"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentOption: e.target.value })
                  }
                />
                🐶 Pay at Visit
              </label>
            </div>
          </div>

          <button type="submit" className="vetCustomer_button">
            Book Appointment
          </button>

          <button
            type="button"
            onClick={fetchAppointments}
            className="vetCustomer_button secondary"
          >
            <FaClipboardList /> View All Appointments
          </button>

          {status === "error" && (
            <p className="vetCustomer_message error">
              ⚠️ {errorMessage || "Something went wrong. Please try again."}
            </p>
          )}
        </form>
      </div>

      {/* ---------------- Appointments Modal ---------------- */}
      {showAppointmentsModal && (
        <div className="vetCustomer_popup_overlay">
          <div className="vetCustomer_popup_container scrollable">
            <button
              className="vetCustomer_close_btn"
              onClick={() => setShowAppointmentsModal(false)}
            >
              ✖
            </button>
            <h2 className="vetCustomer_table_title">🐾 All Appointments</h2>

            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <ul className="vetCustomer_list">
                {appointments.map((appt) => (
                  <li key={appt.id} className="vetCustomer_appointment_card">
                    <strong>{appt.pet}</strong> ({appt.type}, {appt.breed}) <br />
                    <span>{appt.reason}</span> <br />
                    <span>
                      📅 {appt.date} 🕒 {appt.time}
                    </span>
                    <br />
                    <span>
                      Status: <b>{appt.status}</b> | Payment:{" "}
                      <b>{appt.payment}</b>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Payment Portal ---------------- */}
      {showPaymentPortal && (
        <div className="vetCustomer_popup_overlay">
          <div className="vetCustomer_popup_container">
            <button
              className="vetCustomer_close_btn"
              onClick={() => setShowPaymentPortal(false)}
            >
              ✖
            </button>
            <PaymentPortal />
            <div className="vetCustomer_popup_actions">
              <button
                className="vetCustomer_confirm_btn"
                onClick={handlePaymentSuccess}
              >
                ✅ Confirm Payment Success
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Success Modal ---------------- */}
      {showSuccessModal && (
        <div className="vetCustomer_success_modal_overlay">
          <div className="vetCustomer_success_modal">
            <h2>🎉 Appointment Confirmed!</h2>
            <p>Your appointment has been successfully booked. 🐾</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="vetCustomer_success_btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthVetCare;
