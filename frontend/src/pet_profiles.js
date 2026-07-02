import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BsSearch } from 'react-icons/bs';
import { width } from "@fortawesome/free-solid-svg-icons/fa0";


function SearchPetsByUserEmail({setCustomerEmail, setSelectedPet}) {
  const [searchValue, setSearchValue] = useState("");
  const [userEmail, setUserEmail] = useState(null);
const [showOverlay, setShowOverlay] = useState(true);
const [showfoundPets, setShowFoundPets] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim() === "") {
      setUserEmail(null);
    } else {
      setUserEmail(searchValue.trim());
      setCustomerEmail(searchValue.trim())
      console.log(searchValue)
      handleOverlay()
      setShowFoundPets(true);
    }
  };
const handleOverlay = () =>{
    if(showOverlay){
        setShowOverlay(false)
    }
    else{
        setShowOverlay(true)
    }

}
const [ petProfile, setPetProfile] = useState(null);

useEffect(() => {
    
    if(petProfile){
      handleOverlay()
      
    }
    setSelectedPet(petProfile)
    console.log(petProfile)        

}, [petProfile]);


  return (
    <div style={{display:'flex', flexDirection:'column', width:'100%'}} >
      <label>Search by Email</label>
      <div className="AMD search_bar" style={{ backgroundColor: "transparent" }}>
        <div className="AMD search_input_cont">
          <BsSearch className="AOD_search_icon" style={{ backgroundColor: "transparent", border: "none" }} />
          <input
            type="text"
            className="AMD search_input"
            placeholder="Search Animal Profile"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            
          />
        </div>
        <button
          type="button"
          className="AP_adopt_now_btn"
          style={{ margin: "0" }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
        {/* selected pet profile */}
        {petProfile ? (
            
              <div
                key={petProfile.id}
                className="animal_card"
                onClick={() => {handleOverlay(); setShowFoundPets(true);}}
                style={{height:'60vh', width:'20vw'}}
                >
                
                <div className="animal_card_content">
                    <img src={getFirstImage(petProfile)} alt="Animal" />
                    <div className="cato_fav">
                    <h2 className="animal_Category">
                        {petProfile.name}
                        <span className="breed"> / {petProfile.breed}</span>
                    </h2>
                    
                    </div>

                    <p
                    className="age"
                    style={{
                        color: "#929292",
                        textAlign: "left",
                        width: "100%",
                    }}
                    >
                    Age:{" "}
                    <span
                        style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#000000ff",
                        width: "100%",
                        textAlign: "left",
                        }}
                    >
                        {petProfile.age}
                    </span>
                    </p>
                    
                    <hr className="animal_card_divider"></hr>
                    <div className="animal_card_footer">
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-venus-mars"
                        ></i>{" "}
                        {petProfile.gender}
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-paw"
                        ></i>{" "}
                        {petProfile.type}
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-dog"
                        ></i>{" "}
                        {petProfile.color}
                    </span>
                    </div>
                </div>
                </div>
            ) : (
              <div className="training_empty_box">
                  No Pet selected.                  
                </div>
            )}
      {/* Pass the email to your list component */}
        {showfoundPets && !showOverlay && 
        
        <div style={{position:'fixed', top:'0', left:'0', zIndex:'1000',width:'100%',backgroundColor:'rgba(0, 0, 0, 0.5)', display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backdropFilter:'blur(5px)'}} onClick={handleOverlay}>
            <PetProfileList userEmail={userEmail} columns={3} setPetProfile={setPetProfile} />
        </div>
    }
    </div>
  );
}

export default SearchPetsByUserEmail;

const getFirstImage = (pet) => {
        const imgUrl = pet.images && pet.images.length > 0 ? pet.images[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }

function PetProfileList({userEmail, columns,setPetProfile}){

    // gettting pet porfiles from back end
    
      const [searchResults, setSearchResults] = useState([]);
      
      useEffect(() => {
        if (!userEmail) return;

        const fetchPets = async () => {
            try {
            const res1 = await Axios.get("http://localhost:3001/user/api/users");
            const matchedUser = res1.data.find(user => user.userEmail === userEmail);

            if (matchedUser) {
                const res2 = await Axios.get("http://localhost:3001/petProfile/api/petProfiles");
                const matchedPets = res2.data.filter(pet => pet.userID === matchedUser.userID);
                setSearchResults(matchedPets);
            } else {
                setSearchResults([]);
                console.log("No matching user found");
            }
            } catch (error) {
            console.error("Error fetching pet profiles:", error);
            }
        };

        fetchPets();
        }, [userEmail]); // run whenever userEmail changes


    const initialAnimals = null

    
    const handleAnimalCardClick = (pet) => {
        setPetProfile(pet);
        
    }

    
    return(
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center', width:'80%',backgroundColor:'white', borderRadius:'20px', padding:'20px', overflowY:'auto',}} onClick={(e) => e.stopPropagation()} >
            <div ><h1>Found Pets</h1></div>    
            <div className='rescued_animals_content' style={{gridTemplateColumns: `repeat(${columns}, 1fr)`,  }}>
            
            <link  rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
                    
                {(searchResults.length > 0 ? searchResults : initialAnimals) && (searchResults.length > 0 || (initialAnimals && initialAnimals.length > 0)) ? (
                (searchResults.length > 0 ? searchResults : initialAnimals).map((pet, index) => (
                <div
                key={index}
                className="animal_card"
                onClick={() => handleAnimalCardClick(pet)}
                style={{height:'60vh', width:'20vw'}}
                >
                
                <div className="animal_card_content">
                    <img src={getFirstImage(pet)} alt="Animal" />
                    <div className="cato_fav">
                    <h2 className="animal_Category">
                        {pet.name}
                        <span className="breed"> / {pet.breed}</span>
                    </h2>
                    
                    </div>

                    <p
                    className="age"
                    style={{
                        color: "#929292",
                        textAlign: "left",
                        width: "100%",
                    }}
                    >
                    Age:{" "}
                    <span
                        style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#000000ff",
                        width: "100%",
                        textAlign: "left",
                        }}
                    >
                        {pet.age}
                    </span>
                    </p>
                    
                    <hr className="animal_card_divider"></hr>
                    <div className="animal_card_footer">
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-venus-mars"
                        ></i>{" "}
                        {pet.gender}
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-paw"
                        ></i>{" "}
                        {pet.type}
                    </span>
                    <span>
                        <i
                        style={{ color: "rgb(255, 145, 0)" }}
                        className="fas fa-dog"
                        ></i>{" "}
                        {pet.color}
                    </span>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p style={{ textAlign: "center", marginTop: "20px", color: "gray" }}>
                No pets found 🐾
            </p>
            )}
            
        </div>
        </div>
        
        )
}

