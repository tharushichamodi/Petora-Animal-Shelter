import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './css/fill_adoption_application.css';
function FillAdoptionApplication({ onClose, setOverlay, selectedAnimalId }) {
    //add children
    const [ageType, setAgeType] = useState("");
    const [age, setAge] = useState("");
    const [ageList, setAgeList] = useState([]);
    const handleAddChild = () => {
    if (ageType && age) {
      // Add new pair to array
      setAgeList([...ageList, { type: ageType, value: age }]);

      // Reset fields
      setAgeType("");
      setAge("");
    }
  };

  // add pets
  const [petType, setPetType] = useState("");
    const [num, setNum] = useState("");
    const [petList, setPetList] = useState([]);
    const handleAddPet = () => {
    if (petType && num) {
      // Add new pair to array
      setPetList([...petList, { type: petType, value: num }]);

      // Reset fields
      setPetType("");
      setNum("");
    }
  };
  //handle age delete
  const handleAgeDelete = (indexToDelete) => {
    setAgeList(ageList.filter((_, index) => index !== indexToDelete));
  };
// handel pet delerte
const handlePetDelete = (indexToDelete) => {
    setPetList(petList.filter((_, index) => index !== indexToDelete));
  };
  const navigate = useNavigate();

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    let userID = localStorage.getItem('userID');

    // Collect data from form fields
    const data = {
userID: userID, // Replace with the logged-in user's ID
  animalID: selectedAnimalId, // Replace with the selected animal's ID
  full_name: form.full_name.value || "",
  email_address: form.email_address.value || "",
  address: form.address.value || "",
  phone_number: form.phone_number.value || "",
  dob: form.dob.value || "",

  residence_type: form.residence_type.value || "",
  ownership_status: form.ownership_status.value || "",
  household_members: form.household_members.value || 0,
  children: ageList.length > 0 ? ageList : [],

  current_pets: form.current_pets.value || "",
  pets: petList.length > 0 ? petList : [],
  vaccination_status: form.vaccination_status.value || "",
  past_pets: form.past_pets.value || "",

  adoption_reason: form.adoption_reason.value || "",
  pet_environment: form.pet_environment.value || "",
  alone_hours: form.alone_hours.value || 0,
  backup_caretaker: form.backup_caretaker.value || "",

  additional_notes: form.additional_notes.value || "",
  agreement: form.agreement.checked || false
};

console.log('Form Data:', data); // Log the collected data

    try {
      const response = await Axios.post('http://localhost:3001/adoptionApplication/api/adoptionApplications',
        data
      );
      console.log('Application submitted:', response.data);
      alert('Application submitted successfully!');
      navigate('/rescued_animals');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const [currentPets, setCurrentPets] = useState(true);
    const handleCurrentPetsChange = (e) => {
        if(e.target.value === 'yes'){
            setCurrentPets(true);
        } else{
            setCurrentPets(false);
        }
        
    };
  return (
        <div className='fill_adoption_form_container' onClick={onClose} >
            <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>
            <div className='adoption_form_cont' onClick={(e) => e.stopPropagation()} >
                <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}>
                    <button type='button' className='form_close_button' onClick={onClose}><i className='fa-solid fa-close'></i></button>
                </div>
                
                <h1>Adoption Application</h1>
                <form className="adoption_form" onSubmit={handleSubmit}>

                    {/* Personal Information */}
                    <div className="form_section personal_info">
                    <h3 className="section_title">Personal Information</h3>
                    <div className="FAA form_group">
                        <label htmlFor="full_name">Full Name</label>
                        <input className='FAA_input' type="text" id="full_name" name="full_name" />
                    </div>
                    <div className="FAA form_group">
                        <label htmlFor="email_address">Email Address</label>
                        <input className='FAA_input' type="email" id="email_address" name="email_address" />
                    </div>
                    
                    <div className="FAA form_group">
                        <label htmlFor="address">Address</label>
                        <textarea className='FAA_input textarea' id="address" name="address"></textarea>
                    </div>
                    <div style={{display:'flex', gap:'100px'}}>
                        <div className="FAA form_group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input className='FAA_input phone' type="text" id="phone_number" name="phone_number" />
                        </div>
                        <div className="FAA form_group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input className='FAA_input date' type="date" id="dob" name="dob" />
                        </div>
                    </div>
                    </div>
                    

                    {/* Household Information */}
                    <div className="form_section household_info">
                    <h3 className="section_title">Household Information</h3>
                    <div style={{display:'flex', gap:'100px'}}>
                        <div className="FAA form_group">
                            <label htmlFor="residence_type">Type of Residence</label>
                            <select className='selection residence_type' id="residence_type" name="residence_type">
                                <option value="">Select</option>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="farm">Farm</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="FAA form_group">
                            <label htmlFor="ownership_status">Do you own or rent?</label>
                            <select className='selection ownership_status' id="ownership_status" name="ownership_status">
                                <option value="">Select</option>
                                <option value="own">Own</option>
                                <option value="rent">Rent</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="FAA form_group">
                        <label htmlFor="household_members">Number of people in household</label>
                        <input className='FAA_input' type="number" id="household_members" name="household_members" />
                    </div>
                    <div className="FAA form_group">
                        <label htmlFor="children_info">Children (ages)</label>
                            <div  className='FAA_add_child_cont' style={{display:'flex', gap:'30px'}}>
                                <select className='selection add_age_type' type='text' id='add_age_type' name='add_age_type' onChange={(e) => setAgeType(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="years" >Year</option>
                                    <option value="months">Month</option>
                                </select>

                                <input className='FAA_input add_age' type='number' id='add_age' name='add_age' onChange={(e) => setAge(e.target.value)} />
                                
                            </div>
                            <div>
                                <button type="button" className='FAA_add_btn' onClick={handleAddChild}>Add</button>
                            </div>
                            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'10px'}}>
                                {ageList.map((item, index) => (
                                <div key={index}className='FAA_added_child'>
                                    <div><span>{item.value} </span><span> {item.type}</span></div>
                                    <button type='button' onClick={() => handleAgeDelete(index)} style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}}><i className='fa-solid fa-trash-can' style={{color:'red'}}></i></button>
                                </div>
                                ))}
                                                           
                            </div>
                    </div>
                    </div>

                    {/* Pet Ownership History */}
                    <div className="form_section pet_history">
                    <h3 className="section_title">Pet Ownership History</h3>
                    <div style={{display:'flex', gap:'100px'}}>
                        <div className="FAA form_group">
                            <label htmlFor="current_pets">Do you currently own pets?</label>
                            <select className='selection' id="current_pets" name="current_pets" onChange={handleCurrentPetsChange}>
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            </select>
                            
                            <div  className='FAA_add_pet_cont' style={{display:'flex', gap:'30px'}}>
                                <input className='FAA_input add_pet_type' type='text' id='add_pet_type' name='add_pet_type' onChange={(e) => setPetType(e.target.value)} disabled={!currentPets}/>
                                <input className='FAA_input add_pet_num' type='number' id='add_pet_num' name='add_pet_num' onChange={(e) => setNum(e.target.value)} disabled={!currentPets}/>

                            </div>
                            <div>
                                <button type='button' className='FAA_add_btn' onClick={handleAddPet} disabled={!currentPets}>Add</button>
                            </div>
                            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'10px'}}>
                                {petList.map((item, index) => (
                                <div key={index} className='FAA_added_pets'>
                                    <div>
                                        <span>{item.type} </span><span>:</span><span> {item.value}</span>
                                    </div>
                                    <button type='button' onClick={() => handlePetDelete(index)} style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}}><i className='fa-solid fa-trash-can' style={{color:'red'}}></i></button>                                
                                </div>
                                ))}
                                                         
                            </div>
                        </div>
                        
                        
                    </div>
                    <div className="FAA form_group">
                            <label htmlFor="vaccination_status">Are current pets vaccinated?</label>
                            <select className='selection' id="vaccination_status" name="vaccination_status">
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    
                    <div className="FAA form_group">
                        <label htmlFor="past_pets">Have you had pets before?</label>
                        <select className='FAA_input textarea' id="past_pets" name="past_pets">
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    
                    </div>

                    {/* Lifestyle & Care */}
                    <div className="form_section lifestyle_info">
                    <h3 className="section_title">Lifestyle & Care Plans</h3>
                    <div className="FAA form_group">
                        <label htmlFor="adoption_reason">Why do you want to adopt?</label>
                        <textarea className='FAA_input textarea' id="adoption_reason" name="adoption_reason"></textarea>
                    </div>
                    <div className="FAA form_group">
                        <label htmlFor="pet_environment">Where will the pet spend most of its time?</label>
                        <select className='selection' id="pet_environment" name="pet_environment">
                        <option value="">Select</option>
                        <option value="indoors">Indoors</option>
                        <option value="outdoors">Outdoors</option>
                        <option value="both">Both</option>
                        </select>
                    </div>
                    <div className="FAA form_group">
                        <label htmlFor="alone_hours">How many hours will the pet be left alone?</label>
                        <input className='FAA_input' type="number" id="alone_hours" name="alone_hours" style={{width:'80px'}}/>
                    </div>
                    <div className="FAA form_group">
                        <label htmlFor="backup_caretaker">Who will care for the pet if you cannot?</label>
                        <input className='FAA_input' type="text" id="backup_caretaker" name="backup_caretaker" />
                    </div>
                    </div>

                    {/* Notes */}
                    <div className="form_section additional_notes">
                    <h3 className="section_title">Additional Notes</h3>
                    <div className="FAA form_group">
                        <textarea className='FAA_input textarea' id="additional_notes" name="additional_notes" placeholder="Anything else you'd like us to know"></textarea>
                    </div>
                    </div>

                    {/* Agreement */}
                    <div className="form_section agreement">
                    <div className="form_group checkbox_group" style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <input type="checkbox" id="agreement" name="agreement" style={{width:'15px'}} />
                        <label htmlFor="agreement">
                        I certify that the above information is true and I agree to provide proper care for the adopted animal.
                        </label>
                    </div>
                    </div>

                    {/* Submit */}
                    <div className="form_section submit_section">
                    <button type="submit" className="FAA_submit_btn" >Submit Application</button>
                    </div>

                </form>
            </div>  
        </div>
  );
}

export default FillAdoptionApplication;
