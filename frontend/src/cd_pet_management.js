import React, {useState,useEffect} from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './css/cd_pet_management.css';

import dogImg from './images/dog2.jpg'
import catImg from './images/cat3.jpg'
import rabbitImg from './images/rabbit1.jpg'
import { width } from '@fortawesome/free-solid-svg-icons/fa0';
// --- MOCK DATA ---
const user = {
  name: 'Koshitha Sandaru',
  avatar: 'https://i.pravatar.cc/150?img=11', // placeholder
  greeting: 'Good Morning, Koshitha',
  achievement: 'Thank you for helping animals find loving homes!',
  progress: 32,
  stats: [40, 60, 20, 75],
};

// example “pet-searches” the user started
const favoriteFiltering = [
  { title: 'Dogs',    favorites: 0, total: 20, icon: 'fa-dog' },
  { title: 'Cats',    favorites: 0, total: 15, icon: 'fa-cat' },
  { title: 'Rabbits', favorites: 0, total: 8,  icon: 'fa-carrot' },
  { title: 'Hamsters', favorites: 0, total: 8,  icon: 'fa-paw' },
  { title: 'Guinea Pigs', favorites: 0, total: 8,  icon: 'fa-carrot' } // or any rabbit-related icon you like
];

// // recently viewed / favourited pets
// const continueExploring = [
//   {
//     type: 'DOG',
//     image: dogImg,
//     title: 'Friendly Labrador Mix',
//     mentor: 'Animal Care Center',
//     desc: '2 years • Male • Vaccinated',
//     adoptionStatus:'Ready for Adoption'
//   },
//   {
//     type: 'CAT',
//     image: catImg,
//     title: 'Calm and Playful',
//     mentor: 'Downtown Shelter',
//     desc: '1 year • Female • Spayed',
//     adoptionStatus:'Reserved'
//   },
//   {
//     type: 'RABBIT',
//     image: rabbitImg,
//     title: 'White Netherland Dwarf',
//     mentor: 'Happy Paws Rescue',
//     desc: '6 months • Male • Litter Trained',
//     adoptionStatus:'Under Treatment'
//   },
// ];

// upcoming appointments / follow-ups
// const upcomingVisits = [
//   { shelter: 'Downtown Shelter', date: '2025-09-10', type: 'Adoption Interview', desc: 'Meet Luna for adoption interview' },
// ];

// get first image function    
const getFirstImage = (pet) => {
        const imgUrl = pet.photos && pet.photos.length > 0 ? pet.photos[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }
    
function PetManagement({userID}) {

  // favorited animals
    const [favoritedAnimals, setFavoritedAnimals] = useState([]);
    useEffect(() => {
            Axios.get(`http://localhost:3001/animalProfile/api/animalProfiles`).then(res => {
            if(!res.data || res.data.length === 0) return;
              
            const animals = res.data.filter(a => a.favouritedBy.includes(userID));
            setFavoritedAnimals(animals);
            });
          }, []);
    useEffect(() => {
      var length = 0
      length = favoritedAnimals.length;
      favoriteFiltering.forEach(pet => pet.total = length);
      

      favoritedAnimals.forEach(animal => {
        if(animal.species === "Dog"){
          favoriteFiltering[0].favorites += 1;
        
        }
        else if(animal.species === "Cat"){
          favoriteFiltering[1].favorites += 1;
        }
        else if(animal.species === "Rabbit"){
          favoriteFiltering[2].favorites += 1;
        }})
      
    }, [favoritedAnimals]);
  const navigate = useNavigate();

  const handleSeeAllAnimalsClick = () => {
    navigate('/rescued_animals');
  }
  const handleAnimalProfileClick = (animal) =>{
        const animalProfile = animal;
        navigate('/animal_profile', { state: { animalProfile } });
  }
  

  const [adoptionApplications, setAdoptionApplications] = useState([]);
  const [animalData, setAnimalData] = useState(null);

useEffect(() => {
    Axios.get(`http://localhost:3001/adoptionApplication/api/adoptionApplications`).then(res => {
      setAdoptionApplications(res.data);
      console.log("adoption applications", res.data);
    
    });
    Axios.get(`http://localhost:3001/animalProfile/api/animalProfiles`).then(res => {
      setAnimalData(res.data);
      console.log("animal data", res.data);
    });
}, []);

const seperateDateAndTime = (dateTimeString) => {
  if(!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

const getAnimalType = (animalID) => {
  if(animalID === null || animalData === null) return '';
    const animal = animalData.find(a => a.animalProfileID === animalID);
    if (!animal || !animal.species) return '';
    return animal.species.charAt(0).toUpperCase() + animal.species.slice(1).toLowerCase();
}
const getAnimalBreed = (animalID) => {
  if(animalID === null || animalData === null) return '';
    const animal = animalData.find(a => a.animalProfileID === animalID);
    if (!animal || !animal.breed) return '';
    return animal.breed.charAt(0).toUpperCase() + animal.breed.slice(1).toLowerCase();
}


  return (
    <div className="CD_dashboard_layout">

      <div className="CD_main_content_area">
        {/* Top Navigation */}
        

        <div style={{ width: '100%' }}>
          <h1 style={{ textDecoration: 'none', textAlign: 'left' }}>
            Welcome, {user.name.split(' ')[0]}
          </h1>
        </div>

        <section className="CD_main_dashboard">
          {/* Banner */}
          <div className="CD_banner_container">
            <div className="CD_banner_content">
              <h2 className="CD_banner_title">
                Give a Loving Home to a Rescued Animal Today
              </h2>
              <button className="CD_join_now_btn" onClick={handleSeeAllAnimalsClick}>Find a Pet</button>
            </div>
            <div className="CD_banner_overlay"></div>
          </div>

          {/* Adoption Progress */}
          <div className="CD_progress_cards_container">
            {favoriteFiltering.map((pet, index) => (
              <div key={index} className="CD_progress_card">
                <div className="CD_progress_card_left">
                  {/* Font Awesome icon */}
                  <i className={`fa-solid ${pet.icon} CD_progress_icon`} aria-hidden="true"></i>
                  <p className="CD_progress_count">
                    {pet.favorites}/{pet.total} favorited
                  </p>
                </div>
                <div className="CD_progress_card_right">
                  <h4 className="CD_progress_title">{pet.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Exploring */}
          <div className="CD_section_header_container">
            
            <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
              <div className="CD_section_header_container" style={{width:'100%', justifyContent:'space-between', }}>
                <h3 className="CD_section_header_title">Continue Exploring</h3>
                <span className="CD_see_all_link" onClick={() => handleSeeAllAnimalsClick()}>See All</span>
              </div>
              <div className="CD_section_header_nav" style={{width:'100%', justifyContent:'flex-end', marginTop:'10px'}}>
                <span className="CD_nav_arrow CD_nav_arrow_left">&lt;</span>
                <span className="CD_nav_arrow CD_nav_arrow_right">&gt;</span>
              </div>
            </div>
            
          </div>
          <div className="CD_continue_watching_list">
            {favoritedAnimals.map((pet, index) => (
              <div key={index} className="CD_watching_card" onClick={() =>handleAnimalProfileClick(pet)}>
                <img className="CD_watching_image" src={getFirstImage(pet)} alt={pet.species} />
                <div className="CD_watching_content">
                  <div style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
                    <span className="CD_watching_type" style={{width:'50%'}}>{pet.breed}</span>
                    <span  className="CD_adoption_status" style={{width:'50%', backgroundColor:pet.adoptionStatus === "Reserved"? "#b6ffa4ff": pet.adoptionStatus === "Under Treatment"? "#d3a4ff" : ""}}>{pet.adoptionStatus}</span>
                  </div>
                  
                  <h4 className="CD_watching_title">{pet.species}</h4>
                  <p className="CD_watching_mentor">{pet.gender}</p>
                  <p className="CD_watching_desc">{pet.bio}</p>
                </div>
              </div>
            ))}
            
          </div>
          
          {/* Upcoming Visits Table */}
          <div className="CD_section_header_container">
            <h3 className="CD_section_header_title">Your Upcoming Visits</h3>
            <span className="CD_see_all_link">See All</span>
          </div>
          <div className="CD_lesson_table">
            <div className="CD_table_header">
              <div className="CD_table_cell">Date</div>
              <div className="CD_table_cell">Status</div>
              <div className="CD_table_cell">Pet Type</div>
              <div className="CD_table_cell">Breed</div>
            </div>
            {adoptionApplications.map((app, index) => (
              <div key={index} className="CD_table_row">
                <div className="CD_table_cell">
                  <h4 className="CD_cell_title">Application</h4>
                  <p className="CD_cell_subtitle">{seperateDateAndTime(app.createdAt)}</p>
                </div>
                <div className="CD_table_cell">
                  <p className="CD_lesson_type" style={{backgroundColor: app.status === "Approved" ? "rgba(203, 255, 252, 1)" : app.status === "Declined" ? "rgba(255, 213, 203, 1)" : "rgba(203, 255, 207, 1)", color:'black'}}>{app.status}</p>
                </div>
                <div className="CD_table_cell">
                  <p className="CD_lesson_desc">{getAnimalType(app.animalID)}</p>
                </div>
                <div className="CD_table_cell CD_action_cell">
                  <span className="CD_action_icon">{getAnimalBreed(app.animalID)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PetManagement;

