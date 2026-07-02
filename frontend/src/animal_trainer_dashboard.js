
import React, { useState } from "react";
import './css/animal_trainer_dashboard.css';

export default function TrainingSessions() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ id: null, animal: "", type: "", date: "" });

  // handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // add new or update existing session
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.animal || !form.type || !form.date) return;

    if (form.id === null) {
      // new session
      const newSession = { ...form, id: Date.now() };
      setSessions([...sessions, newSession]);
    } else {
      // update existing
      setSessions(
        sessions.map((s) => (s.id === form.id ? form : s))
      );
    }
    setForm({ id: null, animal: "", type: "", date: "" });
  };


  const handleEdit = (session) => {
    setForm(session);
  };

  // delete session
  const handleDelete = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div className="container">
      <h1>Training Session Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="animal"
          placeholder="Animal Name"
          value={form.animal}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Session Type (Obedience, Agility, etc.)"
          value={form.type}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <button type="submit">
          {form.id === null ? "Add Session" : "Update Session"}
        </button>
      </form>

      <table className="session-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Session Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 ? (
            <tr>
              <td colSpan="4">No sessions yet</td>
            </tr>
          ) : (
            sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.animal}</td>
                <td>{s.type}</td>
                <td>{s.date}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
