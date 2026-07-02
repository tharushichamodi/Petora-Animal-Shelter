import { useState, useEffect } from 'react';
import { FaMars, FaVenus, FaWeightHanging, FaPalette, FaCheckCircle, FaPhone } from "react-icons/fa";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from './header'
import PetManagement from './cd_pet_management';
import HealthVetCare from './cd_health_and_vet_care';
import GroomingServices from './cd_grooming_services';
import TrainingBootcamp from './cd_training_bootcamp';
import DaycareBoarding from './cd_daycare_boarding'

import './css/customer_dashboard.css'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faEnvelope,
  faBookOpen,
  faCheckSquare,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

const getFirstImage = (pet) => {
        const imgUrl = pet.images && pet.images.length > 0 ? pet.images[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }


function CustomerDashboard(){
  //get user ID
  let userID = Number(localStorage.getItem('userID')) || 0;

const navItems = [
  { name: 'My Pets',icon: faTachometerAlt },   // overview & management of own pets
  { name: 'Health & Vet Care',icon: faEnvelope },       // medical records, vet visits, vaccinations
  { name: 'Grooming Services',icon: faBookOpen },       // grooming appointments & history
  { name: 'Training Bootcamps',icon: faCheckSquare },    // obedience / training sessions
  { name: 'Daycare & Boarding',icon: faUsers },         // daycare bookings & status
];


// const friends = [
//   { name: 'Bagas Matpie', status: 'friend', avatar: 'https://i.pravatar.cc/150?img=60' },
//   { name: 'SirDandy', status: 'Old friend', avatar: 'https://i.pravatar.cc/150?img=61' },
//   { name: 'Jhon Tosan', status: 'friend', avatar: 'https://i.pravatar.cc/150?img=62' },
// ];
// const pets = [
//   { name: 'Padhang Satrio', title: 'Mentor', avatar: 'https://i.pravatar.cc/150?img=63' },
//   { name: 'Zakir Horizonal', title: 'Mentor', avatar: 'https://i.pravatar.cc/150?img=64' },
//   { name: 'Leonardo Samul', title: 'Mentor', avatar: 'https://i.pravatar.cc/150?img=65' },
// ];

const user = {
  name: 'Jason Ranti',
  avatar: 'https://i.pravatar.cc/150?img=68', // Placeholder image
  greeting: 'Good Morning Jason',
  achievement: 'Continue your learning to achieve your target!',
  pets: 3,
  stats: [40, 60, 20, 75],
};

// Main Dashboard Component

const [activeNav, setActiveNav] = useState('My Pets');

  // handle show overlay
    const[showOverlay, setShowOverlay] = useState(false)

    const[showPetProfile, setShowPetProfile] = useState(false);
    const[addPetForm, showAddPetFormm] = useState(false);

    const handleAddPetBtn = () =>{
      if(showPetProfile == true){
        showAddPetFormm(false)
        setShowOverlay(false)
      }
      else{
        showAddPetFormm(true)
        setShowOverlay(true)
      }
    }

    const [rightSidebar, setRightSideBar] = useState(false)
    const handleRightSideBar = () =>{
        if(rightSidebar){
            setRightSideBar(false)
        }
        else{
            setRightSideBar(true)
        }
    }

    // get pet profiles from back end
    const [petProfiles, setPetProfiles] = useState([]);
    useEffect(() => {
    Axios.get("http://localhost:3001/petProfile/api/petProfiles").then(res => {
      
      const profiles = res.data.filter(p => p.userID === Number(userID));
      setPetProfiles(profiles);
      console.log(userID)
      console.log(res.data);
      console.log(profiles);
    })
    .catch(error => {
      console.error("Error fetching pet profiles:", error);
    });
    
  }, []);

    const handleViewPetProfile = (pet) => {
      setShowPetProfile(true);
      handleOverlayClick();
      setCurrentPet(pet);
    }
    const [currentPet, setCurrentPet] = useState(null);

    const handleOverlayClick = () => {
      setShowOverlay(!showOverlay)
      
    };

  const navigate = useNavigate();

    const handleLogOut = () => {
      localStorage.removeItem('userID');
      navigate('/signup');
    };
    return(
        <div className='CD dashboard' style={{display:'flex', alignItems:'flex-end', justifyContent:'center'}}>
        <div className={`overlay ${showOverlay ? "visible" : ""}`} onClick={handleOverlayClick}></div>

            <aside className="CD_sidebar">
                <div className="CD_logo_container">
                <span className="CD_logo_icon"></span>
                <h1 className="CD_logo_text">Customer Dashboard</h1>
                </div>

                <nav className="CD_navigation">
                <ul className="CD_nav_list">
                    <h3 className="CD_nav_header">OVERVIEW</h3>
                    {navItems.map((item, index) => (
                    <li
                        key={index}
                        className={`CD_nav_item ${activeNav === item.name ? 'CD_nav_item_active' : ''}`}
                        onClick={() => setActiveNav(item.name)}
                    >
                        <FontAwesomeIcon icon={item.icon} className="CD_nav_icon" />
                        <span className="CD_nav_text">{item.name}</span>
                    </li>
                    ))}
                </ul>
                </nav>

                

                <div className="CD_settings_section">
                <h3 className="CD_nav_header">SETTINGS</h3>
                <ul className="CD_nav_list">
                    <li className="CD_nav_item">
                    <span className="CD_nav_icon"><i className="fa-solid fa-gear" ></i></span>
                    <span className="CD_nav_text">Setting</span>
                    </li>
                    <li className="CD_nav_item CD_logout_btn" onClick={() => handleLogOut()}>
                    <span className="CD_nav_icon"><i class="fa-solid fa-right-from-bracket"></i></span>
                    <span className="CD_nav_text" >Logout</span>
                    </li>
                </ul>
                </div>
            </aside>
            
            <div style={{position:'fixed', top:'0', left:'0', zIndex:'1000'}}><Header/></div>
            
            <div className='CD dashboard_main'>
                {activeNav === 'My Pets'
                && <PetManagement userID={userID}/>}
                {activeNav === 'Health & Vet Care'
                && <HealthVetCare userID={userID}/>}
                {activeNav === 'Grooming Services'
                && <GroomingServices userID={userID}/>}
                {activeNav === 'Training Bootcamps'
                && <TrainingBootcamp userID={userID}/>}
                {activeNav === 'Daycare & Boarding'
                && <DaycareBoarding userID={userID}/>}
            </div>
            <div 
                style={{position:'fixed', right:'0vw', top:'6vw', zIndex:'1001', backgroundColor:'white', borderRadius:'5px 5px',width:'30px', height:'30px', boxShadow:'0 2px 4px rgba(0, 0, 0, 0.2)', display:'flex', alignItems:'center', justifyContent:'center',transition: 'transform 1s ease',  ...(rightSidebar ? {transform: 'translateX(-25vw)'} : {transform: 'translateX(0vw)'})}}
                onClick={handleRightSideBar}>
                {rightSidebar ? 
                <i className='fa-solid fa-bars'></i> 
                : 
                <i className='fa-solid fa-arrow-left'></i>
                }
            </div>
            {/* Right Sidebar Section */}
            <aside className={`CD_right_sidebar ${rightSidebar ? "visible" : ""} `}>
                <div className="CD_sidebar_card">
                <div className="CD_card_header">
                    <h3 className="CD_card_title">Profile</h3>
                    <span className="CD_card_dots">...</span>
                </div>
                <div className="CD_stats_user">
                    <div className="CD_stat_avatar_container">
                    <img className="CD_stat_avatar" src={user.avatar} alt={user.name} />
                    <div className="CD_stat_progress_circle">
                        <span className="CD_stat_progress_text">{user.pets}</span>
                    </div>
                    </div>
                    <h4 className="CD_stat_greeting">{user.greeting}</h4>
                    <p className="CD_stat_achievement">{user.achievement}</p>
                </div>
                <div className='CD_profile_details'>
                    <div style={{width:'15vw'}}>
                        <label style={{fontSize:'12px', fontWeight:'bold'}}>About Me</label>
                        <p className='CD_about_me' style={{fontSize:'12px'}}>I’m a passionate animal-welfare advocate who enjoys combining technology and creativity
    to make a positive impact. When I’m not coding or designing, you’ll find me volunteering
    at shelters, exploring new hiking trails, or experimenting with new coffee blends.</p>
                    </div>
                    <div style={{width:'100%', textAlign:'center'}}>
                        <button className='CD_edit_profile_btn'>Edit profile</button>
                    </div>
                </div>
                
                </div>

                <div className="CD_sidebar_card">
                <div className="CD_card_header">
                    <h3 className="CD_card_title">My Pets</h3>
                    <span className="CD_card_add_icon" onClick={handleAddPetBtn}>+</span>
                </div>
                <div className="CD_mentor_list">
                    {petProfiles.map((pet, index) => (
                    <div key={index} className="CD_mentor_item">
                        <img className="CD_mentor_avatar" src={getFirstImage(pet)} alt={pet.name} />
                        <div className="CD_mentor_info">
                        <h4 className="CD_mentor_name">{pet.name}</h4>
                        <p className="CD_mentor_title">{pet.breed}</p>
                        </div>
                        <button className="CD_follow_btn" onClick={() => handleViewPetProfile(pet)}>View</button>
                    </div>
                    ))}
                </div>
                <p className="CD_see_all_link">See All</p>
                </div>

                
            </aside>
            {addPetForm && (
                <div className='CD visible_cont'>
                    <AddPetForm onClose={() => {showAddPetFormm(false); setShowOverlay(false); }} userID={userID} />
                </div>
            
            )}
            {showPetProfile && (
                <div className='CD visible_cont' onClick={() =>{handleOverlayClick(); setShowPetProfile(false);}}>
                    <PetProfile pet={currentPet} />
                </div>
            )}

        </div>
    )
}

export default CustomerDashboard;

function PetProfile ({ pet }){
  // const {
  //   name,
  //   species,
  //   breed,
  //   age,
  //   gender,
  //   weight,
  //   color,
  //   adoptionStatus,
  //   description,
  //   vaccinated,
  //   ownerPhone,
  //   image
  // } = pet;

  return (
    <div className="pet_profile_container" onClick={(e) => e.stopPropagation()}>
      <div className="PP_petImg_cont">
        <img src={getFirstImage(pet)} alt={pet.name} className="PP_petImg" />
      </div>

      <div className="pet_profile_details">
        <h2 className="PP_pet_name">
          {pet.name} <span className="PP_breed">/ {pet.breed}</span>
        </h2>
        <p className="PP_age">{pet.age} Years Old</p>

        <div style={{marginBottom:'50px',}}>
            <i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-venus-mars"></i><span className='PP_gender'><strong> Gender :</strong> {pet.gender}</span>
            <i style={{ color: 'rgb(255, 145, 0)',marginLeft:'30px' }} className="fas fa-paw"></i><span className='PP_weight'><strong> weight :</strong> {pet.weight}</span>
            <i style={{ color: 'rgb(255, 145, 0)',marginLeft:'30px' }} className="fas fa-dog"></i><span className='PP_color'><strong> Color :</strong> {pet.color}</span>
       </div>
            <div style={{marginBottom:''}}><span className='PP_adopt_status'>Adopt Status : <h1> <i className='fa fa-paw'></i> {pet.shelterAdopted === 'yes' ? 'From this shelter' : 'Not from this shlter'}</h1></span></div>

            <div style={{marginBottom:''}}><p className='PP_bio'>{pet.bio}</p></div>

        <div className="pet_action_buttons">
          

          {pet.vaccinated && (
            <button className="vaccinated_btn">
              <FaCheckCircle /> Vaccinated
            </button>
          )}

          
        </div>
      </div>
    </div>
  );
};

function AddPetForm({ onClose, userID}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

const formData = new FormData();

  const handleSubmit = (e) => {
    console.log("submit clicked")
    e.preventDefault();
    const form = e.target;
    const data = {
      type: form.pet_type.value,
      userID: userID,
      Name: form.pet_name.value,
      gender: form.pet_gender.value,
      age: Number(form.pet_age.value),
      breed: form.pet_breed.value,
      color: form.pet_color.value,
      shelterAdopted: form.pet_shelter.value,
      pictures: uploadedFiles
    };
    formData.append("name", data.Name);
    formData.append("userID", data.userID);
    formData.append("type", data.type);
    formData.append("age", data.age);
    formData.append("breed", data.breed);
    formData.append("gender", data.gender);
    formData.append("color", data.color);
    formData.append("shelterAdopted", data.shelterAdopted);
    // Append team logo file
    if (data.pictures) {
      uploadedFiles.forEach(file => formData.append("images", file));
  }
    sendDataToServer(formData);
    onClose();

  };


  


  const sendDataToServer = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/petProfile/api/petProfiles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="CD add_pet_form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="form_close_button" onClick={onClose}>
          <i className="fa-solid fa-close"></i>
        </button>
      </div>

      <div>
        <h1 style={{ textAlign: "center" }}>Add New Pet</h1>
      </div>

      {/* Pet Name */}
      <div className="CD form_group">
        <label htmlFor="pet_name">Pet Name</label>
        <input className="CD_input" type="text" id="pet_name" name="pet_name" required />
      </div>

      {/* Type / Species */}
      <div className="CD form_group">
        <label htmlFor="pet_type">Type / Species</label>
        <select className="selection" id="pet_type" name="pet_type" required>
          <option value="">Select</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Age */}
      <div className="CD form_group">
        <label htmlFor="pet_age">Age (years)</label>
        <input className="CD_input" type="number" id="pet_age" name="pet_age" min="0" required />
      </div>

      {/* Breed */}
      <div className="CD form_group">
        <label htmlFor="pet_breed">Breed</label>
        <input className="CD_input" type="text" id="pet_breed" name="pet_breed" required />
      </div>

      {/* Gender */}
      <div className="CD form_group">
        <label htmlFor="pet_gender">Gender</label>
        <select className="selection" id="pet_gender" name="pet_gender" required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>

      {/* Color */}
      <div className="CD form_group">
        <label htmlFor="pet_color">Color</label>
        <input className="CD_input" type="text" id="pet_color" name="pet_color" required />
      </div>

      {/* Shelter Adopted From */}
      <div className="CD form_group">
        <label htmlFor="pet_shelter">Adopted From from this shelter</label>
        <select className="CD_input" type="select" id="pet_shelter" name="pet_shelter" required >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Photo Upload */}
      <div className="CD form_group">
        <label htmlFor="RO_photos">Upload Photos</label>
        <label htmlFor="RO_photos" className="RO_upload_label">
          <i className="fa-solid fa-cloud-arrow-up"></i> Upload Photos
        </label>
        <input
          className="RO_upload_photo"
          type="file"
          id="RO_photos"
          name="RO_photos"
          onChange={handleFileChange}
          multiple
        />
        {uploadedFiles.length > 0 && (
          <ul className="uploaded_files_list">
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name}
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    marginLeft: "30px",
                    cursor: "pointer",
                  }}
                  type="button"
                  onClick={() => removeFile(index)}
                >
                  <i style={{ color: "red" }} className="fa-solid fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit */}
      <div className="form_section submit_section">
        <button type="submit" className="CD submit_btn">
          Add Pet
        </button>
      </div>
    </form>
  );
}

