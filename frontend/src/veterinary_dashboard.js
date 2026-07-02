import React, { useState, useEffect } from 'react';
import './css/dashboard_common.css';
import './css/veterinary_dashboard.css';
import './css/vet_treatment_scheduler.css';

import {Profile} from './animal_manager_dashboard'
import {Header} from './animal_manager_dashboard'
import logopng from './images/logo.png';
import profilePic from './images/profile-pic.jpg';

// Import your components (make sure these exist)

import MedicalProfiles from './animal_medical_profile';
import TreatmentVaccinationSchedule from './vet_treatment_scheduler';
import Reminders from './VetReminders';
import Medications from './Vet_Medications';



function VetDashboard() {
  const [dashboardContent, setDashboardContent] = useState("profile");

  const handleDashboardContentChange = (content) => {
    setDashboardContent(content);
  };

  const [showOverlay, setShowOverlay] = useState(false);
  const handleOverlayChange = () => {
    setShowOverlay(prev => !prev);
  };

  const blured = showOverlay
    ? { opacity: '1', pointerEvents: 'auto' }  // clickable
    : { opacity: '0', pointerEvents: 'none' }; // hidden and not clickable

  // Scheduler State
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('vet_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    animalName: '',
    type: 'Checkup',
    date: '',
    time: ''
  });

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('vet_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...appointments];
      updated[editIndex] = formData;
      setAppointments(updated);
      setEditIndex(null);
    } else {
      setAppointments([...appointments, formData]);
    }
    setFormData({ animalName: '', type: 'Checkup', date: '', time: '' });
  };

  const handleEdit = (index) => {
    setFormData(appointments[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = appointments.filter((_, i) => i !== index);
    setAppointments(updated);
  };

  return (
    <div className="vetdashboard_container">
      <div style={blured} className='vetdash_overlay' onClick={() => setShowOverlay(false)}></div>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      <div className="dashboard_content">
        {/* Sidebar */}
        <div className="sidebar_cont" style={{ marginTop: '50px' }}>
          <div className='sidebar'>
            <h2 className="sidebar_logo">Petora</h2>
            <ul className="sidebar_menu">
              <li onClick={() => handleDashboardContentChange("profile")}>Dashboard</li>
              <li onClick={() => handleDashboardContentChange("Medical Profiles")}>Medical Profiles</li>
              <li onClick={() => handleDashboardContentChange("Treatment & Vaccination Schedule")}>Treatment & Vaccination Schedule</li>
              <li onClick={() => handleDashboardContentChange("Reminders")}>Reminders</li>
              <li onClick={() => handleDashboardContentChange("Medications")}>Medications</li>
       
           
            </ul>
          </div>
        </div>

        

        
        {dashboardContent === "profile" && (
            <profile setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
          )}
          {dashboardContent === "Medical Profiles" && (
            <MedicalProfiles setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
          )}
          {dashboardContent === "Treatment & Vaccination Schedule" && (
            <TreatmentVaccinationSchedule
              setShowOverlay={setShowOverlay}
              showOverlay={showOverlay}
              appointments={appointments}
              handleSubmit={handleSubmit}
              formData={formData}
              handleChange={handleChange}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              editIndex={editIndex}
            />
          )}
          {dashboardContent === "Reminders" && (
            <Reminders setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
          )}
          {dashboardContent === "Medications" && (
            <Medications setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
          )}
          
          {dashboardContent === "profile" && (
            <Profile setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
          )}
    
    
  
      </div>
      
      {/* Header */}
        <div className='DB dashboard_header_cont'>
          <Header/>
        </div>
    </div>
  );
}

export default VetDashboard;




