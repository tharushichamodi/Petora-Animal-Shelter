import React, {react, useRef, useEffect, useState, use}from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsThreeDotsVertical, BsSearch } from 'react-icons/bs';
import Axios from 'axios';


import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './css/animal_manager_dashboard.css';
import './css/employee_profile.css';
import './css/rescue_teams.css'
import './css/dashboard_common.css'

import {RescuedAnimalList} from './rescued_Animals';

import logopng from './images/logo.png'
import notification from './images/notification.png'

import operationImg from './images/ambulance.png'
import alertImg from "./images/alert.png"
import cageTrackerImg from './images/padlock.png'
import privacy from './images/shiled.png'
import teamImg from './images/rescueTeamLogo.png'

import teamAlfa from './images/team_alfa.png'
import teamBravo from "./images/teamBravo.png";
import teamCharlie from "./images/teamCharlie.png";
import teamDelta from "./images/teamDelta.png";
import teamEcho from "./images/teamEcho.png";
import profilePic from './images/profilePic.jpg'

import member1 from './images/rescueMem1.jpg';
import member2 from './images/rescueMem2.jpg';
import member3 from './images/rescueMem3.jpg';
import member4 from './images/rescueMem4.jpg';
import member5 from './images/rescueMem5.jpg';
import member6 from './images/rescueMem6.jpg';


import catImg4 from './images/cat4.jpg'; // Import an image for the rescued animals
import dogImg2 from './images/dog2.jpg'; // Import another image for the rescued animals
import puppyImg from './images/puppy.jpg'; // Import another image for the rescued animals
import rabbitImg from './images/rabbit1.jpg';
import birdImg from './images/bird1.jpg';
import catImg3 from './images/cat3.jpg';
import hamsterImg from './images/hamster1.jpg';
import fishImg from './images/fish1.jpg';
import dogImg3 from './images/dog3.jpg';
import guineaPigImg from './images/guineaPig1.jpg';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';


function AnimalManagerDashboard() {
  
  //swich dashboard content
  const [dashboardContent, setDashboardContent] = useState ("Profile")
  const[selectedSection, setSelectedSection] = useState ("Profile")

  const handleDashboardContentChange = (content) =>{
    setDashboardContent(content)
    setSelectedSection(content)
  }

//handle overlay
const[showOverlay, setShowOverlay] = useState(false)
const handleOverlayChange = () => {
  setShowOverlay(prev => !prev);
};


  // handle selected menu section

  return (
    <div className="dashboard_container" >
      <div className={`overlay ${showOverlay ? "visible" : ""}`} onClick={() => setShowOverlay(false)}></div>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>
      <link  rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
      <div className="dashboard_content" >
        <div className="sidebar_cont" style={{marginTop:'50px'}}>
            <div className='sidebar'>
              <h2 className="sidebar_logo">Petora</h2>
              <ul className="sidebar_menu">
                <li onClick={() => handleDashboardContentChange("Profile")} className={selectedSection === "Profile" ? "selected" : ""}>Dashboard</li>
                <li onClick={() => handleDashboardContentChange("Rescue Logs")} className={selectedSection === "Rescue Logs" ? "selected" : ""}>Rescue Logs</li>
                <li onClick={() => handleDashboardContentChange("Rescue Teams")} className={selectedSection === "Rescue Teams" ? "selected" : ""}>Rescue Teams</li>
                <li onClick={() => handleDashboardContentChange("Animal Profiles")} className={selectedSection === "Animal Profiles" ? "selected" : ""}>Animal Profiles</li>
                <li onClick={() => handleDashboardContentChange("Analytics")} className={selectedSection === "Analytics" ? "selected" : ""}>Analytics</li>
                <li onClick={() => handleDashboardContentChange("Cage Tracker")} className={selectedSection === "Cage Tracker" ? "selected" : ""}>Cage Tracker</li>
              </ul>
            </div>
          
        </div>
        <div className='DB dashboard_header_cont'>
          <Header/>
        </div>
        
        {dashboardContent == "Rescue Logs" && (
          <RescueLogs setShowOverlay={setShowOverlay} showOverlay = {showOverlay}  />
        )}
        
        
        {dashboardContent == "Profile" && (
          <Profile setShowOverlay={setShowOverlay} showOverlay = {showOverlay}  style={{marginTop:'100px'}} />
        )}
        
        {dashboardContent == "Rescue Teams" && (
          <RescueTeams setShowOverlay={setShowOverlay} showOverlay = {showOverlay} style={{marginTop:'100px'}}/>
        )}
        
        
          {dashboardContent == "Animal Profiles" && (
            <div style={{marginTop:'100px', marginLeft:'20vw', position:'relative'}}>
              <AnimalProfiles setShowOverlay={setShowOverlay} showOverlay = {showOverlay} />
            </div>

        )}
        
        
      </div>
    </div>
  );
}

export default AnimalManagerDashboard;

// header
export function Header(){
  const [notifications, setNotifications] = useState([
  {
    notificationID: 1,
    type: "operation",
    msg: "Rescue operation #123 successfully completed.",
    time: "2025-08-30T09:15:00Z",
    read: true
  },
  {
    notificationID: 2,
    type: "alert",
    msg: "Emergency: A new rescue call has been received from Sector 4.",
    time: "2025-08-30T09:20:00Z",
    read: false
  },
  {
    notificationID: 3,
    type: "privacy",
    msg: "Privacy policy update: Data handling policy has been revised.",
    time: "2025-08-30T09:30:00Z",
    read: true
  },
  {
    notificationID: 4,
    type: "team",
    msg: "Rescue Team Alpha has been deployed to the new alert location.",
    time: "2025-08-30T09:50:00Z",
    read: true
  },
  {
    notificationID: 5,
    type: "cageTracker",
    msg: "Cage #5's status has been changed to 'occupied'.",
    time: "2025-08-30T10:05:00Z",
    read: false
  },
  {
    notificationID: 6,
    type: "alert",
    msg: "Reminder: Scheduled check-up for 'Max' is due tomorrow.",
    time: "2025-08-30T10:10:00Z",
    read: true
  }


  
]);
const unreadCount = notifications.filter(notification => !notification.read).length;

  const calculateNotificationLifetime = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - notificationTime) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30.44); // Average days in a month
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365.25); // Average days in a year
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
// select notofi image
const notificationImages = {
  "operation": operationImg,
  "alert": alertImg,
  "team": teamImg,
  "cageTracker": cageTrackerImg,
  "privacy":privacy
};

const handleNotifiBG = (read) =>{
  const notifiStyle = read
  ? {}
  : {backgroundColor:'rgb(255, 243, 228)'}

 return notifiStyle
}

const [clickedNotification, setClickedNotification] = useState(null);

const isClicked = (notification) => clickedNotification === notification.notificationID;

const handleNotifyClick = (notif) => {
  setNotifications(prev =>
    prev.map(n =>
      n.notificationID === notif.notificationID ? { ...n, read: true } : n
    )
  );
  setClickedNotification(notif.notificationID); // ✅ mark clicked
};

//show notify panel
  const notifiPanelRef = useRef(null);
  const [notifiPanelStatus, setNotifiPanelStatus] = useState(false);

const handleNotofyPanelVisibility = () => {
    setNotifiPanelStatus(prevStatus => !prevStatus);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifiPanelRef.current && !notifiPanelRef.current.contains(event.target)) {
        setNotifiPanelStatus(false);
      }
    };

    if (notifiPanelStatus) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifiPanelStatus]);


  return(
          <div className='DB DB_header'>
            <div className="logo">
              <img src={logopng} alt="Petora" />
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
              <div className='DB notification_cont'>
                <img className='DB notification_icon' src={notification} onClick={handleNotofyPanelVisibility}></img>
                <div className={`notifi_panal ${notifiPanelStatus ? "visible" : ""}`}>
                  <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'10px'}}>
                    {/* <img style={{width:'12px', height:'auto', marginRight:'5px'}} src={notification}></img> */}
                    <span>Notifications</span><span  style={{marginLeft:'5px'}}>({unreadCount})</span>
                  </div>
                  <div className="notification_list" >
                  {notifications.map((notification, index) => (
                    <div  key={notification.notificationID} 
                          style={{
                            ...handleNotifiBG(notification.read),
                            backgroundColor: isClicked(notification) ? 'white' : handleNotifiBG(notification.read).backgroundColor
                          }}
                          onClick = {() => handleNotifyClick(notification)}>
                      <div className='DB hr'></div>
                      <div style={{display:'flex', alignItems:'center', padding:'10px'}} key={index} className="notification_item">                    
                        <div className='notif_img_cont'  ><img className='notifiImg' src={notificationImages[notification.type]} alt={`${notification.type} icon`} /></div>
                        <div style={{marginLeft:'10px'}}>
                          <div style={{fontSize:'14px',}} className="notification_message">{notification.msg}</div>
                          <div style={{fontSize:'12px', color:'gray'}} className="notification_time">
                          {calculateNotificationLifetime(notification.time)}
                          </div>
                        </div>                    
                        
                      </div>
                      
                    </div>
                    
                  ))}
                  
                </div>
                </div>
                
              </div>
              
              <div className='DB profile_img_cont'>
                <img className='DB profile_img' src={profilePic}></img>
              </div>
            </div>
           
            
          </div>
  )
}


//rescue logs
function RescueLogs({ setShowOverlay, showOverlay }) {
  const [speciesCounts, setSpeciesCounts] = useState({});
  const [showOpsForm, setShowOpsForm] = useState(false);
  const [showOpsCont, setShowOpsCont] = useState(false);

  // --- Fetch aggregated data from backend ---
  useEffect(() => {
    Axios.get("http://localhost:3001/rescueOp/api/rescueOps/stats/species")
      .then((res) => {
        // Convert array of {_id, count} to object {Dog: 50, Cat: 30...}
        const dataObj = {};
        res.data.forEach(item => {
          dataObj[item._id] = item.count;
        });
        setSpeciesCounts(dataObj);
      })
      .catch(err => console.error("Error fetching species stats:", err));
  }, []);

  // Build chart datasets dynamically
  const labels = Object.keys(speciesCounts);
  const values = Object.values(speciesCounts);

  const chartColors = ['#A0522D', '#8B4513', '#DEB887', '#D2B48C'];

  const barData = {
    labels,
    datasets: [
      {
        label: '% of Rescued Pets',
        data: values,
        backgroundColor: chartColors.slice(0, labels.length),
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors.slice(0, labels.length),
      },
    ],
  };

  const handleAddOperationClick = () => {
    if (!showOpsForm && !showOverlay) {
      setShowOpsForm(true);
      setShowOverlay(true);
    } else {
      setShowOpsForm(false);
      setShowOverlay(false);
    }
  };

  const handleshowAllOPerations = () => {
    if (!showOpsCont && !showOverlay) {
      setShowOpsCont(true);
      setShowOverlay(true);
    } else {
      setShowOpsCont(false);
      setShowOverlay(false);
    }
  };

  return (
    <div className="AMD_main_content" style={{ marginTop: "100px" }}>
      <div className="AMD_header">
        <h1>Welcome, Animal Manager</h1>
      </div>

      <div className="AMD_rescue_section">
        <h2>Recent Rescue Operations</h2>
        <div className="AMD_add_opp_cont">
          <button className="AMD_add_opp_btn" onClick={handleAddOperationClick}>
            <i className="fa-solid fa-plus" style={{ marginRight: "10px" }}></i>
            Add Operation
          </button>
        </div>
        <OpsTable main={true} />
        <div className="AMD_view_all_cont">
          <button className="AMD_view_all_btn" onClick={handleshowAllOPerations}>
            View All
          </button>
        </div>
      </div>

      <div className="AMD_graphs_section">
        <div className="AMD_bar_chart">
          <h3>Rescued Pets by Type</h3>
          <Bar data={barData} />
        </div>
        <div className="AMD_pie_chart">
          <h3>Pet Type Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {showOpsForm && (
        <div className={`new_ops ${showOpsForm ? "visible" : ""}`} onClick={handleAddOperationClick}>
          <NewOperation onClose={() => { setShowOpsForm(false); setShowOverlay(false); }} />
        </div>
      )}

      {showOpsCont && (
        <div className={`AllOps ${showOpsCont ? "visible" : ""}`} onClick={handleshowAllOPerations}>
          <AllRescueOPerations onClose={() => { setShowOpsCont(false); setShowOverlay(false); }} />
        </div>
      )}
    </div>
  );
}

// new operation
function NewOperation({ onClose }){
  //handle show teams
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleCardClick = (team) => {
  setSelectedTeam(team); // store selected index in state
  setShowTeamForm(false);  // optionally close the team selection
  console.log("Selected team index:", team.rescueTeamID);
};
useEffect(() => {
  setOperationData((prev) => ({
    ...prev,
    assignedTeam: selectedTeam ? selectedTeam.rescueTeamID : 0,
  }));
}, [selectedTeam]);

//handle uploaded file list
const [uploadedFiles, setUploadedFiles] = useState([]);


  const removeFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  //handle operation data
  
const [operationData, setOperationData] = useState({
  animalType: "",
  location: "",
  priorityLevel: "",
  assignedTeam: 0,
  teamNotes: "",
  animalBehaviour: "",
  remarks: "",
  images: [], // will store File objects
});
useEffect(() => {
  console.log("Operation Data Updated:", operationData);
}, [operationData]);
const handleInputTextChange = (e) => {
  const { name, value } = e.target;
  setOperationData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setOperationData((prev) => ({
    ...prev,
    photos: files,
  }));
  setUploadedFiles(files); // for display
};
// handle form submisssion



const handleAddNewRescueOperationSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("animalType", operationData.animalType);
  formData.append("location", operationData.location);
  formData.append("priorityLevel", operationData.priorityLevel);
  formData.append("assignedTeam", operationData.assignedTeam);
  formData.append("teamNotes", operationData.teamNotes);
  formData.append("animalBehaviour", operationData.animalBehaviour);
  formData.append("remarks", operationData.remarks);

  // Append all images
  operationData.images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await Axios.post(
      "http://localhost:3001/rescueOp/api/rescueOps", // your backend endpoint
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Operation added:", response.data);
    onClose(); // close the form
  } catch (error) {
    console.error("Error adding operation:", error);
    alert("Failed to add rescue operation");
  }

    const formData2 = new FormData();
  
  formData2.append("availability", "false");

  try{
    const response = await Axios.put(
      `http://localhost:3001/rescueTeam/api/rescueTeams/${operationData.assignedTeam}`,
      formData2,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Team updated:", response.data);
  } catch (error) {
    console.error("Error updating team:", error);
    alert("Failed to update rescue team");
  }
};

const [leaderNames, setLeaderNames] = useState({});
const [rescueTeams, setRescueTeams] = useState([]);

useEffect(() => {
    // 1. load all teams
    Axios.get("http://localhost:3001/rescueTeam/api/rescueTeams").then(res => {
      setRescueTeams(res.data);

      // 2. fetch all leaders in parallel once
      const ids = res.data.map(t => t.leaderID);
      // Fetch all employees once
      Axios.get("http://localhost:3001/employee/api/employees")
        .then(empRes => {
          const employees = empRes.data; // all employees

          // Map leader IDs to names
          const nameMap = {};
          res.data.forEach(t => {
            const leader = employees.find(emp => emp.empID === t.leaderID);
            if (leader) {
              nameMap[t.leaderID] = `${leader.firstName} ${leader.LastName}`;
            }
          });

          setLeaderNames(nameMap);
        })
        .catch(err => console.error("Error fetching employees:", err));
    });
  }, []);
  return(    
      <div className='new_ops_form' onClick={(e) => e.stopPropagation()}>
        <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
          <button type='button' className='form_close_button' onClick={onClose}><i className='fa-solid fa-close'></i></button>
        </div>
        <div><h1 style={{textAlign:'center'}}>New Rescue Operation</h1></div> 
        <div className="AMD form_group">
          <label htmlFor="RO_pet_type">Type / Species</label>
          <select className='selection' id="RO_pet_type" name="animalType" onChange={handleInputTextChange}>
            <option value="">Select</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="AMD form_group">
          <label htmlFor="RO_location">Location</label>
          <input className='RO_input' type="text" id="RO_location" name="location" onChange={handleInputTextChange} />
        </div>

        <div className="AMD form_group">
          <label htmlFor="RO_priority">Priority Level</label>
          <select className='selection' id="RO_priority" name="priorityLevel" onChange={handleInputTextChange}>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {/* Team Assignment */}
        <div className="form_section RO_team_info">
          <div><h3 style={{textAlign:'left'}} className="section_title">Team Assignment</h3></div>        
          
            <div className="AMD form_group">
              <label htmlFor="RO_assigned_team">Assigned Rescue Team</label>
              <button type='button' className='select_team_btn' onClick={() => setShowTeamForm(true)}>{selectedTeam !== null ? selectedTeam.name : "Select a Team"}</button>
              {selectedTeam !== null && (
                <div className='selected_team_card'  onClick={() => setShowTeamForm(true)} >
                  <div className='team_image_cont'>
                    <img 
                      className='team_img' 
                      alt={`${selectedTeam.name} image`} 
                      src={`http://localhost:3001/uploads/${selectedTeam.img.trim()}`} 
                    />
                  </div>

                  <h2>{selectedTeam.name}</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h5 style={{ margin: '0' }}>Leader Name:</h5>
                    <h4 style={{ marginTop: '0' }}>{leaderNames[selectedTeam.leaderID]}</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div>
                      <span><i className='card_icons fa-solid fa-users'></i> No of Members </span>
                      <span>: {selectedTeam.noOfMem}</span>
                    </div>
                    <div>
                      <span><i className='card_icons fa-solid fa-ambulance'></i> Operations </span>
                      <span>: {selectedTeam.ops}</span>
                    </div>
                    <div>
                      <span><i className='card_icons fa-solid fa-medal'></i> Success Rate </span>
                      <span>: {selectedTeam.successRate}</span>
                    </div>
                  </div>

                  <div 
                    className='team_availability' 
                    style={selectedTeam.availability ? {} : { backgroundColor: 'lightgray', color: "gray" }}
                  >
                    <h1 style={{ margin: '0' }}>
                      {selectedTeam.availability ? "Available" : "Unavailable"}
                    </h1>
                  </div>
                </div>
              )}

            </div>

            <div className="AMD form_group">
              <label htmlFor="RO_team_notes">Team Notes</label>
              <textarea className='RO_input textarea' id="RO_team_notes" name="teamNotes" placeholder="Instructions for the team" onChange={handleInputTextChange}></textarea>
            </div>
          </div>

          {/* Animal Behavior & Remarks */}
          <div className="form_section RO_animal_notes">
            <div><h3  style={{textAlign:'left'}} className="section_title">Animal Details & Notes</h3></div>
            
            <div className="AMD form_group">
              <label htmlFor="RO_behavior_notes">Animal Behavior Notes</label>
              <textarea className='RO_input textarea' id="RO_behavior_notes" name="animalBehaviour" placeholder="Aggressive, shy, etc." onChange={handleInputTextChange}></textarea>
            </div>

            <div className="AMD form_group">
              <label htmlFor="RO_other_remarks">Other Remarks</label>
              <textarea className='RO_input textarea' id="RO_other_remarks" name="remarks" placeholder="Anything else to note" onChange={handleInputTextChange}></textarea>
            </div>

            <div className="AMD form_group">
              <label htmlFor="RO_photos">Upload Photos</label>
              <label htmlFor="RO_photos" className="RO_upload_label">
                <i className="fa-solid fa-cloud-arrow-up"></i> Upload Photos
              </label>
              <input className='RO_upload_photo' type="file" id="RO_photos" name="images"  onChange={handleFileChange} multiple />
              {uploadedFiles.length > 0 && (
              <ul className="uploaded_files_list">
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}<button style={{backgroundColor:'transparent', border:'none', marginLeft:'30px', cursor:'pointer'}} onClick={() => removeFile(index)} ><i style={{color:'red'}} className='fa-solid fa-trash'></i></button></li>
                ))}
              </ul>
              )}
            </div>       
          </div>
          <div className="form_section submit_section">
            <button type="submit" className="RO_submit_btn" onClick={handleAddNewRescueOperationSubmit}>Add Rescue Operation</button>
          </div>
          {showTeamForm && (
          <div className={`assign_rescue_team ${showTeamForm ? "visible" : ""}`}  >            
              <SelectRescueTeams onClose={() => setShowTeamForm(false)} onSelectTeam={handleCardClick} rescueTeams={rescueTeams} />       
          </div>
        )}          
          
      </div>

  
  );
}


// assign rescue team
function SelectRescueTeams({onClose, onSelectTeam, rescueTeams}){
  const [rescueTeamList, setRescueTeamList] = useState(rescueTeams || []);
  useEffect(() => {
    try {
      Axios.get("http://localhost:3001/rescueTeam/api/rescueTeams").then(res => {
        setRescueTeamList(res.data);
      });
      
    } catch (error) {
    setRescueTeamList(rescueTeams || []);
    console.error("Error fetching rescue teams:", error);
    }
  }, []);

  return(
    <div className='rescue_teams_cont'>
      <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
        <button type='button' className='form_close_button' onClick={onClose}><i className='fa-solid fa-close'></i></button>
      </div>
      <div><h1 style={{fontSize:'35px'}}>Assign Rescue Team</h1></div>
      <div className='team_cards'>
        {rescueTeamList.map((team, index) => (
          <div key={index} className='rescue_team_card' onClick={() => team.availability && onSelectTeam(team)}>
            <div className='team_image_cont'>
              <img className='team_img' alt={`${team.name} image`} src={`http://localhost:3001/uploads/${team.img.trim()}`} />
            </div>

            <div>
              <h2>{team.name}</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
              <h5 style={{ margin: '0' }}>Leader Name:</h5>
              <h4>{team.leaderName}</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
              <div>
                <span><i className='card_icons fa-solid fa-users'></i> No of Members </span>
                <span>: {team.noOfMem}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-ambulance'></i> Operations </span>
                <span>: {team.ops}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-medal'></i> Success Rate </span>
                <span>: {team.successRate}</span>
              </div>
            </div>

            {/* Availability */}
            <div className='team_availability' style={team.availability ? {} : {backgroundColor:'lightgray', color:"gray"}}>
              <h2 style={{ margin: '0' }}>{team.availability ? "Available" : "Unavailable"}</h2>
            </div>
          </div>
        ))}

      </div>
      
    </div>
  );
}

//profile
export function Profile(){
  // 🧑 Basic Info
  const basic_info = {
    name: 'Felecia Burke',
    role: 'Animal Manager',
    dp: profilePic,   // profile picture import
    dob: '2002-06-10',
    gender: 'Female',
    employee_id: 'EMP-1024'
  };

  // 🔐 Account Details
  const account_details = {
    'First Name': 'Felecia',
    'Last Name': 'Burke',
    'Date of Birth': '10 June, 2002',
    'Gender': 'Female',
    'Username': 'felecia.burke',
    'Access Role': 'Manager',
    'Account Status': 'Active',
    'Last Login': '2025-08-15 14:32'
  };

  // 📞 Contact Info
  const contact_info = {
    email: 'example@mail.com',
    phone: '+1 (070) 123-4567',
    location: 'Batapotha, Madelgamuwa',
    emergency_contact: {
      name: 'John Burke',
      relation: 'Brother',
      phone: '+1 (070) 987-6543'
    }
  };

  // 🛠 Skills & Qualifications
  const skills_qualifications = [
    'Veterinary First Aid Certified',
    'Animal Rescue Operations',
    'Team Leadership',
    'Fluent in English & Sinhala'
  ];

  // 🏆 Achievements
  const achievements = [
    'Employee of the Month - March 2025',
    'Led 50+ successful rescue operations',
    'Trained 3 junior staff members'
  ];

  // 📅 Work Schedule
  const employeeDetials = {
    'Sift': 'Morning Shift',
    'Start Time': '08:00 AM',
    'End Time': '04:00 PM',
    'Weekly Off': 'Sunday',
    'Salary':'50000 Rs',
    'Years of Service':'3 Years'
  };


  return (
    <div className="profile_container" style={{marginTop:'100px'}}>
      {/* Header */}
      <div className="profile_header">
        <h1 className="profile_title">Profile</h1>
        <div className="profile_actions">
          <button className="icon_button"><i className="fas fa-edit"></i></button>
          <button className="icon_button"><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="main_content_grid">
        {/* Profile Card */}
        <div className="profile_card">
          <img className="profile_image" src={basic_info.dp} alt="User Profile" />
          <h2 className="profile_name">{basic_info.name}</h2>
          <span className="profile_role">{basic_info.role}</span>

          

          <div className="profile_contact_info">
            <div className="contact_item"><i className="fas fa-map-marker-alt"></i> <span>{contact_info.location}</span></div>
            <div className="contact_item"><i className="fas fa-envelope"></i> <span>{contact_info.email}</span></div>
            <div className="contact_item"><i className="fas fa-phone"></i> <span>{contact_info.phone}</span></div>
            <div className="contact_item"><i className="fas fa-cake"></i> <span>{basic_info.dob}</span></div>
            <div className="contact_item"><i className="fas fa-venus-mars"></i> <span>{basic_info.gender}</span></div>
          </div>
        </div>

        {/* Account Details & Teams */}
        <div className="details_grid">
          <div className="card account_details_card">
            <div className="card_header">
              <h3>Account Details</h3>
              <button className="icon_button"><i className="fas fa-edit"></i></button>
            </div>
            <div className="card_body">
              {Object.entries(account_details).map(([key, value], index) => (
                <div key={index} className="detail_item">
                  <span className="detail_label">{key}:</span>
                  <span className="detail_value">{value}</span>
                </div>
              ))}
                
            </div>
          </div>

          <div className="card assigned_teams_card">
            <div className="card_header">
              <h3>Employee Details</h3>
              <button className="icon_button"><i className="fas fa-edit"></i></button>
            </div>
            <div className="card_body">
              {Object.entries(employeeDetials).map(([key, value], index) => (
                <div key={index} className="detail_item">
                  <span className="detail_label">{key}:</span>
                  <span className="detail_value">{value}</span>
                </div>
              ))}
                
            </div>
          </div>
          
        </div>
        <div className="details_grid">
        <div className="card assigned_teams_card">
            <div className="card_header">
              <h3>Achievements</h3>
              <button className="icon_button"><i className="fas fa-edit"></i></button>
            </div>
            <div className="card_body">
              {achievements.map((item, index) => (
                <div key={index} className="detail_item">
                  <p key={index} className="detail_value">{item}</p>
                </div>
            ))}
                
            </div>
          </div>
          <div className="card assigned_teams_card">
            <div className="card_header">
              <h3>Skills</h3>
              <button className="icon_button"><i className="fas fa-edit"></i></button>
            </div>
            <div className="card_body">
              {skills_qualifications.map((item, index) => (
                <div key={index} className="detail_item">
                  <p key={index} className="detail_value">{item}</p>
                </div>
            ))}
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// rescue teams
function RescueTeams({setShowOverlay, showOverlay }){

const [showAddTeamForm, setShowAddTeamForm] = useState(false);
   
const handleAddTeamClick = (index) => {
  if(!showAddTeamForm && !showOverlay){
    setShowAddTeamForm(true);    
    setShowOverlay(true);
    if(index !== null){

    }   
  }  

  else{
  setShowAddTeamForm(false);    
  setShowOverlay(false);
  }
  
  
};
const [rescueTeams, setRescueTeams] = useState([]);
const [leaderNames, setLeaderNames] = useState({});
const [editingId, setEditingId] = useState(null);
const [menuId, setMenuId] = useState(null);

  const handleDelete = (id) => {
    setRescueTeams(rescueTeams.filter(team => team.id !== id));
    setMenuId(null);
  };

// swich card and table
const [view, setView] = useState("cards");

  const handleChange = (e) => {
    setView(e.target.value);
  };

  

useEffect(() => {
    // 1. load all teams
    Axios.get("http://localhost:3001/rescueTeam/api/rescueTeams").then(res => {
      setRescueTeams(res.data);

      // Fetch all employees once
      Axios.get("http://localhost:3001/employee/api/employees")
        .then(empRes => {
          const employees = empRes.data; // all employees

          // Map leader IDs to names
          const nameMap = {};
          res.data.forEach(t => {
            const leader = employees.find(emp => emp.empID === t.leaderID);
            if (leader) {
              nameMap[t.leaderID] = `${leader.firstName} ${leader.LastName}`;
            }
          });

          setLeaderNames(nameMap);
        })
        .catch(err => console.error("Error fetching employees:", err));
    });
  }, []);


  return(
    <div className='rescueTeamsCont' >
      <div><h1>Rescue Teams</h1></div>
      <div className='add_rescue_team_cont'>
        
        <button className='add_team_btn' onClick={()=>handleAddTeamClick(null)}>Add Team<i style={{marginLeft:'10px'}} className='fa-solid fa-plus-circle'></i></button>
      </div>
      <select className='display_style_switch' onChange={handleChange} value={view}>
          <option value="cards">Cards View</option>
          <option value="table">Table View</option>
        </select>
      {view === "cards" && (
      <div className='team_cards'>
        {rescueTeams.map((team, index) => (
          <div key={index} className='rescue_team_card' >
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end', position:'relative'}}>
              <button onClick={() => setMenuId(menuId === index ? null : index)} className='threeDot_btn'>⋮</button>
                  {menuId === index && (
                    <div className="AMD_row_menu">
                      <button onClick={() => { setEditingId(team.rescueTeamID); setView("table"); setMenuId(null); }}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </div>
                  )}
            </div>
            <div className='team_image_cont'>
              <img className='team_img' alt={`${team.name} image`} src={`http://localhost:3001/uploads/${team.img.trim()}`} />
            </div>

            <div>
              <h2>{team.name}</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
              <h5 style={{ margin: '0' }}>Leader Name:</h5>
              <h4>{leaderNames[team.leaderID] || "Loading..."}</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
              <div>
                <span><i className='card_icons fa-solid fa-users'></i> No of Members </span>
                <span>: {team.noOfMem}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-ambulance'></i> Operations </span>
                <span>: {team.ops}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-medal'></i> Success Rate </span>
                <span>: {team.successRate}</span>
              </div>
            </div>

            {/* Availability */}
            <div className='team_availability' style={team.availability ? {} : {backgroundColor:'lightgray', color:"gray"}}>
              <h2 style={{ margin: '0' }}>{team.availability ? "Available" : "Unavailable"}</h2>
            </div>
          </div>
        ))}

      </div>
      )}

      {view === "table" && (
      <div className='teams_table'>
        <RescueTeamsTable rescueTeams={rescueTeams} setRescueTeams={setRescueTeams} leaderNames={leaderNames}/>
      </div>
      )}
      {showAddTeamForm && (
        <div className={`add_team_form_cont ${showAddTeamForm ? "visible" : ""}`} onClick={handleAddTeamClick}  >    
          <AddTeamForm onClose={() => {setShowAddTeamForm(false); setShowOverlay(false);  }} onClick={(e) => e.stopPropagation()} />        
        </div>
        )}        
    </div>
  );
}

function RescueTeamsTable({rescueTeams, setRescueTeams, leaderNames}){


useEffect(() => {
  setTeamsChanges(rescueTeams);
}, [rescueTeams]);



const [teamChanges, setTeamsChanges] = useState(rescueTeams);

const [editingId, setEditingId] = useState(null);
const [menuId, setMenuId] = useState(null);

const handleDelete = async (id) => {
  try {
    // Delete from backend
    await Axios.delete(`http://localhost:3001/rescueTeam/api/rescueTeams/${id}`);

    // Remove from local state
    setTeamsChanges(prevTeams => prevTeams.filter(team => team.rescueTeamID !== id));
    setMenuId(null);

    console.log("Team deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting team:", error);
    alert("Failed to delete rescue team");
  }
};

function handleChange(id, field, value) {
  setTeamsChanges(prev =>
    prev.map(t => t.rescueTeamID === id ? { ...t, [field]: value } : t)
  );
}

const handleClose = () =>{
  setTeamsChanges(rescueTeams);
}


useEffect(() => {
  setRescueTeams(teamChanges);
}, [teamChanges]);

const handleSave = (team) =>{
  
  console.log("team  ", team)
  
  const teamID = team.rescueTeamID
  console.log("availability", team.availability)

  const formData = new FormData();
  formData.append("name", team.name);
  formData.append("availability", JSON.stringify(team.availability));
  // Append team logo file
  if (team.img) {
    formData.append("teamLogo", uploadedFile);
  }


  try {
    const response = Axios.put(
      `http://localhost:3001/rescueTeam/api/rescueTeams/${teamID}`, // your backend endpoint
      formData, { headers: { "Content-Type": "multipart/form-data" } }      
    );
    console.log("Team added:", response.data);
    
    
  } catch (error) {
    console.error("Error adding team:", error);
    alert("Failed to add rescue team");
  }
}
  const [uploadedFile, setUploadedFile] = useState(null);

const handleFileChanges = (e, teamID) =>{
  const file = e.target.files[0];
  setUploadedFile(file);

  // Update teamChanges so the image preview updates immediately
  setTeamsChanges(prev =>
    prev.map(team =>
      team.rescueTeamID === teamID ? { ...team, img: URL.createObjectURL(file) } : team
    )
  );
}
  
  return(
    <table className="AMD_table teams_table">
      <thead>
        <tr>
          <th>Team Image</th>
          <th>Team Name</th>
          <th>Leader Name</th>
          <th>No. of Members</th>
          <th>No. of Operations</th>
          <th>Success Rate</th>
          <th>Availabality</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {teamChanges.map((team) => (
          <tr key={team.rescueTeamID} >
            {editingId === team.rescueTeamID ? (
              <>
                <td>                  
                  <label htmlFor="RT_team_logo" className="RT_upload_label" style={{width:'200px', height:'10px', fontSize:'12px'}} >
                    <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:'15px'}}></i>Upload Team Picture
                  </label>
                  <input 
                    type="file" 
                    id="RT_team_logo" 
                    name="teamLogo" 
                    className="RT_upload_photo"
                    onChange={(e) => handleFileChanges(e, team.rescueTeamID)}             
                  />
                  {uploadedFile && (
                    <div className="uploaded_file" style={{fontSize:'12px'}}>
                      {uploadedFile.name}
                      <button 
                        style={{ backgroundColor: 'transparent', border: 'none', marginLeft: '10px', cursor: 'pointer' }} 
                        onClick={() => setUploadedFile(null)} // remove file
                      >
                        <i className="fa-solid fa-trash" style={{ color: 'red',fontSize:'10px' }}></i>
                      </button>
                    </div>
                  )}
                </td>
                <td><input value={team.name} onChange={(e) => handleChange(team.rescueTeamID, "name", e.target.value)} /></td>
                <td>{leaderNames[team.leaderID]}</td>
                <td>{team.noOfMem}</td>
                <td>{team.ops}</td>
                <td>{team.successRate}</td>
                <td><div className={`switch ${team.availability ? "on" : ""}`}  onClick={() =>  handleChange(team.rescueTeamID, "availability", !team.availability)}><div className="thumb" /></div></td>
                {/* <td><input value={team.availability} onChange={(e) => handleChange(team.id, "availability", e.target.value)} /></td> */}

                <td>
                  <button onClick={() => {setEditingId(null); handleSave(team);}} className='AMD save_btn'>✔</button>
                  <button onClick={() => {setEditingId(null); handleClose(); }} className='AMD cancel_btn'>✖</button>
                </td>
              </>
            ) : (
              <>
                <td><img src={`http://localhost:3001/uploads/${team.img.trim()}`}></img></td>
                <td>{team.name}</td>
                <td>{leaderNames[team.leaderID]}</td>
                <td>{team.noOfMem}</td>
                <td>{team.ops}</td>
                <td>{team.successRate}</td>
                <td>{team.availability ? "Available" : "Unavailable"}</td>
                <td style={{ position: "relative" }}>
                  <button onClick={() => setMenuId(menuId === team.rescueTeamID ? null : team.rescueTeamID)} className='threeDot_btn'>⋮</button>
                  {menuId === team.rescueTeamID && (
                    <div className="AMD_row_menu">
                      <button onClick={() => { setEditingId(team.rescueTeamID); setMenuId(null); }}>Edit</button>
                      <button onClick={() => handleDelete(team.rescueTeamID)}>Delete</button>
                    </div>
                  )}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const calAge = (birthday) =>{
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--; // birthday hasn't occurred yet this year
      }
      return age;
    }

    const calExperince =(joinedDate) =>{
      const joineddate = new Date(joinedDate)
      const today = new Date
      let experience = today.getFullYear() - joineddate.getFullYear();
      const m = today.getMonth() - joineddate.getMonth();
      if(m < 0 || (m === 0 && today.getDate() < joineddate.getDate())){
        experience--;
      }
      return experience;
    }


function AddTeamForm({ onClose }){
  const [uploadedFile, setUploadedFile] = useState(null);
  // handle show team members
  const[showMemberList, setShowMemeberList] = useState(false);
  const [selectedleader, setSelectedleader] = useState(null);
  const[selectedMembers, setSelectedMembers] = useState([]);
  const handleCardClick = (mem) => {
    if(memberSelecting){
      setSelectedMembers(prev => 
      prev.some(m => m.empID === mem.empID) ? prev : [...prev, mem]
    );
      setShowMemeberList(false);
    }
    else if(leaderSelecting){
      setSelectedleader(mem); // store selected index in state
      setShowMemeberList(false);  // optionally close the team selection
      console.log("Selected mem index:", mem);
    }  
  
  };

const [leaderSelecting, setLeaderSelecting] = useState(false);
  const handleSelectLeaderBtn = () => {
    setLeaderSelecting(true);
    setMemberSelecting(false);
    setShowMemeberList(true);

  };
  const [memberSelecting, setMemberSelecting] = useState(false);

  const handleSelectMemBtn = () => {
    setMemberSelecting(true);
    setLeaderSelecting(false);
    setShowMemeberList(true);

  };

  const [teamData, setTeamData] = useState({
  team_name: "",
  leader: null,
  members: [],
  remarks: "",
  status: "active",
  team_logo: null, // for uploaded file
});

const handleTextInputChange = (e) => {
  const { name, value } = e.target;
  setTeamData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const handleFileChange = (e) => {
  setTeamData((prev) => ({
    ...prev,
    teamLogo: e.target.files[0],
  }));
  setUploadedFile(e.target.files[0]); // for UI preview
};



useEffect(() => {
  setTeamData(prev => ({
    ...prev,
    leader: selectedleader ? selectedleader.userID : null,
    members: selectedMembers
  }));
}, [selectedleader, selectedMembers]);


// leader selection
useEffect(() => {
  if (selectedleader !== null) {
    setTeamData((prev) => ({ ...prev, leader: selectedleader }));
  }
}, [selectedleader]);
// member selection
useEffect(() => {
  
  setTeamData((prev) => ({ ...prev, members: selectedMembers }));
  console.log(showMemberList)
}, [selectedMembers]);


const handleNewTeamSubmit = async (e) => {
  e.preventDefault();

  const noOfMem = teamData.members.length + 1
  const status = false 
  if(teamData.members.length === 'active') {
    status = true
  }

  const formData = new FormData();
  formData.append("name", JSON.stringify(teamData.teamName));
  formData.append("leaderID", JSON.stringify(teamData.leader));
  formData.append("remarks", JSON.stringify(teamData.remarks));
  formData.append("availability", JSON.stringify(status));
  formData.append("noOfMem", noOfMem)
  // Append members as JSON string
  formData.append("members", JSON.stringify(selectedMembers.map(m => m.userID)));

  // Append team logo file
  if (teamData.teamLogo) {
    formData.append("teamLogo", teamData.teamLogo);
  }

  try {
    const response = await Axios.post(
      "http://localhost:3001/rescueTeam/api/rescueTeams", // your backend endpoint
      formData, { headers: { "Content-Type": "multipart/form-data" } }      
    );
    console.log("Team added:", response.data);
    onClose(); // close the form
  } catch (error) {
    console.error("Error adding team:", error);
    alert("Failed to add rescue team");
  }
  try {
  // Collect all member IDs
  const memIDs = selectedMembers.map(m => m.rescuerID); // ✅ use correct field name
  memIDs.push(teamData.leader.rescuerID); // ✅ push leader ID

  // Update all members in parallel
  await Promise.all(
    memIDs.map(mid =>
      Axios.put(`http://localhost:3001/rescuer/api/rescuers/${mid}`, {
        availability: false,
      })
        .then(res => {
          console.log("Member updated:", res.data);
        })
        .catch(err => console.error("Update error:", err))
    )
  );

  console.log("✅ All members updated successfully");

} catch (error) {
  console.error("❌ Error adding team:", error);
  alert("Failed to add rescue team");
}

};


  return(
    <form className='add_team_form' onClick={(e) => e.stopPropagation()} onSubmit={handleNewTeamSubmit}>
      <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
        <button type='button' className='form_close_button' onClick={onClose}><i className='fa-solid fa-close'></i></button>
      </div>
      <div><h1>Add Team</h1></div>
      <div className="form_section RT_team_details">
        <div>
          <h3 style={{ textAlign: 'left' }} className="section_title">Rescue Team Details</h3>
        </div>

        
        <div className="AMD form_group">
          <label htmlFor="RT_team_name">Team Name</label>
          <input 
            type="text" 
            className="RT_input" 
            id="RT_team_name" 
            name="team_name" 
            placeholder="Enter team name" 
            onChange={handleTextInputChange}
          />
        </div>

        
        <div className="AMD form_group">
          <label htmlFor="RT_team_leader">Team Leader</label>
          <button type='button' className='select_mem_btn' onClick={handleSelectLeaderBtn}>Select Leader</button>
          {selectedleader !== null && (
            <div className='selected_mem_card' onClick={() => {setShowMemeberList(true); setLeaderSelecting(true); setMemberSelecting(false);} } >
              {/* get selected member */}
              {(() => {
                const mem = selectedleader; // CHANGED
                return (
                  <>
                    <button className='remove_mem_cont' onClick={(e) =>{ setSelectedleader(null); e.stopPropagation();} }><i className='remove_mem fa-solid fa-trash' style={{ color: 'red' }}></i></button>
                    <div className='mem_image_cont'>
                      
                      <img className='mem_img' alt={`${mem.firstName} image`} src={`http://localhost:3001/uploads/${mem.profilePic.trim()}`} />
                      
                    </div>

                    <div>
                      <h2>{mem.firstName}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <h5 style={{ margin: '0' }}>Last Name:</h5>
                      <h4 style={{ marginTop: '0' }}>{mem.LastName}</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div>
                        <span><i className='card_icons fa-solid fa-user'></i> Experience </span>
                        <span>: {calExperince(mem.hireDate)}</span>
                      </div>
                      <div>
                        <span><i className='card_icons fa-solid fa-venus-mars'></i> Gender </span>
                        <span>: {mem.gender}</span>
                      </div>
                      <div>
                        <span><i className='card_icons fa-solid fa-cake'></i> Age </span>
                        <span>: {calAge(mem.birthday)}</span>
                      </div>
                    </div>

                    <div className='mem_availability' style={mem.status === "Active" ? {} : {backgroundColor:'lightgray', color:"gray"}}>
                      <h2 style={{ margin: '0' }}>{mem.status === "Active" ? "Available" : "Unavailable"}</h2>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>

        {/* Team Members */}
        <div className="AMD form_group">
          <label htmlFor="RT_team_members">Team Members</label>
          <button type='button' className='select_mem_btn' onClick={handleSelectMemBtn}>Select Member</button>
          <div style={{display:'grid',gridTemplateColumns: 'repeat(3, 1fr)', gap:'20px' }}>
            
          
            {selectedMembers.length > 0 && selectedMembers.map((mem, index) => (
                <div key={index} className='selected_mem_card'  onClick={() => setShowMemeberList(true)} >
                  {/* get selected member */}
                  {(() => {
                    
                    return (
                      <>
                        <button key={mem.empID} className='remove_mem_cont'  onClick={(e) => {setSelectedMembers(prev => prev.filter((_, i) => i !== index));  e.stopPropagation();} }><i className='remove_mem fa-solid fa-trash' style={{ color: 'red' }}></i></button>
                        <div className='mem_image_cont'>
                          <img className='mem_img' alt={`${mem.firstName} image`} src={`http://localhost:3001/uploads/${mem.profilePic.trim()}`} />
                        </div>

                        <div>
                          <h2>{mem.firstName}</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <h5 style={{ margin: '0' }}>Last Name:</h5>
                          <h4 style={{ marginTop: '0' }}>{mem.LastName}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <div>
                            <span><i className='card_icons fa-solid fa-user'></i> Experience </span>
                            <span>: {calExperince(mem.hireDate)}</span>
                          </div>
                          <div>
                            <span><i className='card_icons fa-solid fa-venus-mars'></i> Gender </span>
                            <span>: {mem.gender}</span>
                          </div>
                          <div>
                            <span><i className='card_icons fa-solid fa-cake'></i> Age </span>
                            <span>: {calAge(mem.birthday)}</span>
                          </div>
                        </div>

                        <div className='mem_availability' style={mem.status === "Active" ? {} : {backgroundColor:'lightgray', color:"gray"}}>
                          <h2 style={{ margin: '0' }}>{mem.status === "Active" ? "Available" : "Unavailable"}</h2>
                        </div>
                      </>
                    );
                  })()}
                </div>
            ))}
            
          </div>

        {/* remarks  */}
        <div className="AMD form_group">
          <label htmlFor="RT_vehicle">Remarks</label>
          <textarea 
            type="text" 
            className="RT_input textarea" 
            id="RT_assigned_area" 
            name="remarks" 
            placeholder="Enter assigned area" 
            onChange={handleTextInputChange}
          ></textarea>
        </div>

        

        {/* Status */}
        <div className="AMD form_group">
          <label htmlFor="RT_status">Team Status</label>
          <select className="RT_input" id="RT_status" name="status" onChange={handleTextInputChange}>
            <option value="active">Availabale</option>
            <option value="inactive">Unavailable</option>
            
          </select>
        </div>

        {/* Upload Photo / Badge */}
        <div className="AMD form_group">
          <label htmlFor="RT_team_logo">Upload Team Picture</label>
          <label htmlFor="RT_team_logo" className="RT_upload_label">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Team Picture
          </label>
          <input 
            type="file" 
            id="RT_team_logo" 
            name="team_logo" 
            className="RT_upload_photo"
            onChange={handleFileChange} // store single file
          />
          {uploadedFile && (
            <div className="uploaded_file">
              {uploadedFile.name}
              <button 
                style={{ backgroundColor: 'transparent', border: 'none', marginLeft: '10px', cursor: 'pointer' }} 
                onClick={() => setUploadedFile(null)} // remove file
              >
                <i className="fa-solid fa-trash" style={{ color: 'red' }}></i>
              </button>
            </div>
          )}
        </div>
        <div className="form_section submit_section">
            <button type="submit" className="RO_submit_btn" >Add Rescue Team</button>
        </div>
      </div>
          {showMemberList && (
          <div className={`assign_leader ${showMemberList ? "visible" : ""}`}  >            
              <RescueMemberList onClose={() => setShowMemeberList(false)} onSelectLeader={handleCardClick}/>       
          </div>
        )} 
          
    </div>
    </form>
  );
}


// show rescuers list

function RescueMemberList({onClose , onSelectLeader}){
  const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    
    
    useEffect(() => {
  setLoading(true);

  Promise.all([
    Axios.get('http://localhost:3001/employee/api/employees'),
    Axios.get('http://localhost:3001/rescuer/api/rescuers')
  ])
    .then(([empRes, rescuerRes]) => {
      const employees = empRes.data;
      const rescuers = rescuerRes.data;

      // Filter only rescuers from employees
      const emps = employees.filter(emp => emp.role === "Rescuer");

      // Merge availability info from rescuers
      const merged = emps.map(emp => {
        const match = rescuers.find(r => r.empID === emp.empID);
        console.log("macth",match)
        return {
          ...emp,
          availability: match ? match.availability : false, // default false if not found
        };
      });

      setMembers(merged);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching rescue members:", error);
      setLoading(false);
    });
}, []);


    if (loading) return <div>Loading rescue members...</div>;
    if (!members.length) return <div>No rescue members found.</div>;

    
return ( 
    <div className='member_list_cont'>
      <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
        <button type='button' className='form_close_button' onClick={onClose}>
          <i className='fa-solid fa-close'></i>
        </button>
      </div>
      <div><h1 style={{fontSize:'35px'}}>Assign Rescue Team</h1></div>
      <div className='mem_cards'>
        {members.map((mem) => (
          <div
            key={mem.empID}
            className='mem_card'
            onClick={(e) => {mem.availability ? onSelectLeader(mem) : e.stopPropagation()}}
          >
            <div className='mem_image_cont'>
              <img className='mem_img' alt={`${mem.firstName} image`} src={`http://localhost:3001/uploads/${mem.profilePic.trim()}`} />
            </div>

            <div>
              <h2>{mem.firstName}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h5 style={{ margin: 0 }}>Last Name:</h5>
              <h4>{mem.LastName}</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div>
                <span><i className='card_icons fa-solid fa-user'></i> Experience </span>
                <span>: {calExperince(mem.hireDate)}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-venus-mars'></i> Gender </span>
                <span>: {mem.gender}</span>
              </div>
              <div>
                <span><i className='card_icons fa-solid fa-cake'></i> Age </span>
                <span>: {calAge(mem.birthday)}</span>
              </div>
            </div>

            {/* Availability */}
            <div className='mem_availability' style={mem.availability ? {} : {backgroundColor:'lightgray', color:"gray"}}>
              <h2 style={{ margin: '0' }}>{mem.availability ? "Available" : "Unavailable"}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllRescueOPerations({onClose}){
  
  return(
    <div className='AllOps_form' onClick={(e) => e.stopPropagation()}>
      <div style={{width:'100%', display:'flex', justifyContent:'flex-end', flexDirection:'column'}}>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button type='button' className='form_close_button' onClick={onClose}><i className='fa-solid fa-close'></i></button>

        </div>
        <h1>All Operations</h1>
          <OpsTable/>
        </div>
        
  </div>  )
  

}




function OpsTable({main}) {
  const [petRescueOperations, setPetRescueOperations] = useState([]);
  const [teamsMap, setTeamsMap] = useState({});
  const [teams, setTeams] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [originalOps, setOriginalOps] = useState([]); // for cancel

  // Fetch operations and teams from backend
  useEffect(() => {
    Axios.get("http://localhost:3001/rescueOp/api/rescueOps")
      .then(res => {
        const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (main) {
      setPetRescueOperations(sortedData.slice(0, 10));
      setOriginalOps(sortedData.slice(0, 10));
    } else {
      setPetRescueOperations(sortedData);
      setOriginalOps(sortedData);
    }
      })
      .catch(err => console.error(err));

    Axios.get("http://localhost:3001/rescueTeam/api/rescueTeams")
      .then(res => {
        const teamMap = {};
        res.data.forEach(team => (teamMap[team.rescueTeamID] = team.name));
        setTeams(res.data)
        setTeamsMap(teamMap);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (id, field, value) => {
      
      if (field === "assignedTeam") {
        
        if (!validateTeamStatus(id)) {
          console.error("Team is unavailable");
          return;
        }
        else{
        setPetRescueOperations(prev =>
            prev.map(op => op.rescueOpsID === id ? { ...op, [field]: value } : op)
        );
      }
      }
      else{
          setPetRescueOperations(prev =>
            prev.map(op => op.rescueOpsID === id ? { ...op, [field]: value } : op)
          );
        }
    
  };

  const validateTeamStatus = (opsID) => {
    const operation = petRescueOperations.find(op => op.rescueOpsID === opsID);
    console.log("operation  ", operation)
    if (!operation) return false;
    const teamID = operation.assignedTeam;
    console.log("teamID  ", teamID)
    if (!teamID) return false;
    const team = teams.filter(t => t.rescueTeamID === teamID)[0];
    console.log("team  ", team)
    if (!team) return "";
    console.log("team availability  ", team.availability)
    if (team.availability === "false") {
      return false
    }
    else{
      return true
    }
  };

  const handleCancel = (id) => {
    // Reset only the canceled operation
    const originalOp = originalOps.find(op => op.rescueOpsID === id);
    setPetRescueOperations(prev =>
      prev.map(op => op.rescueOpsID === id ? originalOp : op)
    );
    setEditingId(null);
  };

  const handleSave = (id) => {
    const updatedOp = petRescueOperations.find(op => op.rescueOpsID === id);
    console.log(id)
    Axios.put(`http://localhost:3001/rescueOp/api/rescueOps/${id}`, {
      opsStatus: updatedOp.opsStatus,
      assignedTeam: updatedOp.assignedTeam
    })
      .then(res => {
        console.log("Operation updated:", res.data);
        // update originalOps as well
        setOriginalOps(prev =>
          prev.map(op => op.rescueOpsID === id ? res.data : op)
        );
        setEditingId(null);
      })
      .catch(err => console.error("Update error:", err));
      if(updatedOp.opsStatus == "successful" || updatedOp.opsStatus == "unsuccessful")
      chnageAvailability(updatedOp.assignedTeam)
  };

  const handleDelete = (id) => {
    const deletedOp = petRescueOperations.find(op => op.rescueOpsID === id);
    console.log("Deleting operation:", id);
    Axios.delete(`http://localhost:3001/rescueOp/api/rescueOps/${id}`)
      .then(() => {
        setPetRescueOperations(prev => prev.filter(op => op.rescueOpsID !== id));
        setOriginalOps(prev => prev.filter(op => op.rescueOpsID !== id));
      })
      .catch(err => console.error("Delete error:", err));
    setMenuId(null);    
    chnageAvailability(deletedOp.assignedTeam)
  };

  const chnageAvailability = (teamID) =>{
    try {
      const formData = new FormData();
      formData.append("availability", JSON.stringify(true));
      const response = Axios.put(
        `http://localhost:3001/rescueTeam/api/rescueTeams/${teamID}`, // your backend endpoint
        formData, { headers: { "Content-Type": "multipart/form-data" } }      
      );
      console.log("Team added:", response.data);
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };
  const statusStyles = {
    pending: { display: "inline-block", backgroundColor: "#f0f0f0", color: "#333", padding: "5px 10px", borderRadius: "5px", fontWeight:"bold", textAlign:"center", width: "100%" },
    assigned: { display: "inline-block", backgroundColor: "#ffecb3", color: "#795548", padding: "5px 10px", borderRadius: "5px", fontWeight:"bold", textAlign:"center", width: "100%" },
    "on going": { display: "inline-block", backgroundColor: "#bbdefb", color: "#0d47a1", padding: "5px 10px", borderRadius: "5px", fontWeight:"bold", textAlign:"center", width: "100%" },
    successful: { display: "inline-block", backgroundColor: "#c8e6c9", color: "#2e7d32", padding: "5px 10px", borderRadius: "5px", fontWeight:"bold", textAlign:"center", width: "100%" },
    unsuccessful: { display: "inline-block", backgroundColor: "#ffcdd2", color: "#b71c1c", padding: "5px 10px", borderRadius: "5px", fontWeight:"bold", textAlign:"center", width: "100%" },
  };

  return (
    <table className="AMD_table rescue_table" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Status</th>
          <th>Location</th>
          <th>Assigned Team</th>
          <th>Date</th>
          <th>Note</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {petRescueOperations.map(op => (
          <tr key={op.rescueOpsID}>
            <td>{op.animalType}</td>
            <td>
              {editingId === op.rescueOpsID ? (
                <select
                  value={op.opsStatus}
                  onChange={(e) => handleChange(op.rescueOpsID, "opsStatus", e.target.value)}
                  style={{ padding: "5px", borderRadius: "5px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="on going">On Going</option>
                  <option value="successful">Successful</option>
                  <option value="unsuccessful">Unsuccessful</option>
                </select>
              ) : (
                <span style={statusStyles[op.opsStatus.toLowerCase()] || statusStyles.pending}>
                  {op.opsStatus.charAt(0).toUpperCase() + op.opsStatus.slice(1)}
                </span>
              )}
            </td>
            <td>{op.location}</td>
            <td>              
                <span>{op.assignedTeam ? teamsMap[op.assignedTeam] : "Not Assigned"}</span>
             
            </td>
            <td>{new Date(op.date).toLocaleDateString()}</td>
            <td>{op.teamNotes}</td>
            <td style={{ position: "relative" }}>
              {editingId === op.rescueOpsID ? (
                <>
                  <button onClick={() => handleSave(op.rescueOpsID)} className="AMD save_btn">✔</button>
                  <button onClick={() => handleCancel(op.rescueOpsID)} className="AMD cancel_btn">✖</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setMenuId(menuId === op.rescueOpsID ? null : op.rescueOpsID)}
                    className="threeDot_btn"
                  >
                    ⋮
                  </button>
                  {menuId === op.rescueOpsID && (
                    <div
                      className="AMD_row_menu"
                      style={{
                        position: "absolute",
                        backgroundColor: "#fff",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        zIndex: 10
                      }}
                    >
                      <button onClick={() => { setEditingId(op.rescueOpsID); setMenuId(null); }}>Edit</button>
                      <button onClick={() => handleDelete(op.rescueOpsID)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



export function AnimalProfiles({setShowOverlay, showOverlay}){
  
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false);

  const [animals, setAnimals] = useState([]);
useEffect(() => {
    // 1. load all teams
    Axios.get("http://localhost:3001/animalProfile/api/animalProfiles").then(res => {
    setAnimals(res.data);  
         
    });
  }, [showAddAnimalForm]);

  
    const [searchResults, setSearchResults] = useState([]);

    const [initialAnimals, setInitialAnimals] = useState([]);

    const [searchValue, setSearchValue] = useState("");      // track input

    const inputRef = useRef(null);
    useEffect(() => {
        setInitialAnimals(animals.slice(0, animals.length));
        setSearchResults(animals.slice(0, 30)); // show all at first
      }, [animals]);
    useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults(initialAnimals);
      return;
    }
    const lower = searchValue.toLowerCase();
    const filtered = animals.filter((a) =>
      [a.species, a.breed, a.description, a.color, a.adoptionStatus, a.bio, a.age]
        .some((field) => field?.toLowerCase().includes(lower))
    );
    setSearchResults(filtered);
    }, [searchValue, animals, initialAnimals]);

    useEffect(() => {
      console.log("Searching for:", initialAnimals);

    }, [initialAnimals]);


  const handleAddAnimalProfileClick = () => {
    if(!showAddAnimalForm && !showOverlay){
      setShowAddAnimalForm(true);    
      setShowOverlay(true);   
    }  

    else{
    setShowAddAnimalForm(false);    
    setShowOverlay(false);
    }
  }

  const [columns, setColumns] = useState(window.innerWidth < 1400 ? 3 : 4);

  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth < 1400 ? 3 : 4);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return(
    <div>
      <div className="AMD_header">
        <h1>Rescued Animals</h1>
      </div>
        <div className="AMD search_bar">
          <div className='AMD search_input_cont' >
          <BsSearch className="AOD_search_icon" />
          
          <input
              ref={inputRef}
              type="text"
              className="AMD search_input"
              placeholder="Search Animal Profile"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              />
          </div> 
          <button className='AMD add_animal_btn' onClick={handleAddAnimalProfileClick}>Add Animal</button>
                       
        </div>
        <RescuedAnimalList searchResults = {searchResults} initialAnimals = {initialAnimals} columns={columns} setAnimals={setAnimals}/>
        <div className={`add_animal_profile_form_cont ${showAddAnimalForm ? "visible" : ""}`} onClick={handleAddAnimalProfileClick}>
            <AddRescueAnimalProfile onClose={() => {setShowAddAnimalForm(false); setShowOverlay(false); }}/>
        </div> 
    </div>

  )
}

function AddRescueAnimalProfile({ onClose }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    species: '',
    breed: '',
    gender: '',
    age: '',
    color: '',
    weight: '',
    adoptionStatus: '',
    description: '',
  });

  // handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle multi-photo upload
  const handleFileUpload = (e) => {
    setUploadedFiles((prev) => {
      const newFiles = Array.from(e.target.files);
      const unique = [...prev];
      newFiles.forEach(f => {
        if (!unique.find(u => u.name === f.name && u.size === f.size)) {
          unique.push(f);
        }
      });
      return unique;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👉 build multipart/form-data payload
    const payload = new FormData();
    // append text fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    // append files
    uploadedFiles.forEach(file => {
      payload.append('images', file); // must match multer field name
    });

    try {
      await Axios.post(
        'http://localhost:3001/animalProfile/api/animalProfiles', // <-- adjust if your route differs
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Animal profile added successfully');
      onClose();
    } catch (err) {
      console.error('Error adding animal profile:', err);
      alert('Failed to add animal profile. See console for details.');
    }
  };

  return (
    <div className='AMD add_animal_profile_form' onClick={(e) => e.stopPropagation()}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="form_close_button" onClick={onClose}>
          <i className="fa-solid fa-close"></i>
        </button>
      </div>

      <h1>Add Rescued Animal</h1>
      <form onSubmit={handleSubmit} className="RT_team_details" >
        {/* Species */}
        <div className="AMD form_group">
          <label htmlFor="species">Species</label>
          <input
            type="text"
            className="RT_input"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            placeholder="e.g. Dog, Cat, Rabbit"
          />
        </div>

        {/* Breed */}
        <div className=" AMD form_group">
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            className="RT_input"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g. Labrador"
          />
        </div>

        {/* Gender */}
        <div className="AMD form_group">
          <label htmlFor="gender">Gender</label>
          <select
            className="RT_input"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Age */}
        <div className="AMD form_group">
          <label htmlFor="age">Age</label>
          <input
            type="text"
            className="RT_input"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 2 years"
          />
        </div>

        {/* Color */}
        <div className="AMD form_group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            className="RT_input"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Brown & White"
          />
        </div>

        {/* Weight */}
        <div className="AMD form_group">
          <label htmlFor="weight">Weight</label>
          <input
            type="text"
            className="RT_input"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g. 12 kg"
          />
        </div>

        {/* Adoption Status */}
        <div className="AMD form_group">
          <label htmlFor="adoptionStatus">Adoption Status</label>
          <select
            className="RT_input"
            id="adoptionStatus"
            name="adoptionStatus"
            value={formData.adoptionStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Ready for Adopt">Ready for Adopt</option>
            <option value="Under Care">Under Care</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>

        {/* Description */}
        <div className="AMD form_group">
          <label htmlFor="description">Description</label>
          <textarea
            className="RT_input textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short notes about temperament, special needs, etc."
          />
        </div>

        {/* Photos */}
        <div className="AMD form_group">
          <label htmlFor="photos">Upload Photos</label>
          <label htmlFor="photos" className="RT_upload_label">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Images
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            className="RT_upload_photo"
            multiple
            onChange={handleFileUpload}
          />
          {uploadedFiles.length > 0 && (
            <div className="uploaded_file">
              {uploadedFiles.map((f, i) => (
                <div key={i} style={{ marginRight: '10px' }}>{f.name}</div>
              ))}
              <button
                type="button"
                onClick={() => setUploadedFiles([])}
              >
                <i className="fa-solid fa-trash" style={{ color: 'red' }}></i>
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="form_section submit_section">
          <button type="submit" className="RO_submit_btn">
            Add Animal
          </button>
        </div>
      </form>
    </div>
  );
}