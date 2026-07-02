// HealthManagerDashboard.js
import React, { useState } from 'react';
import './css/dashboard_common.css';
import './css/veterinary_dashboard.css';
import './css/vet_treatment_scheduler.css';
import './css/health_manager_dashboard.css';

import { Profile } from './animal_manager_dashboard';
import { Header } from './animal_manager_dashboard';

// Components for Health Manager
import AssignStaff from './vet_AssignStaff.js';
import StaffAvailability from './vet_StaffAvailability.js';
import AppointmentRequests from './vet_AppointmentRequests.js';
import Reminders from './VetReminders';
import TreatmentVaccinationSchedule from './vet_treatment_scheduler';

function HealthManager_dashboard() {
  const [dashboardContent, setDashboardContent] = useState("profile");
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDashboardContentChange = (content) => {
    setDashboardContent(content);
  };

  const blured = showOverlay
    ? { opacity: '1', pointerEvents: 'auto' }
    : { opacity: '0', pointerEvents: 'none' };

  return (
    <div className="vetdashboard_container">
      <div
        style={blured}
        className="vetdash_overlay"
        onClick={() => setShowOverlay(false)}
      ></div>

      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="dashboard_content">
        {/* Sidebar */}
        <div className="sidebar_cont" style={{ marginTop: "50px" }}>
          <div className="sidebar">
            <h2 className="sidebar_logo">Petora</h2>
            <ul className="sidebar_menu">
              <li onClick={() => handleDashboardContentChange("profile")}>
                Dashboard
              </li>
              <li onClick={() => handleDashboardContentChange("Assign Staff")}>
                Assign Staff to Appointments
              </li>
              <li onClick={() => handleDashboardContentChange("Staff Availability")}>
                View Staff Availability
              </li>
              <li onClick={() => handleDashboardContentChange("Appointment Requests")}>
                Vet Appointment Requests
              </li>
              <li onClick={() => handleDashboardContentChange("Reminders")}>
                Reminders
              </li>
              <li
                onClick={() =>
                  handleDashboardContentChange("Treatment & Vaccination Schedule")
                }
              >
                Treatment & Vaccination Schedule
              </li>
            </ul>
          </div>
        </div>

        {/* Content Switching */}
        {dashboardContent === "profile" && (
          <Profile setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
        )}
        
        {dashboardContent === "Assign Staff" && (
          <AssignStaff setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
        )}
        
        {dashboardContent === "Staff Availability" && (
          <StaffAvailability
            setShowOverlay={setShowOverlay}
            showOverlay={showOverlay}
          />
        )}

       
        {dashboardContent === "Appointment Requests" && (
          <AppointmentRequests
            setShowOverlay={setShowOverlay}
            showOverlay={showOverlay}
          />
        )}

        
        {dashboardContent === "Reminders" && (
          <Reminders setShowOverlay={setShowOverlay} showOverlay={showOverlay} />
        )}
        {dashboardContent === "Treatment & Vaccination Schedule" && (
          <TreatmentVaccinationSchedule
            setShowOverlay={setShowOverlay}
            showOverlay={showOverlay}
          />
        )}
      </div>

      {/* Header */}
      <div className="DB dashboard_header_cont">
        <Header />
      </div>
    </div>
  );
}

export default HealthManager_dashboard;
