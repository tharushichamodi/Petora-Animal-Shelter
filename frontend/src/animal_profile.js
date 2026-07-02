import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';

import './css/animal_profile.css';

import Header from './header';
import Footer from './footer';

import FillAdoptionApplication from './fill_adoption_application'


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
import collie1 from './images/collie1.jpg'
import collie2 from './images/collie2.jpg'
import collie3 from './images/collie3.jpg'
import collie4 from './images/collie4.jpg'

import { Link } from 'react-router-dom';



function AnimalProfile(){
    let userID = Number(localStorage.getItem('userID')) || 0;

    const location = useLocation();

  // safely read the value
    const { animalProfile } = location.state || {};
    const [ animal, setAnimal ] = useState([animalProfile]);
     // Wrap in an array to use map
    // const animal = [
    //     {
    //         name:'Dog',
    //         breed:'Border Collie',
    //         age:'2 Years',
    //         gender:'Male',
    //         weight:'18kg',
    //         color:'Brown',
    //         adoptStatus:'Ready For Adopt',
    //         bio:"Meet this friendly and energetic Border Collie! At 2 years old, he’s full of life,extremely intelligent, and loves staying active. With a shiny brown coat and bright eyes, he is sure to win your heart. This dog is well-socialized, responds well to training, and is looking for a loving home where he can run, play, and cuddle.",
    //         vaccinStatus:'Vaccinated'
    //     }
    // ];

    // add to fav
    
    const [add_to_fav, set_add_to_fav] = useState([]);
    const [isFavorited, setIsFavorited] = useState(animalProfile?.favouritedBy?.includes(userID) || false);
    useEffect(()=>{

    }, [])
    const [favoritedPet, setFavoritedPet] = useState(null);

    const addToFav = async (animal) => {
    // Determine if the pet is already in favorites
    const alreadyInFav = add_to_fav.some(
        (fav) => fav.animalProfileID === animal.animalProfileID
    );

    let updatedFavs;
    let updatedFavoritedBy = [...(animal.favouritedBy || [])];

    if (alreadyInFav) {
        // 🧡 Remove from local favorites
        updatedFavs = add_to_fav.filter(
        (fav) => !(fav.animalProfileID === animal.animalProfileID)
        );
        // Remove current user ID from favoritedBy
        updatedFavoritedBy = updatedFavoritedBy.filter((id) => id !== userID);
        setIsFavorited(false);
    } else {
        // 🧡 Add to local favorites
        updatedFavs = [...add_to_fav, animal];
        // Add user ID if not already present
        if (!updatedFavoritedBy.includes(userID)) {
        updatedFavoritedBy.push(userID);
        }
        setIsFavorited(true);
    }

    set_add_to_fav(updatedFavs);

    // 🐾 Prepare data to send to backend
    const updatedAnimal = {
        ...animal,
        favouritedBy: updatedFavoritedBy,
    };

    try {
        const response = await Axios.put(
        `http://localhost:3001/animalProfile/api/animalProfiles/${animal.animalProfileID}`,
        updatedAnimal
        );

        console.log("✅ Favorite updated:", response.data);
        setFavoritedPet(response.data);
    } catch (error) {
        console.error("❌ Error updating profile:", error);
    }
    };

    
    
    //control adoption form
    const [showAdoptNowForm, setShowAdoptionForm] = useState(false)
    const [overlay, setOverlay] = useState(false);

    const handleAdoptNow = () =>{
        if(!showAdoptNowForm){
            setShowAdoptionForm(true)
            setOverlay(true)
        }
        else{
            setShowAdoptionForm(false)
            setOverlay(false)
        }
        
    }


    return(
        <div className='animal_profile_container'>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>
            <div className={`overlay ${overlay ? "visible" : ""}`} onClick={() => setOverlay(false)}></div>
        <div className='animal_profile_content'>
            <Header/>
            <main className='animal_profile_main'>
                {animal.map((animal, index) => (
                    <div className='AP_top' key={index} >
                    <div className='AP_top_left'>
                            <ImageCarousel animal={animal} />
                    </div>
                    <div className='AP_top_right' >
                        <div>
                            <button className='AP_add_favorite' onClick={() => addToFav(animal)}
                                        style={{
                                                color: isFavorited ?'rgb(255, 145, 0)' : '',
                                                float:'right'
                                            }}
                                    >
                                        <i className="fa-solid fa-heart"></i></button>
                        </div>
                        <div style={{marginBottom:'30px', display:'flex'}}><span><span className='AP_animal_name'>{animal.species}</span><span className='AP_breed'> /{animal.breed}</span></span></div>
                        <div style={{marginBottom:'50px'}}><h1 className='AP_age' >{animal.age}</h1><span> Old</span></div>
                        <div style={{marginBottom:'50px',}}>
                            <i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-venus-mars"></i><span className='AP_gender'><strong> Gender :</strong> {animal.gender}</span>
                            <i style={{ color: 'rgb(255, 145, 0)',marginLeft:'30px' }} className="fas fa-paw"></i><span className='AP_weight'><strong> weight :</strong> {animal.weight}</span>
                            <i style={{ color: 'rgb(255, 145, 0)',marginLeft:'30px' }} className="fas fa-dog"></i><span className='AP_color'><strong> Color :</strong> {animal.color}</span>
                        </div>
                        <div style={{marginBottom:''}}><span className='AP_adopt_status'>Adopt Status : <h1> <i className='fa fa-paw'></i> {animal.adoptionStatus}</h1></span></div>
                        
                        <div style={{marginBottom:''}}><p className='AP_bio'>{animal.bio}</p>
                        </div>
                        <div style={{marginBottom:'',}}><button to="" className='AP_adopt_now_btn' onClick={handleAdoptNow}>Adopt Now</button></div>
                        <div style={{marginBottom:'',display:'flex',gap:'50px',}}>
                            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} className='AP_vaccinated'><div><i class="fa-solid fa-syringe"></i> {animal.vaccinStatus}</div><Link style={{fontSize:'12px', color:'white',}}>Click to see more records</Link></div>
                            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} className='AP_Cust_support'><div><i class="fa-solid fa-phone"></i> Customer Support</div><span style={{fontSize:'12px', color:'white',}}>071 234 5678</span></div>                    

                        </div>
                        
                    </div>
                                                
                </div>))}
                <div>
                    {/* <AnimalMedicalProfile/> */}
                </div>
                <div className='AP hr'>
                </div>
                
                <div className='AP hr'></div>
                <div style={{display:'flex',width:'100%',}}><h1 style={{fontSize:'30px', textAlign:'left', marginLeft:'100px'}}>Animals You May Like</h1></div>
                <Suggested_Animals/>
                <div style={{display:'flex',width:'100%',}}><h1 style={{fontSize:'30px', textAlign:'left', marginLeft:'100px', marginTop:'100px'}}>Top Picks from Our Store</h1></div>
                <SuggestedProducts/>
            </main>
            
            <Footer/>
        </div>
        {showAdoptNowForm && (
        <div className={`form_wrapper ${showAdoptNowForm ? "visible" : ""}`} onClick={() => setShowAdoptionForm(false)}  >            
            <FillAdoptionApplication onClose={() => {setShowAdoptionForm(false); setOverlay(false); }} selectedAnimalId={animal[0].animalProfileID} />        
        </div>
        )}
        </div>
    );
}


export default AnimalProfile;

function ImageCarousel({animal}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Check if images exist
    if (!animal || !animal.photos || animal.photos.length === 0) {
        return <div className='AP_petImg_cont'>No images available</div>;
    }

    const handlePrev = () => {
        if (animal.photos.length > 1) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? animal.photos.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNext = () => {
        if (animal.img.length > 1) {
            setCurrentIndex((prevIndex) =>
                prevIndex === animal.img.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    return (
        <div className='AP_petImg_cont'>
            {animal.photos.length > 1 && (
                <button className='carousel_btn left' onClick={handlePrev}>❮</button>
            )}

            <img
                className='AP_petImg'
                src={`http://localhost:3001/uploads/${animal.photos[currentIndex]}`}
                alt={`Pet ${currentIndex + 1}`}
            />

            {animal.photos.length > 1 && (
                <button className='carousel_btn right' onClick={handleNext}>❯</button>
            )}
        </div>
    );
}



export function Suggested_Animals(){
const [animals, setAnimals] = useState([]);
useEffect(() => {
    // 1. load all teams
    Axios.get("http://localhost:3001/animalProfile/api/animalProfiles").then(res => {
      setAnimals(res.data);  
    });
  }, []);
    
    // add to fav
    const [add_to_fav, set_add_to_fav] = useState([]);

    const addToFav = (animal) => {
        set_add_to_fav((prevFavs) => {
            const alreadyInFav = prevFavs.some(fav => fav.name === animal.name && fav.breed === animal.breed); // Update condition if needed

            if (alreadyInFav) {
                // Remove from favorites
                return prevFavs.filter(fav => !(fav.name === animal.name && fav.breed === animal.breed));
            } else {
                // Add to favorites
                return [...prevFavs, animal];
            }
        });
    };

    
    const isFavorited = (animal) => {
        return add_to_fav.some(fav => fav.name === animal.name && fav.breed === animal.breed); // Same check
    };
    useEffect(() => {
        if (add_to_fav) {
            console.log('Added to fav:', add_to_fav);
        }
    }, [add_to_fav]);

    // init cards
    const [initialAnimals, setInitialAnimals] = useState([]);
    
        useEffect(() => {
            setInitialAnimals(animals.slice(0, 4)); // CHANGED: Only first 30
        }, [animals]);
useEffect(() => {
    console.log(initialAnimals);
}, [initialAnimals]);
const getFirstImage = (animal) => {
        const imgUrl = animal.photos && animal.photos.length > 0 ? animal.photos[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }

    return(
        <div className='rescued_animals_content AP_suggested_animals_cont ' style={{ display:'flex', justifyContent:'flex-start', width:'90vw', overflowX:'scroll'}}>
            
            
            {initialAnimals.map((animals, index) =>(
                        <div key={index} className='animal_card'>
                            <div className="adopt_status_label">
                                <span>{animals.adoptionStatus}</span>
                            </div>
                            <div className='animal_card_content'>
                                <img src={getFirstImage(animals)} alt="Animal" />
                                <div className='cato_fav'>
                                    <h2 className='animal_Category' >{animals.species}<span className='breed'> / {animals.breed}</span></h2>
                                    <button className='add_favorite' onClick={() => addToFav(animals)}
                                        style={{
                                                color: isFavorited(animals) ?'rgb(255, 145, 0)' : '',
                                                border: isFavorited(animals) ?'2px solid rgb(255, 145, 0)' : '',
                                            }}
                                    >
                                        <i className="far fa-heart"></i></button>
                                </div>

                                <p className='age' style={{ color: '#929292',textAlign:'left', width:'100%' }}>Age: <span style={{fontWeight: 'bold', fontSize:'20px', color: '#000000ff', width:'100%', textAlign:'left'}}>{animals.age}</span></p>
                                <p className='description'>{animals.description}</p>
                                <hr className='animal_card_divider'></hr>
                                <div className='animal_card_footer'>
                                    <span><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-venus-mars"></i> {animals.gender}</span>
                                    <span><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-paw"></i> {animals.weight}</span>
                                    <span><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-dog"></i> {animals.color}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
        </div>
    );
}



function SuggestedProducts (){
    const saleItems = [
  {
    name: 'Organic Dog Food',
    price: 'Rs. 2,500',
    description: 'High-protein dry food',
    img: require('./images/store_product1.jpg'),
  },
  {
    name: 'Cat Scratching Post',
    price: 'Rs. 1,900',
    description: 'Durable and fun for cats',
    img: require('./images/store_product2.jpg'),
  },
  {
    name: 'Goldfish Flakes',
    price: 'Rs. 850',
    description: 'Premium nutrition for fish',
    img: require('./images/store_product3.jpg'),
  },
  {
    name: 'Rabbit Toy Set',
    price: 'Rs. 1,300',
    description: 'Chew-safe toy bundle',
    img: require('./images/store_product4.jpg'),
  },
  {
    name: 'Pet Grooming Kit',
    price: 'Rs. 3,200',
    description: 'Includes brush, shampoo, and nail clipper',
    img: require('./images/store_product5.webp'),
  },
  {
    name: 'Dog Chew Bone Pack',
    price: 'Rs. 950',
    description: 'Long-lasting chew bones for dogs',
    img: require('./images/store_product6.webp'),
  },
  {
    name: 'Cat Carrier Bag',
    price: 'Rs. 4,500',
    description: 'Comfortable and secure travel bag',
    img: require('./images/store_product7.webp'),
  },
  
];


    return(
        <div className="AP store_product_cards" style={{width:'90vw', overflowX:'scroll'}}>
            {saleItems.map((item, i) => (
              <div key={i} className="store_product_card">
                <img src={item.img} alt={item.name} />
                <h4 className="store_product_name">{item.name}</h4>
                <p className="store_product_description">{item.description}</p>
                <p className="store_product_price">{item.price}</p>
                <button className="store_buy_btn">Buy Now</button>
              </div>
            ))}
        </div>
    )
};