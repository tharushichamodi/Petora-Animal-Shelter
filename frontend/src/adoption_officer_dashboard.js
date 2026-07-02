import React, {react, useRef, useEffect, useState, useMemo}from 'react';
import {Header, Profile, AnimalProfiles } from './animal_manager_dashboard';
import { BsThreeDotsVertical, BsSearch } from 'react-icons/bs';
import Axios from 'axios';


import './css/dashboard_common.css'
import './css/adoption_officer_dashboard.css'
import './css/one_adoption_application.css'


import bargraphVector from './images/bargraph_vector.jpeg'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function AdoptionOfficerDashboard(){
    
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
      setShowOverlay(!showOverlay);
    };

    return(
        <div className="dashboard_container" >
              <div className={`overlay ${showOverlay ? "visible" : ""}`} onClick={handleOverlayChange}></div>
              <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>
              <link  rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
              <div className="dashboard_content" >
                <div className="sidebar_cont" style={{marginTop:'50px'}}>
                    <div className='sidebar'>
                      <h2 className="sidebar_logo">Petora</h2>
                      <ul className="sidebar_menu">
                        <li onClick={() => handleDashboardContentChange("Profile")} className={selectedSection === "Profile" ? "selected" : ""}>Dashboard</li>
                        <li onClick={() => handleDashboardContentChange("Adoption Applications")} className={selectedSection === "Adoption Applications" ? "selected" : ""}>Adoption Applications</li>
                        <li onClick={() => handleDashboardContentChange("Animal Profiles")} className={selectedSection === "Animal Profiles" ? "selected" : ""}>Animal Profiles</li>
                        <li onClick={() => handleDashboardContentChange("Analytics")} className={selectedSection === "Analytics" ? "selected" : ""}>Analytics</li>
                        <li onClick={() => handleDashboardContentChange("Cage Tracker")} className={selectedSection === "Cage Tracker" ? "selected" : ""}>Cage Tracker</li>
                      </ul>
                    </div>
                  
                </div>
                <div className='DB dashboard_header_cont'>
                  <Header/>
                </div>
                {dashboardContent == "Profile" && (
                    <Profile setShowOverlay={setShowOverlay} showOverlay = {showOverlay}  style={{marginTop:'100px'}} />
                )}

                {dashboardContent == "Animal Profiles" && (
                    <div style={{marginTop:'100px', marginLeft:'20vw', position:'relative'}}>
                        <AnimalProfiles setShowOverlay={setShowOverlay} showOverlay = {showOverlay} />
                    </div>

                )}
                {dashboardContent == "Adoption Applications" && (
                    <div style={{marginTop:'100px', marginLeft:'20vw', position:'relative', width:'100%'}}>
                        <ApplicationSection />
                    </div>

                )}
                {dashboardContent == "Analytics" && (
                    <div style={{marginTop:'50px', marginLeft:'20vw', position:'relative', width:'100%'}}>
                        <Analytics />
                    </div>

                )}

            </div>
        </div>
    )
}

export default AdoptionOfficerDashboard




function ApplicationSection ({}){

  const [applicationsData, setApplicationsData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await Axios.get(
        'http://localhost:3001/adoptionApplication/api/adoptionApplications'
      );
      setApplicationsData(response.data); // assuming response.data is an array
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  fetchApplications();
  
}, []);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredData = applicationsData.filter(app =>
    Object.values(app).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(filteredData.length / recordsPerPage);
  // Stats for the top boxes
  const totalApplications = applicationsData.length;
  const totalRescued = 50; // Example
  const totalAdopted = 25; // Example

  // Filter the data based on the search term


  // Handle row selection
  const handleSelectRow = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle row click
  const [clickedApplication, setClickedApplication] = useState(null);
  const handleRowClick = (app) => {
    handleShowApplicationDetails()
    setClickedApplication(app);
  };

  // Handle dropdown toggle
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Handle action click
  const handleActionClick = (action, id) => {
    alert(`${action} action for ID ${id} clicked!`);
    setDropdownOpen(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);
  
const pageNumbers = [];
  if (nPages <= 5) {
    for (let i = 1; i <= nPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1, 2, 3);
    if (currentPage > 3 && currentPage < nPages - 1) {
      pageNumbers.push('...', currentPage);
    } else if (currentPage >= nPages - 1) {
      pageNumbers.push('...');
    }
    pageNumbers.push(nPages - 1, nPages);
  }
const [animalData, setAnimalData] = useState([]);

useEffect(() => {
  const fetchAnimalData = async () => {
    try {
      const response = await Axios.get(
        'http://localhost:3001/animalProfile/api/animalProfiles'
      );
      setAnimalData(response.data);
    } catch (error) {
      console.error('Error fetching pet data:', error);
    }
  };

  fetchAnimalData();
}, []);

const getAnimalType = (animalID) => {
    const animal = animalData.find(a => a.animalProfileID === animalID);
    return animal ? animal.species : 'Unknown';
  }
const getAnimalBreed = (animalID) => {
    const animal = animalData.find(a => a.animalProfileID === animalID);
    return animal ? animal.breed : 'Unknown';
  }

  // show one application details
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const handleShowApplicationDetails = () => {
    setShowApplicationDetails(!showApplicationDetails);
  }

  
  return (
    <div className="AOD_table_container">
    
        <div className="AMD_header">
          <h1>Welcome, Adoption Officer</h1>
        </div>
      {/* Top boxes with stats */}
      <h2>Monthly Overview</h2>
      <div className="AOD_stats_container">
        
        <div className="AOD_stat_box">
            <div>
            <h2>Total Applications</h2>
            <p>{totalApplications}</p>
            <p style={{fontSize:'12px'}}>Compared to last Month</p>
            </div>
            <div>
            <img className='bargraph_vec_img' src={bargraphVector}></img>
            </div>
        </div>
        <div className="AOD_stat_box">
            <div>
            <h2>Total Rescued Animals</h2>
            <p>{totalRescued}</p>
            <p style={{fontSize:'12px'}}>Compared to last Month</p>
            </div>
            <div>
            <img className='bargraph_vec_img' src={bargraphVector}></img>
            </div>
        </div>
        <div className="AOD_stat_box">
            <div>
            <h2>Total Adopted Animals</h2>
            <p>{totalAdopted}</p>
            <p style={{fontSize:'12px'}}>Compared to last Month</p>
            </div>
            <div>
            <img className='bargraph_vec_img' src={bargraphVector}></img>
            </div>
        </div>
      </div>
        <h2>Adoption Applications</h2>
      {/* Search bar */}
      <div className="AOD_search_bar">
        <BsSearch className="AOD_search_icon" />
        <input
          type="text"
          placeholder="Search Applications..."
          value={searchTerm}
          onChange={(e) => setCurrentPage(1) || setSearchTerm(e.target.value)}
          className="AOD_search_input"
        />
      </div>

      {/* The main table */}
      <div className="AOD_table_main">
        <div className="AOD_table_header">
          <div className="AOD_header_cell AOD_checkbox_header">
            <input
              type="checkbox"
              onChange={() => {
                if (selectedIds.size === filteredData.length) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(filteredData.map(item => item.id)));
                }
              }}
              checked={selectedIds.size === filteredData.length && filteredData.length > 0}
            />
          </div>
          <div className="AOD_header_cell">Candidate</div>
          <div className="AOD_header_cell">Pet ID</div>
          <div className="AOD_header_cell">Pet Type</div>
          <div className="AOD_header_cell">Pet Breed</div>
          <div className="AOD_header_cell">Has Owned Pets</div>
          <div className="AOD_header_cell">Action</div>
        </div>

        <div className="AOD_table_body">
          {currentRecords.length > 0 ? (
            currentRecords.map(item => (
              <div
                key={item.id}
                className={`AOD_table_row ${selectedIds.has(item.applicationID) ? 'AOD_row_selected' : ''}`}
                onClick={() => handleRowClick(item)}
              >
                <div className="AOD_cell AOD_checkbox_cell" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.applicationID)}
                    onChange={() => handleSelectRow(item.applicationID)}
                  />
                </div>
                <div className="AOD_cell">{item.full_name}</div>
                <div className="AOD_cell">{item.animalID}</div>
                <div className="AOD_cell">{getAnimalType(item.animalID)}</div>
                <div className="AOD_cell">{getAnimalBreed(item.animalID)}</div>
                <div className="AOD_cell">{item.current_pets}</div>
                <div className="AOD_cell AOD_action_cell" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleDropdown(item.applicationID)}>
                    <BsThreeDotsVertical />
                  </button>
                  {dropdownOpen === item.applicationID && (
                    <div className="AOD_dropdown_menu" ref={dropdownRef}>
                      <div onClick={() => handleActionClick('View', item.applicationID)}>View</div>
                      <div onClick={() => handleActionClick('Reply', item.applicationID)}>Reply</div>
                      <div onClick={() => handleActionClick('Delete', item.applicationID)}>Delete</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="AOD_no_results">No records found.</div>
          )}
        </div>
        
      </div>
      {/* Pagination Controls */}
      <div className="AOD_pagination_container">
        <div className="AOD_pagination_info">
          Showing {indexOfFirstRecord + 1}-
          {Math.min(indexOfLastRecord, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="AOD_pagination_controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`AOD_pagination_button ${currentPage === 1 ? 'AOD_pagination_button_disabled' : ''}`}
          >
            &lt; Previous
          </button>
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              className={`AOD_pagination_button ${currentPage === page ? 'AOD_pagination_button_active' : ''}`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(nPages, prev + 1))}
            disabled={currentPage === nPages}
            className={`AOD_pagination_button ${currentPage === nPages ? 'AOD_pagination_button_disabled' : ''}`}
          >
            Next &gt;
          </button>
        </div>
      </div>
      {showApplicationDetails &&
        <OneApplication clickedApplication={clickedApplication} setShowApplicationDetails={setShowApplicationDetails} />
      }
      
    </div>
  );
};

const mockData = [
  // date, species, applications, adopted, rescued
  { date: "2025-04-10", species: "Dog", applications: 20, adopted: 8, rescued: 12 },
  { date: "2025-04-15", species: "Cat", applications: 15, adopted: 6, rescued: 10 },
  { date: "2025-05-12", species: "Dog", applications: 25, adopted: 12, rescued: 14 },
  { date: "2025-05-20", species: "Rabbit", applications: 10, adopted: 3, rescued: 7 },
  { date: "2025-06-02", species: "Dog", applications: 30, adopted: 15, rescued: 15 },
  { date: "2025-06-18", species: "Cat", applications: 22, adopted: 9, rescued: 13 },
  { date: "2025-07-05", species: "Dog", applications: 27, adopted: 11, rescued: 16 },
  { date: "2025-07-07", species: "Rabbit", applications: 9, adopted: 4, rescued: 5 },
  { date: "2025-07-25", species: "Cat", applications: 18, adopted: 7, rescued: 11 },
];


export function Analytics() {
  // ----- Filters -----
  // Replace these with API calls that accept a "months" argument.
  const baseData = useMemo(
    () => ({
      species: ["Dog", "Cat", "Rabbit", "Bird", "Others"],
      applications: [45, 30, 15, 12, 8],
      adopted: [25, 18, 10, 7, 3],
      rescued: [40, 28, 14, 10, 5],
    }),
    []
  );

  // ----- Individual Section States -----
  const [appsPeriod, setAppsPeriod] = useState("1");
  const [appsType, setAppsType] = useState("pie");

  const [adoptPeriod, setAdoptPeriod] = useState("1");
  const [adoptType, setAdoptType] = useState("bar");

  const [rescuePeriod, setRescuePeriod] = useState("1");
  const [rescueType, setRescueType] = useState("line");

  // ----- Chart Factory -----
  const renderChart = (type, dataArr, label) => {
    const chartData = {
      labels: baseData.species,
      datasets: [
        {
          label,
          data: dataArr,
          backgroundColor: [
            "rgba(139, 69, 19, 0.7)",   // saddle brown
            "rgba(160, 82, 45, 0.7)",   // sienna
            "rgba(205, 133, 63, 0.7)",  // peru
            "rgba(222, 184, 135, 0.7)", // burlywood
            "rgba(244, 164, 96, 0.7)",  // sandy brown
          ],
          borderColor: "rgba(139, 69, 19, 1)", // a deep brown for borders
          borderWidth: type === "line" ? 1 : 0,

          tension: 0.3,
        }
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { display: type === "pie" },
      },
    };

    if (type === "bar") return <Bar data={chartData} options={options} />;
    if (type === "line") return <Line data={chartData} options={options} />;
    return <Pie data={chartData} options={options} />;
  };

  // ----- Section Template -----
  const Section = ({ title, period, setPeriod, type, setType, dataArr, label }) => (
    <div className="AOD_section">
      <h3 className="AOD_section_title">{title}</h3>

      <div className="AOD_filters">
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="1">Last 1 Month</option>
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div className="AOD_chart_container">
        {renderChart(type, dataArr, label)}
      </div>
    </div>
  );

  return (
    <div className="AOD_dashboard">
      <h2 className="AOD_title">Animal Overview Dashboard</h2>
      <div style={{display:'flex',minHeight:'100vh', width:'100%', gap:'20px', justifyContent:'space-around'}}>
        <div style={{ width:'50%',}}>
          <Section
          title="Applications Received"
          period={appsPeriod}
          setPeriod={setAppsPeriod}
          type={appsType}
          setType={setAppsType}
          dataArr={baseData.applications}
          label="Applications"
          
          />
        </div>
        <div style={{display:'grid', gridTemplateRows:'1fr,1fr', width:'50%', gap:'20px'}}>
          <Section
            title="Animals Adopted"
            period={adoptPeriod}
            setPeriod={setAdoptPeriod}
            type={adoptType}
            setType={setAdoptType}
            dataArr={baseData.adopted}
            label="Adopted"
            
          />

          <Section
            title="Animals Rescued"
            period={rescuePeriod}
            setPeriod={setRescuePeriod}
            type={rescueType}
            setType={setRescueType}
            dataArr={baseData.rescued}
            label="Rescued"
          />
        </div>
      </div>
            
    </div>
  );
}


function OneApplication({clickedApplication,setShowApplicationDetails }){
  
  const handleApplicationDecision = (decision) => {
    clickedApplication.status = decision;
    try {
      Axios.put(`http://localhost:3001/adoptionApplication/api/adoptionApplications/${clickedApplication.applicationID}`, {
        status: decision,
      });
      
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
    setShowApplicationDetails(false);
  }
  return(
    <div >
      <div className="" style={{position:'fixed', left:'0', top:'0', width:'100vw', height:'100vh', backdropFilter:'blur(5px)', backgroundColor:'rgba(0,0,0,0.1)', cursor:'pointer'}} onClick={() => setShowApplicationDetails(false)}></div>
      <div className='AOD_one_application_container' onClick={(e) => e.stopPropagation()}>
          <div className='AOD_header_container'>
          <h2>Application from {clickedApplication?.applicantName}</h2>
          </div>        
          <div style={{padding:'20px'}}>
            {/* Personal Info */}
            <div className="AOD_section_oneapp">
              <h3 className="AOD_section_title_oneapp">Personal Information</h3>
              <div className="AOD_info_grid">
                <div className="AOD_info_item"><span>Name:</span> {clickedApplication?.full_name}</div>
                <div className="AOD_info_item"><span>Email:</span> {clickedApplication?.email_address}</div>
                <div className="AOD_info_item"><span>Phone:</span> {clickedApplication?.phone_number}</div>
                <div className="AOD_info_item"><span>Address:</span> {clickedApplication?.address}</div>
                <div className="AOD_info_item"><span>DOB:</span> {new Date(clickedApplication?.dob).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Household Info */}
            <div className="AOD_section_oneapp">
              <h3 className="AOD_section_title_oneapp">Household Information</h3>
              <div className="AOD_info_grid">
                <div className="AOD_info_item"><span>Residence:</span> {clickedApplication?.residence_type}</div>
                <div className="AOD_info_item"><span>Ownership:</span> {clickedApplication?.ownership_status}</div>
                <div className="AOD_info_item"><span>Members:</span> {clickedApplication?.household_members}</div>
                {clickedApplication?.children?.length > 0 && (
                  <div className="AOD_info_item">
                    <span>Children:</span>
                    {clickedApplication.children.map((c, idx) => (
                      <span key={idx} className="AOD_badge"><i className='fa fa-child' style={{marginRight: '10px'}}></i>{c.value} {c.type}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pet History */}
            <div className="AOD_section_oneapp">
              <h3 className="AOD_section_title_oneapp">Pet History</h3>
              <div className="AOD_info_grid">
                <div className="AOD_info_item"><span>Current Pets:</span> {clickedApplication?.current_pets}</div>
                {clickedApplication?.pets?.length > 0 && (
                  <div className="AOD_info_item">
                    <span>Pets:</span>
                    {clickedApplication.pets.map((p, idx) => (
                      <span key={idx} className="AOD_badge"><i className='fa fa-paw' style={{marginRight: '5px'}}></i>{p.type}: {p.value}</span>
                    ))}
                  </div>
                )}
                <div className="AOD_info_item"><span>Vaccinated:</span> {clickedApplication?.vaccination_status}</div>
                <div className="AOD_info_item"><span>Past Pets:</span> {clickedApplication?.past_pets || "None"}</div>
              </div>
            </div>

            {/* Lifestyle & Care */}
            <div className="AOD_section_oneapp">
              <h3 className="AOD_section_title_oneapp">Lifestyle & Care</h3>
              <p className="AOD_paragraph"><span>Reason for Adoption:</span> {clickedApplication?.adoption_reason}</p>
              <p className="AOD_paragraph"><span>Pet Environment:</span> {clickedApplication?.pet_environment}</p>
              <p className="AOD_paragraph"><span>Alone Hours:</span> {clickedApplication?.alone_hours}</p>
              <p className="AOD_paragraph"><span>Backup Caretaker:</span> {clickedApplication?.backup_caretaker}</p>
            </div>

            {/* Notes */}
            {clickedApplication?.additional_notes && (
              <div className="AOD_section_oneapp">
                <h3 className="AOD_section_title_oneapp">Additional Notes</h3>
                <p className="AOD_paragraph">{clickedApplication.additional_notes}</p>
              </div>
            )}
            {/* Agreement Confirmation Box */}
            <div className="AOD_agreement_box_oneapp">
              {/* The checkmark icon */}
              <div className="AOD_agreement_icon_oneapp">
                {/* This would be an icon component or character (e.g., Unicode checkmark, or an icon library like Font Awesome) */}
                {/* Using a simple Unicode checkmark as a placeholder for the icon component */}
                &#10003;
              </div>
              {/* The confirmation text */}
              <p className="AOD_agreement_text_oneapp">
                I confirm that all information provided is accurate and complete. I understand that providing false information may result in my application being rejected. I agree to a home visit as part of the adoption process and to follow all adoption policies established by the shelter.
              </p>
            </div>

           
          </div>
           {/* Agreement */}
          {/* Action Footer Bar */}

           {clickedApplication.status === 'Approved' && 
           <div className="AOD_action_footer" >
                {/* Status Indicator (Left side) */}
                <div className="AOD_status_indicator " style={{color:'blue'}}>
                    {/* The green dot is created via CSS ::before */}
                    <i className='fa fa-check-circle' style={{ color: 'blue' ,marginRight: '10px'}}></i>
                    Application {clickedApplication.status}
                </div>
            </div>
           }
           {clickedApplication.status === 'Declined' && 
           <div className="AOD_action_footer">
                {/* Status Indicator (Left side) */}
                <div className="AOD_status_indicator" style={{color:'red'}}>
                  <i className='fa fa-times-circle' style={{ color: 'red' ,marginRight: '10px'}}></i>
                    {/* The green dot is created via CSS ::before */}
                    Application {clickedApplication.status}
                </div>
            </div>
           }
           {clickedApplication.status === 'Pending' &&
           <div className="AOD_action_footer">
                
                {/* Status Indicator (Left side) */}
                <div className="AOD_status_indicator pending">
                    {/* The green dot is created via CSS ::before */}
                    Application Under Review
                </div>

                {/* Action Buttons (Right side) */}
                <div className="AOD_action_buttons_oneapp">
                    <button className="AOD_button_oneapp decline" onClick={() => handleApplicationDecision('Declined')}>Decline</button>
                    <button className="AOD_button_oneapp approve" onClick={() => handleApplicationDecision('Approved')}>Approve</button>
                </div>
            </div>}
            
        </div>
    </div>
    
  )
}