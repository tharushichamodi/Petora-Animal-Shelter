import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate } from 'react-router-dom';


import "./css/training_coordinator_dashboard.css";
import "./css/training_packages.css";
import "./css/add_training_package.css";

import petImg from "./images/cat.png";

import { Profile, Header } from "./animal_manager_dashboard";
import SearchPetsByUserEmail from "./pet_profiles";
import Axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { Navigate } from "react-router-dom";

// ---------------- Coordinator UI ----------------
function CoordinatorUI() {
  const [dashboardContent, setDashboardContent] = useState("Profile");
  const [selectedSection, setSelectedSection] = useState("Profile");
  let userID = 0;
  const handleDashboardContentChange = (content) => {
    setDashboardContent(content);
    setSelectedSection(content);
  };

  const[coordiSelectedPkg, setCoordiSelectedPkg] = useState(null)

  return (
    <div className="dashboard_container">
      <link  rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>

      <div className="DB dashboard_header_cont">
        <Header />
      </div>

      <div className="sidebar_cont" style={{ marginTop: "50px" }}>
        <div className="sidebar">
          <h2 className="sidebar_logo">Petora</h2>
          <ul className="sidebar_menu">
            <li
              onClick={() => handleDashboardContentChange("Profile")}
              className={selectedSection === "Profile" ? "selected" : ""}
            >
              Dashboard
            </li>
            <li
              onClick={() => handleDashboardContentChange("Register Pet")}
              className={selectedSection === "Register Pet" ? "selected" : ""}
            >
              Session Booking
            </li>
            <li
              onClick={() => handleDashboardContentChange("Training Bootcamps")}
              className={selectedSection === "Training Bootcamps" ? "selected" : ""}
            >
              Training Bootcamps
            </li>
            <li
              onClick={() => handleDashboardContentChange("View Bookings")}
              className={selectedSection === "View Bookings" ? "selected" : ""}
            >
              View Bookings
            </li>
            
            <li
              onClick={() => handleDashboardContentChange("Cage Tracker")}
              className={selectedSection === "Cage Tracker" ? "selected" : ""}
            >
              Cage Tracker
            </li>
          </ul>
        </div>
      </div>

      {/* Render Content */}
      {dashboardContent === "Profile" && <Profile />}
      {dashboardContent === "Register Pet" && 
            <div className="TCD coordinator_content">
              <div className="TCD coordinator_card">

                <RegisterPet coordiSelectedPkg={coordiSelectedPkg} cd = {false} userID={userID} />
              </div> 
            </div>
    }
      {dashboardContent === "Training Bootcamps" && <TrainingPackages handleDashboardContentChange={handleDashboardContentChange} setCoordiSelectedPkg={setCoordiSelectedPkg} />}
      {dashboardContent === "View Bookings" && <CoordinatorBookings />}
    </div>
  );
}

export default CoordinatorUI;

// ---------------- RegisterPet ----------------
export function RegisterPet({coordiSelectedPkg, cd, userID}) {
  useEffect(() => {
    console.log(userID);
  }, []);
  const [formData, setFormData] = useState({
    animalName: "",
    breed: "",
    age: "",
    ownerName: "",
    ownerEmail: "",
    date: "",
    time: "",
    trainingProgram: "",
    trainer: "",
    bootcamp: "",
    bootcampName: "",
    bootcampDate: "",
    bootcampTime: "",
    reportType: "",
    trainingGuide: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalName: formData.animalName,
          breed: formData.breed,
          ownerName: formData.ownerName,
          date: formData.date,
          time: formData.time,
          trainingProgram: formData.trainingProgram,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to add booking");

      alert("Booking submitted successfully ✅");
      setFormData({
        animalName: "",
        breed: "",
        age: "",
        ownerName: "",
        ownerEmail:"",
        date: "",
        time: "",
        trainingProgram: "",
        trainer: "",
        bootcamp: "",
        bootcampName: "",
        bootcampDate: "",
        bootcampTime: "",
        reportType: "",
        trainingGuide: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error submitting booking ❌");
    }
  };

  // slot booking
  const minDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState("")
  const [time, setTime] = useState("");
  
  const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // pet selection
  const [pets, setPets] = useState([]);
  const[selectedPet, setSelectedPet] = useState(null)
  const[changePet, clickChangePet] = useState(false)
  const  handleClickPetChange  = () =>{
    clickChangePet(true)
  }
  
  //package selection

    const [showPackages, setShowPackages] = useState(false);
    
    const [packageSearch, setPackageSearch] = useState("");    
    const [selectedPackage, setSelectedPackage] = useState(coordiSelectedPkg);

    const [trainingPackages, setTrainingPackages] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get employees
      const trainingPackagesRes = await Axios.get('http://localhost:3001/trainingPackage/api/trainingPackages');
      setTrainingPackages(trainingPackagesRes.data);

    } catch (error) {
      console.error("Error fetching training packages:", error);
      
    }
  };

  fetchData();
}, []);


  // Function to render stars as <i> tags
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star_full_${i}`} className="fas fa-star TCD_rating_star TCD-star_full"></i>);
    }

    // Add remaining empty stars to make 5 total
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`star_empty_${i}`} className="far fa-star TCD_rating_star TCD_star_empty"></i>);
    }

    return (
      <span className="TCD_rating_stars_container">
        {stars}
        <span className="TCD_rating_number">{score.toFixed(1)}</span>
      </span>
    );
  };
  
    // trainer selection
    const [trainerSearch, setTrainerSearch] = useState("")
    const [showTrainers, setShowTrainers] = useState(null)
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [ratingFilter, setRatingFilter] = useState(null)
    const [trainersData, setTrainersData] = useState([]);
    const [filteredTrainers, setFilterdTrainers] = useState([])

    

useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get employees
      const empRes = await Axios.get('http://localhost:3001/employee/api/employees');
      const employees = empRes.data;

      // Filter only trainers from employees
      const trainerEmployees = employees.filter(emp => emp.role === "Trainer");

      // 2️⃣ Get trainers
      const trainerRes = await Axios.get("http://localhost:3001/trainer/api/trainers");
      const trainerStats = trainerRes.data;

      // 3️⃣ Merge data
      const merged = trainerEmployees.map(emp => {
        const stats = trainerStats.find(t => t.userID === emp.userID) || {};

        return {
          id: emp.empID,
          name: `${emp.firstName} ${emp.LastName}`,
          role: emp.role,
          img: emp.profilePic || "",
          experience: stats.experience || 0,
          ratings: stats.ratings || 0,
          completedSessions: stats.completedSessions || 0,
          completedTrainings: stats.completedTrainings || 0,
          availability: stats.availability ?? true, // default true if undefined
        };
      });

      setTrainersData(merged);      
      setFilterdTrainers(merged);

    } catch (error) {
      console.error("Error fetching trainers/employees:", error);
      
    }
  };

  fetchData();
}, []);

    useEffect(() => {
      let filtered = trainersData;
      if (trainerSearch) {
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(trainerSearch.toLowerCase())
        );
      }
      
      setFilterdTrainers(filtered);

    }, [trainerSearch, ratingFilter]);

    useEffect(() => {
      if(ratingFilter === "all"){
        setFilterdTrainers(trainersData)
      }
      else if(ratingFilter >= 4.8){
        const filtered = trainersData.filter(t => t.ratings >= 4.8);
        setFilterdTrainers(filtered);
      }
      else if(ratingFilter >= 4.5){
        const filtered = trainersData.filter(t => t.ratings >= 4.5);
        setFilterdTrainers(filtered);
      }
      else if(ratingFilter >= 4){
        const filtered = trainersData.filter(t => t.ratings >= 3);
        setFilterdTrainers(filtered);
      }
      else if(ratingFilter >= 3.5){
        const filtered = trainersData.filter(t => t.ratings >= 3.5);
        setFilterdTrainers(filtered);
      }
      else if(ratingFilter >= 3){
        const filtered = trainersData.filter(t => t.ratings >= 3);
        setFilterdTrainers(filtered);
      }
      else{
        setFilterdTrainers(trainersData)
      }


    }, [ratingFilter]);

    // package handle
      const [petTypeFilter, setPetTypeFilter] = useState(null);

      // booking details
    const[customerUserID, setCustomerUserID] = useState(0)
    const[customerEmail , setCustomerEmail] = useState("")

    useEffect(() => {
      const fetchData = async () => {
      try {
        // 1️⃣ Get employees
        const response = await Axios.get('http://localhost:3001/user/api/users');
        const users = response.data; // Axios returns { data, status, ... }

        // 2️⃣ Find the user with matching email
        if(userID === 0)
        {const customer = users.find(user => user.userEmail === customerEmail);

        // 3️⃣ Update state
        if (customer) {
          setCustomerUserID(customer.userID);
        } else {
          console.warn('No user found with this email:', customerEmail);
        }}
        else{
          setCustomerUserID(userID)
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [customerEmail]);

      
    
    const [showConfirmation, setShowConfirmation] = useState(false)
    const handleBookNow = () => {
        setShowConfirmation(true)
        setShowOverlay(true)
    };
const [isOnlinePayment, setIsOnlinePayment] = useState(true)
const navigate = useNavigate();

const handleConfirmation =  (isOnlinePayment) => {
  setIsOnlinePayment(isOnlinePayment);
  sendDataToBackEnd();
  if(isOnlinePayment && !booking){
    navigate('/payment_portal')
  }
  setShowConfirmation(false);
  setShowOverlay(false);
  // Proceed with payment logic
};
const sendDataToBackEnd = async () => {
  try {
        if (!booking) {
          console.error("Booking data is missing!");
          return;
        }
        console.log(booking)
        const res = await Axios.post(
          "http://localhost:3001/trainingBooking/api/trainingBookings",
          booking
        );

        if (res.status === 201) {
          console.log("Booking successful:", res.data);
          alert("✅ Booking successful! Your training session is confirmed.");
          // Optionally reset state or redirect
          // setBooking(null);
        }
        setSelectedPackage(null)
        setSelectedTrainer(null)
        setSelectedPet(null)
        

      } catch (error) {
        console.error("Error Booking:", error);
        alert("❌ Failed to book training session. Please try again later.");
      }
}
const [booking, setBooking] = useState({
        userID:0,
        date:'',
        time:'',
        packageID:0,
        trainerID:0,
        petID:0,
        paymentDone:false
      })
      useEffect(() => {
        console.log("this run")
        console.log(selectedTrainer,selectedPackage,selectedPet)
      if (selectedTrainer && selectedPackage && selectedPet) {
        console.log("this is running")
        setBooking({
          userID: customerUserID, // set your actual userID here
          date: date || '',
          time: time || '',
          packageID: selectedPackage.trainingPackageID,
          trainerID: selectedTrainer.id,
          petID: selectedPet.petID,
          paymentDone: isOnlinePayment
        });
      }
    }, [selectedTrainer, selectedPackage, selectedPet, date, time, isOnlinePayment]);
    
      // handle overlay
    const [showOverlay, setShowOverlay] = useState(false) 
      
      
    
  return (
        <div className="training_reservation_container">
        {/* HEADER */}
        <header className="training_reservation_header">
          <h1 className="training_title">Training Bootcamp Booking</h1>          
        </header>
        <div style={{width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'center', marginBottom:'10px'}}>
          <button className="AP_adopt_now_btn" style={{margin:'0'}} onClick={handleBookNow} >Book Now</button>
        </div>

        
        {/* GRID */}
        <div className="training_grid">
          {/* Pet & Schedule */}
          <section className="training_card">
            <h3 className="training_section_title">1) Slot Booking</h3>
            {/* <div className="training_field">
              <label className="training_label">Pet</label>
              <select value={petId} onChange={(e) => setPetId(e.target.value)} className="training_select">
                <option value="">— Select pet —</option>
                {PETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} • {p.species}
                  </option>
                ))}
              </select>
              {errors.petId && <span className="training_error">{errors.petId}</span>}
            </div> */}

            <div className="training_row">
              <div className="training_field">
                <label className="training_label">Date</label>
                <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="training_input" />
              </div>
              <div className="training_field">
                <label className="training_label">Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="training_select">
                  <option value="">— Select time —</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            
          </section>

          {/* Package & triner Sections */}
          <section className="training_card">
            <h3 className="training_section_title">2) Package</h3>
            {selectedPackage ? (
              <div className="training_selected_box" style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', border:'none'}} >
                
                <div style={{width:'100%', display:'flex', justifyContent:'flex-end', marginBottom:'10px'}}>
                  <button className="training_link_btn" onClick={() => setShowPackages(true)} style={{backgroundColor:'rgba(0, 0, 0, 1)', color:'white', border:'2px solid black'}}>Change</button>
                </div>
                <div className="TCD package_card" key={selectedPackage.packageID} onClick={() => setShowPackages(true)}>
                {/* 1. Image Section */}
                <div className="TCD package_card_image_container">
                  <img src={`http://localhost:3001/uploads/${selectedPackage.img.trim()}`} alt={selectedPackage.name} className="TCD package_card_image" />
                  {/* Creative addition: Price badge overlay */}
                  <div className="TCD package_card_price_badge">
                    <i className="fas fa_tag TCD icon_tag"></i>
                    <span className="TCD price_text">${selectedPackage.price}</span>
                  </div>
                </div>

                {/* 2. Content Section */}
                <div className="TCD package_card_content">

                  {/* Name and Rating/Reviews */}
                  <h3 className="TCD package_card_name">{selectedPackage.name}</h3>

                  <div className="TCD package_card_meta">
                    <div className="TCD package_card_rating">
                      {renderStars(selectedPackage.ratings)}
                      <span className="TCD review_count">({selectedPackage.noOfRatings} reviews)</span>
                    </div>
                    {selectedPackage.duration && (
                      <div className="TCD package_card_duration">
                        <i className="fas fa-clock TCD icon_clock" style={{color:''}}></i>
                        <span>{selectedPackage.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Description (Limited to 3 rows by CSS later) */}
                  <p className="TCD package_card_description">
                    {selectedPackage.description}
                    {/* Creative addition: "more..." link for full description */}
                    <a href="#" className="TCD description_read_more" aria_label={`Read more about ${selectedPackage.name}`}>...more</a>
                  </p>
                  
                </div>
                
                </div>
              </div>
            ) : (
              <div className="training_empty_box">
                No package selected.
                <button className="training_link_btn" onClick={() => setShowPackages(true)}>Change Package</button>
              </div>
            )}
          </section>

          <section className="training_card">
            <h3 className="training_section_title">3) Trainer Preference</h3>
            {selectedTrainer ? (
              <div className="training_selected_box" style={{display:'flex',flexDirection:'column',width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'transparent', border:'none', boxShadow:'none', padding:'0',}}>
                <div style={{width:'100%', display:'flex', justifyContent:'flex-end', marginBottom:'10px'}}>
                  <button className="training_link_btn" onClick={() => setShowTrainers(true)} style={{backgroundColor:'rgba(0, 0, 0, 1)', color:'white', border:'2px solid black'}}>Change</button>
                </div>
                <div className="animal_card" style={{height:'60vh', width:'20vw'}} key={selectedTrainer.trainerID} onClick={() => setShowTrainers(true)}>
                    <div className="animal_card_content">
                      <img src={`http://localhost:3001/uploads/${selectedTrainer.img.trim()}`} alt="Trainer" />
                      <div className="cato_fav">
                      <h2 className="animal_Category" style={{fontSize:"20px"}}  >
                          {selectedTrainer.name}
                          <span className="breed"> / {selectedTrainer.role}</span>
                      </h2>
                      
                      </div>

                      <p
                      className="age"
                      style={{
                          color: "#929292",
                          textAlign: "left",
                          width: "100%",
                          fontSize: "14px",
                      }}
                      >
                      Experience:{" "}
                      <span
                          style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#000000ff",
                          width: "100%",
                          textAlign: "left",
                          }}
                      >
                          {selectedTrainer.experience} Years
                      </span>
                      </p>
                      
                      <hr className="animal_card_divider"></hr>
                      <div className="animal_card_footer">
                      <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
                          <i class="fa-solid fa-user" 
                          style={{ color: "rgb(255, 145, 0)" }}
                          ></i>{" "}
                          <div style={selectedTrainer.availability ? {backgroundColor:'rgba(255, 155, 40, 1)', color:"black", padding:'2px 5px', borderRadius:'5px', textAlign:'center',} : {backgroundColor:'lightgray', color:"gray", padding:'2px 5px', borderRadius:'5px', textAlign:'center'}}>
                            {selectedTrainer.availability? "Active" : "Inactive"}
                          </div>
                          
                      </span>
                      <span>
                          <i
                          style={{ color: "rgb(255, 145, 0)" }}
                          className="fas fa-list-alt"
                          ></i>{" "}
                          {selectedTrainer.completedSessions}
                      </span>
                      <span>
                          <i
                          style={{ color: "rgb(255, 145, 0)" }}
                          className="fas fa-clock"
                          ></i>{" "}
                          {selectedTrainer.completedTrainings}
                      </span>
                      </div>
                  </div>

              <div className='mem_availability' style={{top:'-5px', right:'30px', left:'auto', position:'absolute', backgroundColor:'rgb(255, 145, 0)', padding:'5px 10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)', display:'flex', alignItems:'flex-end', gap:'10px', cursor:'pointer', height:'80px'}}>
                <h2 style={{ margin: '0', fontSize:'16px' }}>{selectedTrainer.ratings}<i className="fas fa-star" style={{ color: "gold", marginLeft: '5px' }}></i></h2>
              </div>
                </div>
            </div>
        
            ) : (
              <div className="training_empty_box" >
                No trainer selected.
                <button className="training_link_btn" onClick={() => setShowTrainers(true)}>Select Trainer</button>
              </div>
            )}
          </section>
          { !cd &&
          <section className="training_card">
              <h3 className="training_section_title">4) Select Your Pet</h3>
              <SearchPetsByUserEmail setCustomerEmail={setCustomerEmail} setSelectedPet={setSelectedPet} />
              
            </section>
          
          }{ cd &&
            <section className="training_card">
              <h3 className="training_section_title">4) Select Your Pet</h3>
              {selectedPet && 
              <div style={{marginBottom:'20px'}}>
                <h5>Selected Pet</h5>
                <div key={selectedPet.id} onClick={() => setSelectedPet(null)} style={{display:'flex', justifyContent:'flex-start', alignContent:'center', gap:'10px', cursor:'pointer', border:'1px solid rgba(133, 133, 133, 0.1)', padding:'5px', borderRadius:'10px'}}>
                  <img style={{width:'30px', height:'30px', objectFit:'cover', borderRadius:'50%'}} src={getFirstImage(selectedPet)} alt="Pet" />
                  <span>{selectedPet.name}</span>
                  <span>{selectedPet.species}</span>
                  <span>{selectedPet.breed}</span>
                  <h6 style={{color:'red', margin:'0',padding:'0'}}>*Click to remove</h6>
                </div>
              </div>
                
              }
              <DisplayMyPets setSelectedPet={setSelectedPet} userID={userID}/>
            </section>
          }

        </div>

        {/* PACKAGE OVERLAY */}
        {showPackages && (
          <div className="training_overlay" style={{backdropFilter: "blur(5px)"}} onClick={() => setShowPackages(false)}>
            <div className="training_overlay_box" style={{width:'90%',}} onClick={(e) => e.stopPropagation()}>
              <div className="training_overlay_content">
                <h3>Select a Package</h3>
                <input
                  type="text"
                  placeholder="Search package..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  className="training_input"
                />
                <div className="training_filter_row" style={{display:'flex', gap:'10px',}}>
                  <button className="TCD filterBtns"  onClick={() => setPetTypeFilter("all")} style={{backgroundColor: petTypeFilter === 'all' ? 'black' : '', color: petTypeFilter === 'all' ? 'white' : ''}}>All</button>
                  <button className="TCD filterBtns"  onClick={() => setPetTypeFilter('cat')} style={{backgroundColor: petTypeFilter === 'cat' ? 'black' : '', color: petTypeFilter === 'cat' ? 'white' : ''}}>Cats</button>
                  <button className="TCD filterBtns"  onClick={() => setPetTypeFilter('rabbit')} style={{backgroundColor: petTypeFilter === 'rabbit' ? 'black' : '', color: petTypeFilter === 'rabbit' ? 'white' : ''}}>Rabbits</button>
                  <button className="TCD filterBtns"  onClick={() => setPetTypeFilter('bird')} style={{backgroundColor: petTypeFilter === 'bird' ? 'black' : '', color: petTypeFilter === 'bird' ? 'white' : ''}}>Birds</button>
                  <button className="TCD filterBtns"  onClick={() => setPetTypeFilter('dog')} style={{backgroundColor: petTypeFilter === 'dog' ? 'black' : '', color: petTypeFilter === 'dog' ? 'white' : ''}}>Dogs</button>
                </div>
                
                  <PrintAllPackages packageSearch={packageSearch} petTypeFilter={petTypeFilter} setShowPackages={setShowPackages} setSelectedPackage={setSelectedPackage} />
                             
                <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><button className="TCD formSubmitBtm" onClick={() => setShowPackages(false)}>Close</button></div>
                
              </div>
            </div>
          </div>
        )}

        {/* GROOMER OVERLAY */}
        {showTrainers && (
          <div className="training_overlay" style={{backdropFilter: "blur(5px)"}} onClick={() => setShowTrainers(false)}>
            <div className="training_overlay_box" style={{width:'90%',}} onClick={(e) => e.stopPropagation()}>
              <div className="training_overlay_content">
                <h3>Select a Trainer</h3>
                <input
                  type="text"
                  placeholder="Search trainer..."
                  value={trainerSearch}
                  onChange={(e) => setTrainerSearch(e.target.value)}
                  className="training_input"
                />
                <div className="training_filter_row" style={{display:'flex', gap:'10px',}}>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter("all")}>All</button>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter(4.8)} style={{backgroundColor: ratingFilter === 4.8 ? 'black' : '', color: ratingFilter === 4.8 ? 'white' : ''}}>4.8+</button>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter(4.5)} style={{backgroundColor: ratingFilter === 4.5 ? 'black' : '', color: ratingFilter === 4.5 ? 'white' : ''}}>4.5+</button>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter(4)} style={{backgroundColor: ratingFilter === 4 ? 'black' : '', color: ratingFilter === 4 ? 'white' : ''}}>4+</button>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter(3.5)} style={{backgroundColor: ratingFilter === 3.5 ? 'black' : '', color: ratingFilter === 3.5 ? 'white' : ''}}>3.5+</button>
                  <button className="TCD filterBtns"  onClick={() => setRatingFilter(3)} style={{backgroundColor: ratingFilter === 3 ? 'black' : '', color: ratingFilter === 3 ? 'white' : ''}}>3+</button>
                </div>

                <TrainerList trainersData={filteredTrainers} setSelectedTrainer={setSelectedTrainer} setShowTrainers={setShowTrainers}/>
                <div style={{width:'100%', display:'flex', justifyContent:'center', marginTop:'20px'}}>
                  <button className="TCD formSubmitBtm" onClick={() => setShowTrainers(false)}>Close</button>
                </div>
                
              </div>
            </div>
          </div>
        )} 
        {(showConfirmation &&
        <div>
          <div style={{width:'50vw', height:'fit-content', backgroundColor:'white', borderRadius:'20px', position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', boxShadow:'0 4px 8px rgba(0,0,0,0.2)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'20px', padding:'20px', zIndex:'1000'}}>
            <h2>Do you Want to Proceed?</h2>
            <p>You can conveniently complete your payment through our secure online payment portal. This ensures your adoption process is confirmed instantly.
Alternatively, you may also choose to make your payment in person when you visit our shelter. We’re happy to assist you either way!</p>
            <div width='100%' style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'}}>
              <button className="TCD formSubmitBtm" style={{width:'150px'}} onClick={() =>handleConfirmation(true)}>Pay Now</button>
              <button className="TCD formSubmitBtm" style={{width:'150px', backgroundColor:'white', color:'black'}} onClick={() =>handleConfirmation(false)}>Pay at Shelter</button>
            </div>
          </div>
        </div>
        )}       
        </div>

      
  );
}

function TrainerList({trainersData,setSelectedTrainer,setShowTrainers}){
  const [showOverlay, setShowOverlay] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleOverlay = () => {
    setShowOverlay(!showOverlay)
    setShowForm(!showForm)
  }


const [loading, setLoading] = useState(true);

useEffect(() => {
  if (trainersData.length) {
    setLoading(false);
  }
}, [trainersData]);

if (loading) return <div>Loading trainers...</div>;
if (!trainersData.length) return <div>No trainers found.</div>;
const handleOnClickTrainer = (trainer) => {
  setShowTrainers(false)
  setSelectedTrainer(trainer);
}
  return(

    <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',padding:'20px',width:'100%', }} >
      <div><h3>Trainers List</h3></div>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px', width:'100%'}}>
      
      {trainersData.map((trainer, index) => (
      <div className="animal_card" style={{height:'60vh', width:'20vw'}} key={index} onClick={() => handleOnClickTrainer(trainer)}>
        <div className="animal_card_content">
                    <img src={`http://localhost:3001/uploads/${trainer.img.trim()}`} alt="Trainer" />
                    <div className="cato_fav">
                    <h2 className="animal_Category" style={{fontSize:"20px"}}  >
                        {trainer.name}
                        <span className="breed"> / {trainer.role}</span>
                    </h2>
                    
                    </div>

                    <p
                    className="age"
                    style={{
                        color: "#929292",
                        textAlign: "left",
                        width: "100%",
                        fontSize: "14px",
                    }}
                    >
                    Experience:{" "}
                    <span
                        style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#000000ff",
                        width: "100%",
                        textAlign: "left",
                        }}
                    >
                        {trainer.experience} Years
                    </span>
                    </p>
                    
                    <hr className="animal_card_divider"></hr>
                    <div className="animal_card_footer">
                    <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
                        <i class="fa-solid fa-user" 
                        style={{ color: "rgb(255, 145, 0)" }}
                        ></i>{" "}
                        <div style={trainer.availability ? {backgroundColor:'rgba(255, 155, 40, 1)', color:"black", padding:'2px 5px', borderRadius:'5px', textAlign:'center',} : {backgroundColor:'lightgray', color:"gray", padding:'2px 5px', borderRadius:'5px', textAlign:'center'}}>
                          {trainer.availability? "Active" : "Inactive"}
                        </div>
                        
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-list-alt"
                        ></i>{" "}
                        {trainer.completedSessions}
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-clock"
                        ></i>{" "}
                        {trainer.completedTrainings}
                    </span>
                    </div>
                </div>

            <div className='mem_availability' style={{top:'-5px', right:'30px', left:'auto', position:'absolute', backgroundColor:'rgb(255, 145, 0)', padding:'5px 10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)', display:'flex', alignItems:'flex-end', gap:'10px', cursor:'pointer', height:'80px'}}>
              <h2 style={{ margin: '0', fontSize:'16px' }}>{trainer.ratings}<i className="fas fa-star" style={{ color: "gold", marginLeft: '5px' }}></i></h2>
            </div>
      </div>
      ))}
      </div>
    </div>

    
  )
}


export function TrainingPackages({handleDashboardContentChange,setCoordiSelectedPkg}) {
    
  const packageSearch = null
  const petTypeFilter =null
  
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAddPackageForm, setShowAddPackageForm] = useState(false)

  const [selectedPackage, setSelectedPackage] = useState(null)
  const[showPackages, setShowPackages] = useState(false)

  const handleAddPackageOnClick = () =>{
    setShowOverlay(!showOverlay)
    setShowAddPackageForm(!showAddPackageForm)
  }
useEffect(() =>{
  if(selectedPackage){
    handleDashboardContentChange("Register Pet")
    setCoordiSelectedPkg(selectedPackage)
  }
  
  

},[selectedPackage])

  return (
    <div className="TCD coordinator_content">
      {
        showOverlay &&
        <div className="training_overlay" style={{backdropFilter:'blur(5px)'}} onClick={handleAddPackageOnClick}></div>
      }
      
      <div className="TCD coordinator_card" style={{width:'100%'}}>
      <h3>Training Bootcamps</h3>
      <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}><button className="AP_adopt_now_btn" style={{margin:'0'}} onClick={handleAddPackageOnClick}>Add Package</button></div>
      
      <PrintAllPackages packageSearch = {packageSearch} petTypeFilter={petTypeFilter} setSelectedPackage={setSelectedPackage} setShowPackages={setShowPackages}/>

      </div>
      {
        showAddPackageForm &&
        <AddTrainingPackageForm onClose={handleAddPackageOnClick} />
        
      }
      
    </div>
  );
}

function PrintAllPackages({packageSearch, petTypeFilter, setShowPackages,setSelectedPackage}){
  const [trainingPackages, setTrainingPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  

  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get employees
      const trainingPackagesRes = await Axios.get('http://localhost:3001/trainingPackage/api/trainingPackages');
      setTrainingPackages(trainingPackagesRes.data);
      setFilteredPackages(trainingPackagesRes.data)
    } catch (error) {
      console.error("Error fetching training packages:", error);
      
    }
  };

  fetchData();
}, []);

useEffect(() => {
      let filtered = trainingPackages;

      if (packageSearch) {
        const terms = packageSearch.trim()
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean); // remove empty words

        filtered = filtered.filter(t =>
          terms.every(word =>
            (t.name + ' ' + (t.description || '')).toLowerCase().includes(word)
          )
        );
      }
      
      setFilteredPackages(filtered);
    }, [packageSearch, petTypeFilter]);

    useEffect(() => {
      if(petTypeFilter === "dog"){
        const filtered = trainingPackages.filter(t => t.petType === "Dog");
        setFilteredPackages(filtered)
      }
      else if(petTypeFilter === "cat"){
        const filtered = trainingPackages.filter(t => t.petType === "Cat");
        setFilteredPackages(filtered);
      }
      else if(petTypeFilter === "rabbit"){
        const filtered = trainingPackages.filter(t => t.petType === "Rabbit");
        setFilteredPackages(filtered);
      }
      else if(petTypeFilter === "bird"){
        const filtered = trainingPackages.filter(t => t.petType  === "Bird");
        setFilteredPackages(filtered);
      }else if(petTypeFilter === "all"){
        setFilteredPackages(trainingPackages);
      }
      
      else{
        setFilteredPackages(trainingPackages)
      }


    }, [petTypeFilter]);

  // Function to render stars as <i> tags
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star_full_${i}`} className="fas fa-star TCD_rating_star TCD-star_full"></i>);
    }

    // Add remaining empty stars to make 5 total
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`star_empty_${i}`} className="far fa-star TCD_rating_star TCD_star_empty"></i>);
    }

    return (
      <span className="TCD_rating_stars_container">
        {stars}
        <span className="TCD_rating_number">{score.toFixed(1)}</span>
      </span>
    );
  };
  

  const [showPackageDetails, setShowPackageDetails] = useState(false)
  const [clickedPackage, setClickedPackage] = useState(null)
  useEffect(() =>{
    setShowPackageDetails(true)

  },[clickedPackage])

  return(
    <div>
      <div><h3>Packges for Dogs</h3></div>           
      <PrintPackageCard pkg={filteredPackages} petType={"Dog"} renderStars={renderStars} setSelectedPackage={setSelectedPackage} setClickedPackage={setClickedPackage} setShowPackages={setShowPackages} />            
      

      <div><h3>Packges for Cats</h3></div>      
      <PrintPackageCard pkg={filteredPackages} petType={"Cat"} renderStars={renderStars} setSelectedPackage={setSelectedPackage} setClickedPackage={setClickedPackage} setShowPackages={setShowPackages} />
      

      <div><h3>Packges for Rabbits</h3></div>         
      <PrintPackageCard pkg={filteredPackages} petType={"Rabbit"} renderStars={renderStars} setSelectedPackage={setSelectedPackage}  setClickedPackage={setClickedPackage} setShowPackages={setShowPackages} />
      

      <div><h3>Packges for Birds</h3></div>      
      <PrintPackageCard pkg={filteredPackages} petType={"Bird"} renderStars={renderStars} setSelectedPackage={setSelectedPackage}  setClickedPackage={setClickedPackage} setShowPackages={setShowPackages} />
      {
          showPackageDetails &&
          <ShowPackageDetails clickedPackage={clickedPackage} setShowPackageDetails={setShowPackageDetails} setSelectedPackage={setSelectedPackage} />
        }
    </div>
      
  );
}

function PrintPackageCard({ pkg , petType, renderStars,setSelectedPackage, setClickedPackage, setShowPackages }) {
  const filteredPackages = pkg.filter(p => p.petType === petType);

  const onPackageCardSelect = (pkg) =>{
    setSelectedPackage(pkg)
    setShowPackages(false)
  }
  const onPackagClick = (pkg) =>{
    setClickedPackage(pkg)
        
  }

  return (
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', width:'100%', marginTop:'20px'}}>
        {filteredPackages.length === 0 ? (
          <p>No training packages available.</p>
        ) : (
        filteredPackages.map((pkg) => (
      <div className="TCD package_card" key={pkg.packageID} onClick={() => {onPackagClick(pkg); }}>

        {/* 1. Image Section */}
        <div className="TCD package_card_image_container">
          <img src={`http://localhost:3001/uploads/${pkg.img.trim()}`} alt={pkg.name} className="TCD package_card_image" />
          {/* Creative addition: Price badge overlay */}
          <div className="TCD package_card_price_badge">
            <i className="fas fa_tag TCD icon_tag"></i>
            <span className="TCD price_text">${pkg.price}</span>
          </div>
        </div>

        {/* 2. Content Section */}
        <div className="TCD package_card_content">

          {/* Name and Rating/Reviews */}
          <h3 className="TCD package_card_name">{pkg.name}</h3>

          <div className="TCD package_card_meta">
            <div className="TCD package_card_rating">
              {renderStars(pkg.ratings)}
              <span className="TCD review_count">({pkg.noOfRatings} reviews)</span>
            </div>
            {pkg.duration && (
              <div className="TCD package_card_duration">
                <i className="fas fa-clock TCD icon_clock" style={{color:''}}></i>
                <span>{pkg.duration}</span>
              </div>
            )}
          </div>

          {/* Description (Limited to 3 rows by CSS later) */}
          <p className="TCD package_card_description">
            {pkg.description}
            {/* Creative addition: "more..." link for full description */}
            <a href="#" className="TCD description_read_more" aria_label={`Read more about ${pkg.name}`}>...more</a>
          </p>
          
        </div>
        <div className="TCD package_card_actions">
          <button
            className="TCD package_card_cta_button"
            onClick={() => {onPackageCardSelect(pkg);} }
          >
            <i className="fas fa-shopping-cart TCD icon_cart"></i>
            <span className="TCD cta_text" >Buy Now</span>
          </button>
          
        </div>
        </div>
        ))
        )}
        </div>
  )
}

function ShowPackageDetails({ clickedPackage, setShowPackageDetails,setSelectedPackage }){
  
  if(clickedPackage === null) return null;
  
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star_full_${i}`} className="fas fa-star TCD_rating_star TCD-star_full"></i>);
    }

    // Add remaining empty stars to make 5 total
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`star_empty_${i}`} className="far fa-star TCD_rating_star TCD_star_empty"></i>);
    }

    return (
      <span className="TCD_rating_stars_container">
        {stars}
        <span className="TCD_rating_number">{score.toFixed(1)}</span>
      </span>
    );
  };
    
  return(
    <div className="TCD_overlay" onClick={() => setShowPackageDetails(false)}>
      <div
        className="TCD_package_modal"
        onClick={(e) => e.stopPropagation()} // stop backdrop click
      >
        <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
          <button className="form_close_button" onClick={() => setShowPackageDetails(false)}>
            &times;
          </button>
        </div>
        
        <div className="TCD_modal_header">
          {clickedPackage.img && <img src={`http://localhost:3001/uploads/${clickedPackage.img.trim()}`} alt={clickedPackage.name} className="TCD_modal_img" />}
          <h2 className="TCD_modal_title">{clickedPackage.name}</h2>
        </div>

        <div className="TCD_modal_body">
          <p className="TCD_modal_desc">{clickedPackage.description}</p>

          <div className="TCD package_card_rating">
              {renderStars(clickedPackage.ratings)}
              <span className="TCD review_count">({clickedPackage.noOfRatings} reviews)</span>
            </div>
          
          <div className="TCD_price_duration">
            <span className="TCD_price">Rs. {clickedPackage.price}</span>
            <span className="TCD_duration">{clickedPackage.duration} sessions</span>
          </div>
        </div>

        <div className="TCD_modal_footer">
          <button className="TCD_book_btn" onClick={() => {setSelectedPackage(clickedPackage);setShowPackageDetails(false)}}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

function AddTrainingPackageForm ({onClose}) {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    ratings: "",
    noOfRatings: "",
    petType: "",
    availability: "true",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  // ---------- Handlers ----------
  const handleInputTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      // --- Key line: reset the input so user can re-select same file ---
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return updated;
    });
  };

  const handleAddNewTrainingPackageSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare FormData for multipart upload
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (uploadedFiles[0]) data.append("img", uploadedFiles[0]); // only first image

      const res = await Axios.post(
        "http://localhost:3001/trainingPackage/api/trainingPackages",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200 || res.status === 201) {
        alert("Training package added successfully!");
        onClose && onClose();
      }
    } catch (error) {
      console.error("Error adding training package:", error);
      alert("Failed to add training package. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return(
    <div className="TCD add_package_form" onClick={(e) => e.stopPropagation()}>
    {/* Close Button */}
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <button
        type="button"
        className="form_close_button"
        onClick={onClose}
      >
        <i className="fa-solid fa-close"></i>
      </button>
    </div>

    {/* Heading */}
    <div><h1 style={{ textAlign: 'center' }}>New Training Package</h1></div>

    {/* Package Name */}
    <div className="TCD form_group">
      <label htmlFor="TP_name">Package Name</label>
      <input
        className="TCD_input"
        type="text"
        id="TP_name"
        name="name"
        placeholder="e.g. Puppy Obedience Bootcamp"
        onChange={handleInputTextChange}
      />
    </div>

    {/* Pet Type */}
    <div className="TCD form_group">
      <label htmlFor="TP_petType">Pet Type</label>
      <select
        className="selection"
        id="TP_petType"
        name="petType"
        onChange={handleInputTextChange}
      >
        <option value="">Select</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="rabbit">Rabbit</option>
        <option value="bird">Bird</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Price */}
    <div className="TCD form_group">
      <label htmlFor="TP_price">Price (Rs)</label>
      <input
        className="TCD_input"
        type="number"
        id="TP_price"
        name="price"
        min="0"
        step="0.01"
        onChange={handleInputTextChange}
      />
    </div>

    {/* Duration */}
    <div className="TCD form_group">
      <label htmlFor="TP_duration">Duration</label>
      <input
        className="TCD_input"
        type="text"
        id="TP_duration"
        name="duration"
        placeholder="e.g. 6 weeks"
        onChange={handleInputTextChange}
      />
    </div>

    {/* Description */}
    <div className="TCD form_group">
      <label htmlFor="TP_description">Description</label>
      <textarea
        className="TCD_input textarea"
        id="TP_description"
        name="description"
        placeholder="Brief description of the training program"
        onChange={handleInputTextChange}
      ></textarea>
    </div>

    

    {/* Availability */}
    <div className="TCD form_group">
      <label htmlFor="TP_availability">Availability</label>
      <select
        className="selection"
        id="TP_availability"
        name="availability"
        onChange={handleInputTextChange}
      >
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </div>

    {/* Image Upload */}
    <div className="TCD form_group">
      <label htmlFor="TP_img">Upload Package Image</label>
      <label htmlFor="TP_img" className="TCD_upload_label">
        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Image
      </label>
      <input
        className="TCD_upload_photo"
        type="file"
        id="TP_img"
        name="img"
        ref={fileInputRef}           // <---- ref attached here
        onChange={handleFileChange}
        accept="image/*"
      />
      {uploadedFiles.length > 0 && (
        <ul className="uploaded_files_list">
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              {file.name}
              <button
                style={{ backgroundColor: 'transparent', border: 'none', marginLeft: '30px', cursor: 'pointer' }}
                onClick={() => removeFile(index)}
              >
                <i style={{ color: 'red' }} className="fa-solid fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Submit */}
    <div className="form_section submit_section">
      <button
        type="submit"
        className="TCD_submit_btn"
        onClick={handleAddNewTrainingPackageSubmit}
      >
        Add Training Package
      </button>
    </div>
  </div>

  )
}

// ---------------- CoordinatorBookings ----------------
const CoordinatorBookings = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 1️⃣ All bookings
        const resBookings = await fetch(
          "http://localhost:3001/trainingBooking/api/trainingBookings"
        );
        if (!resBookings.ok) throw new Error("Failed to fetch bookings");
        const bookingsData = await resBookings.json();

        // 2️⃣ All users
        const resUsers = await fetch("http://localhost:3001/user/api/users");
        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const users = await resUsers.json();

        // 3️⃣ All pets
        const resPets = await fetch("http://localhost:3001/petProfile/api/petProfiles");
        if (!resPets.ok) throw new Error("Failed to fetch pets");
        const pets = await resPets.json();

        // 4️⃣ Merge details for each booking
        const enriched = bookingsData.map(b => {
          const customer = users.find(u => u.userID === b.userID);
          const pet = pets.find(p => p.petID === b.petID);

          return {
            trainingBookingID: b.trainingBookingID,
            petName: pet?.name || "Unknown",
            breed: pet?.breed || "Unknown",
            ownerEmail: customer?.userEmail || "Unknown",
            date: b.date,
            time: b.time,
            status: b.status
          };
        });

        setBookings(enriched);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const [showStatusDropDown, setShowStatusDropDown] = useState(false)
  const [selectedDropDown, setSelectedDropDown] = useState(0)

  const handleStatusOnClick = (booking, action) =>{    
    console.log(booking)
    if(action === "approve"){
      booking.status = "Approved"
      setShowStatusDropDown(false)
    }
    else if(action === "cancle"){
      booking.status = "Cancelled"
      setShowStatusDropDown(false)
    }
    else{
      setSelectedDropDown(booking.trainingBookingID)
      setShowStatusDropDown(true)
    } 
    
    console.log(selectedDropDown)
    if(action !== ""){
      try{
        const res = Axios.put(
          `http://localhost:3001/trainingBooking/api/trainingBookings/${booking.trainingBookingID}`,
          booking
        );

      }catch (error) {
        console.error("Error Booking:", error);
        alert("❌ Failed to update booking status. Please try again later.");
      }
    }
      
    
 }

  return (
    
        <div className="TCD coordinator_card">
          <h2 className="TCD coordinator_title">All Bookings</h2>
          <table className="TCD coordinator_table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Pet Name</th>
                <th>Breed</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.trainingBookingID}>
                  <td>{booking.ownerEmail}</td>
                  <td>{booking.petName}</td>
                  <td>{booking.breed}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td style={{position:'relative'}}>
                    {booking.status === "Pending" &&
                    <div style={{ display:'flex', justifyContent:'center',alignItems:'center', textAlign:'center', backgroundColor:'rgba(211, 211, 211, 1)', color:'gray',padding:'5px 10px', borderRadius:'10px', fontWeight:'bold'}} onClick={() =>handleStatusOnClick(booking, "")}>
                      {booking.status}
                    </div>}
                    {booking.status === "Cancelled" &&
                    <div style={{ display:'flex', justifyContent:'center',alignItems:'center', textAlign:'center', backgroundColor:'rgba(255, 82, 82, 1)', color:'black',padding:'5px 10px', borderRadius:'10px', fontWeight:'bold'}}>
                      {booking.status}
                    </div>}
                    {booking.status === "Approved" &&
                    <div style={{ display:'flex', justifyContent:'center',alignItems:'center', textAlign:'center', backgroundColor:'rgba(228, 157, 90, 1)', color:'black',padding:'5px 10px', borderRadius:'10px', fontWeight:'bold'}}>
                      {booking.status}
                    </div>}
                    {selectedDropDown === booking.trainingBookingID && showStatusDropDown &&
                    
                    <div style={{position:'absolute', zIndex:'100', backgroundColor:'white', padding:'10px 30px', borderRadius:'10px',boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                      <ul style={{listStyleType:'none', margin:'0',padding:'0',display:'flex',flexDirection:'column', gap:'10px' }}>                        
                        <li style={{ display:'flex', justifyContent:'center',alignItems:'center', textAlign:'center', backgroundColor:'rgba(228, 157, 90, 1)', color:'black',padding:'5px 10px', borderRadius:'10px', fontWeight:'bold'}} onClick={() =>handleStatusOnClick(booking,"approve")}>Approve</li>
                        <li style={{ display:'flex', justifyContent:'center',alignItems:'center', textAlign:'center', backgroundColor:'rgba(255, 82, 82, 1)', color:'black',padding:'5px 10px', borderRadius:'10px', fontWeight:'bold'}} onClick={() =>handleStatusOnClick(booking,"cancle")}>Cancel</li>
                      </ul>
                    </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
  );
};

const getFirstImage = (pet) => {
        const imgUrl = pet.images && pet.images.length > 0 ? pet.images[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }

function DisplayMyPets ({setSelectedPet, userID}) {
    const [pets, setPets] = useState([]);

    useEffect(() => {
      console.log("User ID:", userID);
    }, []);

  useEffect(() => {
    // Fetch pets data from backend if needed
   
    const fetchPets = async () => {
      try {        

        const response = await fetch("http://localhost:3001/petProfile/api/petProfiles");
        if (!response.ok) {        
          throw new Error(`Failed to fetch pets: ${response.status}`);  
        }

        const data = await response.json();
        const filteredPets = data.filter(pet => pet.userID === userID); // Assuming ownerID 1 for demo
        setPets(filteredPets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);
  const handlePetSelect = (pet) =>{
    setSelectedPet(pet);
  }

  return(
    <div>
      <h5>My Pets</h5>
      {pets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <div style={{display:'flex', flexDirection:'column ', justifyContent:'center', alignContent:'center', gap:'20px'}}>
          {pets.map((pet) => (
            <div key={pet.id} onClick={() => handlePetSelect(pet)} style={{display:'flex', justifyContent:'flex-start', alignContent:'center', gap:'10px', cursor:'pointer', border:'1px solid rgba(133, 133, 133, 0.1)', padding:'5px', borderRadius:'10px'}}>
              <img style={{width:'30px', height:'30px', objectFit:'cover', borderRadius:'50%'}} src={getFirstImage(pet)} alt="Pet" />
              <span>{pet.name}</span>
              <span>{pet.species}</span>
              <span>{pet.breed}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}