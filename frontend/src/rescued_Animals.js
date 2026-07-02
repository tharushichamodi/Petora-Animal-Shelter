import React, { useRef, useEffect, useState, use } from 'react';

import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


import './css/rescued_Animals.css'; // Import the CSS file for styling
import dogImg1 from './images/dog3.jpg'; // Import an image for the rescued animals
import catImg4 from './images/cat4.jpg'; // Import an image for the rescued animals
import kittyImg from './images/kitty.jpg'; // Import another image for the rescued animals
import dogImg2 from './images/dog2.jpg'; // Import another image for the rescued animals
import catImg2 from './images/cat2.png'; // Import another image for the rescued animals
import puppyImg from './images/puppy.jpg'; // Import another image for the rescued animals
import sideImg1 from './images/sideImg1.png'; // Import a side image for the layout
import rabbitImg from './images/rabbit1.jpg';
import birdImg from './images/bird1.jpg';
import catImg3 from './images/cat3.jpg';
import hamsterImg from './images/hamster1.jpg';
import fishImg from './images/fish1.jpg';
import dogImg3 from './images/dog3.jpg';
import guineaPigImg from './images/guineaPig1.jpg';
import dogImg from './images/dog.png';
import noResultsImg from './images/no_result_found.png';

import Footer from './footer';
import Header from './header';

function RescuedAnimals() {
    
    //searching
    const [search_query, set_search_query] = useState('');
    const [suggestedAnimals, setSuggestedAnimals] = useState([]);
    
    const handle_change = (event) => {

        const query = event.target.value.toLowerCase();
        set_search_query(query);
        if (query.trim() === '') {
        setSuggestedAnimals([]); // Clear suggestions if input is empty
        return;        
        }
        const matches = animals.filter(animal =>
        animal.species.toLowerCase().includes(query) ||
        animal.breed.toLowerCase().includes(query) ||
        animal.color.toLowerCase().includes(query)
        );
        setSuggestedAnimals(matches);
    };

    

    
    //search and filter both
    const handle_key_press = (event) => {
        if (event.key === 'Enter') {
            handle_search_and_filters(); // Use combined logic
        }
    };

    //suggestions 
    const highlightMatch = (text, query) => {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) return text;

    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);

    return (
        <>
        {before}
        <strong>{match}</strong>
        {after}
        </>
    );
    };

    //dropdown
    const dropdownRef = useRef(null); // CHANGED
    const inputRef = useRef(null); 

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            inputRef.current &&
            !inputRef.current.contains(event.target)
        ) {
            setSuggestedAnimals([]); // CHANGED: Close dropdown
        }
    };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside); // CHANGED
    };

    }, []);
    useEffect(() => {
        if (dropdownRef.current) {
            if (suggestedAnimals.length > 0) {
                const scrollHeight = dropdownRef.current.scrollHeight;
                dropdownRef.current.style.maxHeight = `${scrollHeight}px`;
                dropdownRef.current.style.opacity = 1;
            } else {
                dropdownRef.current.style.maxHeight = '0px';
                dropdownRef.current.style.opacity = 0;
            }
        }
    }, [suggestedAnimals]);
    
    //filters
    const [is_filter_box_open, set_is_filter_box_open] = useState(false);

    const toggle_filter_box = () => {
        set_is_filter_box_open(!is_filter_box_open);
    };

    
    //search and filters
    const [searchResults, setSearchResults] = useState([]);

    const handle_search_and_filters = () => {
        setSearchOrFilterApplied(true);
        console.log('Applying search and filters...');

        let filtered = animals;

        // 1. SEARCH query filter (name, breed, color)
        if (search_query.trim() !== '') {
            const query = search_query.toLowerCase();
            filtered = filtered.filter(animal =>
                animal.species.toLowerCase().includes(query) ||
                animal.breed.toLowerCase().includes(query) ||
                animal.color.toLowerCase().includes(query)
            );
        }

        // 2. Animal Type filter
        if (selectedAnimalTypes.length > 0) {
            filtered = filtered.filter(animal =>
                selectedAnimalTypes.includes(animal.name)
            );
        }

        // 3. Age Range filter
        if (selectedAgeRanges.length > 0) {
            filtered = filtered.filter(animal => {
                const [ageValue, ageUnit] = animal.age.split(' ');
                const ageNumber = parseInt(ageValue);

                return selectedAgeRanges.some(range => {
                    return (
                        (range === '3 - 6 Months' && ageNumber >= 3 && ageNumber <= 6 && ageUnit === 'months') ||
                        (range === '6 - 12 Months' && ageNumber > 6 && ageNumber <= 12 && ageUnit === 'months') ||
                        (range === '1 - 2 Years' && ageNumber >= 1 && ageNumber < 2 && ageUnit === 'years') ||
                        (range === 'Above 2 Years' && ageNumber >= 2 && ageUnit === 'years')
                    );
                });
            });
        }

        // 4. Breed filter
        if (selectedBreeds.length > 0) {
            filtered = filtered.filter(animal =>
                selectedBreeds.includes(animal.breed)
            );
        }

        // 5. Adopt Status filter
        if (selectedAdoptStatuses.length > 0) {
            filtered = filtered.filter(animal =>
                selectedAdoptStatuses.includes(animal.adopt_status)
            );
        }

        // 6. Gender filter
        if (selectedGenders.length > 0) {
            filtered = filtered.filter(animal =>
                selectedGenders.includes(animal.gender)
            );
        }

        // Save the filtered result
        setSearchResults(filtered);
        setSuggestedAnimals([]); // Hide suggestions
        set_is_filter_box_open(false); // Close filter box
    };


    const handle_apply_filters = () => {
        handle_search_and_filters(); // Use combined logic
    };   

    const [is_summery_opened, set_is_summery_opened] = useState(false);

    const toggle_summery_dropdown = () =>{
        set_is_summery_opened(!is_summery_opened);
    };


    const [animals, setAnimals] = useState([]);
useEffect(() => {
  const fetchAnimals = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animalProfile/api/animalProfiles");
      setAnimals(res.data);
    } catch (error) {
      console.error("Error fetching animal profiles:", error);
    }
  };

  fetchAnimals();
}, []);

   
    const [dogCount, setDogCount] = useState(0);
    const [catCount, setCatCount] = useState(0);
    const [rabbitCount, setRabbitCount] = useState(0);
    const [birdCount, setBirdCount] = useState(0);
    const [hamsterCount, setHamsterCount] = useState(0);
    const [fishCount, setFishCount] = useState(0);
    const [guineaPigCount, setGuineaPigCount] = useState(0);
    
    useEffect(() => {
        let dog = 0, cat = 0, rabbit = 0, bird = 0, hamster = 0, fish = 0, guineaPig = 0;
        animals.forEach(animal => {
        switch (animal.name) {
            case 'Dog':
            dog++;
            break;
            case 'Cat':
            cat++;
            break;
            case 'Rabbit':
            rabbit++;
            break;
            case 'Bird':
            bird++;
            break;
            case 'Hamster':
            hamster++;
            break;
            case 'Fish':
            fish++;
            break;
            case 'Guinea Pig':
            guineaPig++;
            break;
            default:
            break;
        }
        });

        setDogCount(dog);
        setCatCount(cat);
        setRabbitCount(rabbit);
        setBirdCount(bird);
        setHamsterCount(hamster);
        setFishCount(fish);
        setGuineaPigCount(guineaPig);
    }, []);
    const animal_types = [
        { name: 'Dog', count: dogCount },
        { name: 'Cat', count: catCount },
        { name: 'Rabbit', count: rabbitCount },
        { name: 'Bird', count: birdCount },
        { name: 'Fish', count: fishCount },
        { name: 'Hamster', count: hamsterCount },
        { name: 'Guinea Pig', count: guineaPigCount },
        // Add more animal types as needed
    ];

    const [range1, set_range1] = useState(0);
    const [range2, set_range2] = useState(0);
    const [range3, set_range3] = useState(0);
    const [range4, set_range4] = useState(0);

    useEffect(() => {
        let range1count = 0;
        let range2count = 0;
        let range3count = 0;
        let range4count = 0;

        animals.forEach(animal => {
            const [ageValue, ageUnit] = animal.age.split(' ');
            const ageNumber = parseInt(ageValue);

            if (ageNumber <= 3 && ageUnit === 'months') {
            range1count++;
            } else if (ageNumber <= 12 && ageUnit === 'months') {
            range2count++;
            } else if (ageNumber < 2 && ageUnit === 'year') {
            range3count++;
            } else if (ageNumber >= 2 && ageUnit === 'years') {
            range4count++;
            }
        });

        // Set all states at the end
        set_range1(range1count);
        set_range2(range2count);
        set_range3(range3count);
        set_range4(range4count);
        }, []);
    const age_range = [
        { range:'3 - 6 Months', count:range1},
        { range:'6 - 12 Months', count: range2},
        {range:'1 - 2 Years', count:range3},
        {range:'Above 2 Years', count:range4}
    ];

    const [breedCountsArr, setBreedCountsArr] = useState([]);

    useEffect(() => {
        const counts = {};

        animals.forEach(animal => {
            const breed = animal.breed;
            counts[breed] = (counts[breed] || 0) + 1;
        });

        const arr = Object.entries(counts).map(([breed, count]) => ({
            breed,
            count
        }));

        setBreedCountsArr(arr);
    }, []);

    const [ready, setReady] = useState(0);
    const [underCare, setUnderCare] = useState(0);

    useEffect(() => {
        let readyCount = 0, underCareCount = 0;
         animals.forEach(animal =>{
            switch(animal.adopt_status){
                case 'Ready for Adopt':
                readyCount++;
                case 'Under Care':
                underCareCount++

            }

         })
         setReady(readyCount);
         setUnderCare(underCareCount);
    },[])
        const adopt_status = [
            { status:'Ready for Adopt', count: ready },
            {status:'Under Care', count:underCare}
        ];

    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0); // Optional for 'Unknown' or other

    useEffect(() => {
        let male = 0, female = 0, unknown = 0;

        animals.forEach(animal => {
            switch (animal.gender) {
                case 'Male':
                    male++;
                    break;
                case 'Female':
                    female++;
                    break;
                default:
                    unknown++; // If gender is 'Unknown' or not matched
            }
        });

        setMaleCount(male);
        setFemaleCount(female);
        setUnknownCount(unknown); // Optional
    }, []); // Depend on animals array

        const genders = [
        { gender: 'Male', count: maleCount },
        { gender: 'Female', count: femaleCount },
        { gender: 'Unknown', count: unknownCount } // Optional
    ];

    //apply filters
    const [selectedAnimalTypes, setSelectedAnimalTypes] = useState([]);
    const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [selectedAdoptStatuses, setSelectedAdoptStatuses] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);

    const handleAnimalTypeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedAnimalTypes(prev =>
            checked ? [...prev, value] : prev.filter(type => type !== value)
        );
    };

    const handleAgeRangeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedAgeRanges(prev =>
            checked ? [...prev, value] : prev.filter(range => range !== value)
        );
    };

    const handleBreedChange = (event) => {
        const { value, checked } = event.target;
        setSelectedBreeds(prev =>
            checked ? [...prev, value] : prev.filter(breed => breed !== value)
        );
    };

    const handleAdoptStatusChange = (event) => {
        const { value, checked } = event.target;
        setSelectedAdoptStatuses(prev =>
            checked ? [...prev, value] : prev.filter(status => status !== value)
        );
    };

    const handleGenderChange = (event) => {
        const { value, checked } = event.target;
        setSelectedGenders(prev =>
            checked ? [...prev, value] : prev.filter(gender => gender !== value)
        );
    };


    // initial
    const [initialAnimals, setInitialAnimals] = useState([]);

    useEffect(() => {
    if (animals && animals.length > 0) {
        setInitialAnimals(animals.slice(0, 30)); // Only first 30
        console.log("Initial animals set:", animals.slice(0, 30));
    }
}, [animals]);
    
    //track if search/filter applied
    const [searchOrFilterApplied, setSearchOrFilterApplied] = useState(false);

    // define colums
      const [columns, setColumns] = useState(window.innerWidth < 1400 ? 4 : 5);
    
      useEffect(() => {
        const handleResize = () => {
          setColumns(window.innerWidth < 1400 ? 4 : 5);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
    const navigate = useNavigate();

    const handleAnimalCardClick = (animal) => {
        const animalProfile = animal;
        navigate('/animal_profile', { state: { animalProfile } });
        
    }
    return (
        <div className="rescued_animals">
            <Header />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
            <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet"/>
            
            <main className='rescued_animals_main'>
                
                <h1>Find Your New Best Friend</h1>
                <div className="res_ani_search_bar_container">
                    <div className="res_ani_search_input_wrapper">
                        <input
                            type="text"
                            className="res_ani_search_input"
                            placeholder="Search..."
                            value={search_query}
                            onChange={handle_change}
                            onKeyPress={handle_key_press}
                            ref={inputRef}
                        />
                        <button
                            className="res_ani_search_button" 
                            onClick={handle_search_and_filters}
                            aria-label="Search"
                        >
                            <svg
                                className="res_ani_search_icon" 
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                    <div ref={dropdownRef} className="suggestion_dropdown">
                        <ul className="suggestion_list">
                            {suggestedAnimals.map((animal, index) => {
                                const nameParts = highlightMatch(animal.species, search_query);
                                const breedParts = highlightMatch(animal.breed, search_query);

                                return (
                                <li key={index} onClick={() => handleAnimalCardClick(animal)}>
                                    <img style={{width:'50px', height:'50px', objectFit:'cover', overflow:'hidden',borderRadius:'50%'}} src={getFirstImage(animal)} alt="Animal" />
                                    <span>
                                    {nameParts}
                                    <span style={{fontSize:'12px', margin:'0', padding:'0'}}> /{breedParts}</span>
                                    <p style={{fontSize:'10px', marginTop:'0', padding:'0', transform:'translateY(10px)'}}>
                                        <span style={{marginRight:'20px'}}><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-venus-mars"></i> {animal.gender}</span>
                                        <span style={{marginRight:'20px'}}><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-paw"></i> {animal.weight}</span>
                                        <span style={{marginRight:'20px'}}><i style={{ color: 'rgb(255, 145, 0)' }} className="fas fa-dog"></i> {animal.color}</span>
                                    </p>
                                    </span>
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                        
                </div>

                <div className="res_ani_filter_container">
                    {/* The "Show filters" button */}
                    <button
                        className="res_ani_filter_button"
                        onClick={toggle_filter_box}
                        aria-expanded={is_filter_box_open}
                        aria-controls="res_ani_filter_box_id"
                    >
                        <svg
                            className="res_ani_filter_button_icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                        <span className="res_ani_filter_button_text">Show filters</span>
                    </button>

                    {/* Overlay that appears when the filter box is open */}
                    {is_filter_box_open && (
                        <div
                            className="res_ani_filter_overlay"
                            onClick={toggle_filter_box}
                            role="button"
                            tabIndex={0}
                            aria-label="Close filters"
                        ></div>
                    )}

                    <div
                        id="res_ani_filter_box_id"
                        className={`res_ani_filter_box ${is_filter_box_open ? 'res_ani_filter_box_open' : ''}`}
                        aria-hidden={!is_filter_box_open}
                    >
                        {/* Header Section */}
                        <div className="res_ani_filter_header">
                            <h2 className="res_ani_filter_title">Filters</h2>
                            <button className="res_ani_close_button" onClick={toggle_filter_box}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Main Filter Content Area */}
                        <div className="res_ani_filter_content_scrollable">
                            {/* Animal Type Section using <details> and <summary> */}
                            <details className="res_ani_filter_section"> 
                                <summary className="res_ani_filter_section_header" onClick={toggle_summery_dropdown}>
                                    <h3 className="res_ani_section_title">Animal Type</h3>
                                    {/* Custom SVG icon for expand/collapse arrow */}
                                    <svg
                                        className="res_ani_expand_arrow"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </summary>
                                {/* This content will be natively toggled by the <details> element */}
                                <div className="res_ani_checkbox_list">
                                    {animal_types.map((type) => (
                                        <label key={type.name} className="res_ani_checkbox_item">
                                            <input
                                                type="checkbox"
                                                value={type.name}
                                                checked={selectedAnimalTypes.includes(type.name)}
                                                onChange={handleAnimalTypeChange}
                                                className="res_ani_checkbox_input"
                                            />
                                            <span className="res_ani_checkbox_text">{type.name}</span>
                                            <span className="res_ani_checkbox_count">({type.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                            <details className="res_ani_filter_section"> 
                                <summary className="res_ani_filter_section_header" onClick={toggle_summery_dropdown}>
                                    <h3 className="res_ani_section_title">Age Range</h3>
                                    {/* Custom SVG icon for expand/collapse arrow */}
                                    <svg
                                        className="res_ani_expand_arrow"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </summary>
                                {/* This content will be natively toggled by the <details> element */}
                                <div className="res_ani_checkbox_list">
                                    {age_range.map((age) => (
                                        <label key={age.range} className="res_ani_checkbox_item">
                                            <input
                                                type="checkbox"
                                                value={age.range}
                                                checked={selectedAgeRanges.includes(age.range)}
                                                onChange={handleAgeRangeChange}
                                                className="res_ani_checkbox_input"
                                            />
                                            <span className="res_ani_checkbox_text">{age.range}</span>
                                            <span className="res_ani_checkbox_count">({age.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                            {/* Add more filter sections here if needed */}
                            <details className="res_ani_filter_section"> 
                                <summary className="res_ani_filter_section_header" onClick={toggle_summery_dropdown}>
                                    <h3 className="res_ani_section_title">Breeds</h3>
                                    {/* Custom SVG icon for expand/collapse arrow */}
                                    <svg
                                        className="res_ani_expand_arrow"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </summary>
                                {/* This content will be natively toggled by the <details> element */}
                                <div className="res_ani_checkbox_list">
                                    {breedCountsArr.map((breed) => (
                                        <label key={breed.breed} className="res_ani_checkbox_item">
                                            <input
                                                type="checkbox"
                                                value={breed.breed}
                                                checked={selectedBreeds.includes(breed.breed)}
                                                onChange={handleBreedChange }
                                                className="res_ani_checkbox_input"
                                            />
                                            <span className="res_ani_checkbox_text">{breed.breed}</span>
                                            <span className="res_ani_checkbox_count">({breed.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                            <details className="res_ani_filter_section"> 
                                <summary className="res_ani_filter_section_header" onClick={toggle_summery_dropdown}>
                                    <h3 className="res_ani_section_title">Adopt Status</h3>
                                    {/* Custom SVG icon for expand/collapse arrow */}
                                    <svg
                                        className="res_ani_expand_arrow"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </summary>
                                {/* This content will be natively toggled by the <details> element */}
                                <div className="res_ani_checkbox_list">
                                    {adopt_status.map((status) => (
                                        <label key={status.status} className="res_ani_checkbox_item">
                                            <input
                                                type="checkbox"
                                                value={status.status}
                                                checked={selectedAdoptStatuses.includes(status.status)}
                                                onChange={handleAdoptStatusChange }
                                                className="res_ani_checkbox_input"
                                            />
                                            <span className="res_ani_checkbox_text">{status.status}</span>
                                            <span className="res_ani_checkbox_count">({status.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                            <details className="res_ani_filter_section"> 
                                <summary className="res_ani_filter_section_header" onClick={toggle_summery_dropdown}>
                                    <h3 className="res_ani_section_title">Gender</h3>
                                    {/* Custom SVG icon for expand/collapse arrow */}
                                    <svg
                                        className="res_ani_expand_arrow"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </summary>
                                {/* This content will be natively toggled by the <details> element */}
                                <div className="res_ani_checkbox_list">
                                    {genders.map((genders) => (
                                        <label key={genders.gender} className="res_ani_checkbox_item">
                                            <input
                                                type="checkbox"
                                                value={genders.gender}
                                                checked={selectedGenders.includes(genders.gender)}
                                                onChange={handleGenderChange }
                                                className="res_ani_checkbox_input"
                                            />
                                            <span className="res_ani_checkbox_text">{genders.gender}</span>
                                            <span className="res_ani_checkbox_count">({genders.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                        </div>

                        {/* Apply Button Section */}
                        <div className="res_ani_filter_footer">
                            <button
                                className="res_ani_apply_button"
                                onClick={handle_apply_filters}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{width:'90%'}}>
                    {!searchOrFilterApplied && (      
                        <h2 style={{fontSize:'25px', textAlign:'left', marginLeft:'50px'}}>Animals you may like</h2>
                    )}
                    {searchOrFilterApplied && searchResults.length > 0 && (      
                        <h2 style={{fontSize:'25px', textAlign:'left', marginLeft:'50px'}}>Search Result</h2>
                    )}
                    {searchOrFilterApplied && searchResults.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <h2 style={{ fontSize: '25px', textAlign: 'center', color: '#555' }}>
                            No Result Found
                            </h2>
                            <img 
                            src={noResultsImg} // Replace with your actual image import
                            alt="No results found" 
                            style={{ maxWidth: '400px', marginBottom: '10px' }}
                            />
                            <h2 style={{fontSize:'25px', textAlign:'left', marginLeft:'50px'}}>Animals you may like</h2>                            
                        </div>
                    )}
                </div>
               
                <RescuedAnimalList searchResults = {searchResults} initialAnimals = {initialAnimals} columns={columns} setAnimals={setAnimals} />

                
                <div className='rescued_animals_bottom'>
                    <div className='adoption_process_overview'>
                        <h2 style={{fontSize:'50px'}}>Adoption Process Overview</h2>
                        <p style={{fontSize:'25px'}}>The adoption process involves several steps to ensure a good match between the animal and the adopter.</p>
                        <ul>
                            <li><i className='fa-solid fa-globe' ></i>  Browse Available Animals.</li>
                            <li><i className='fa-regular fa-file' ></i>  Submit an Adoption Application.</li>
                            <li><i className="fa-regular fa-handshake"></i>  Schedule a Visit / Interview.</li>
                            <li><i className="fa fa-dog"></i>  Welcome Your New Friend Home!</li>
                        </ul>
                    </div>
                    <div className='side_img_1'>
                        <img src={sideImg1} alt="Side Image 1" className='sideImg img1' />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default RescuedAnimals;

   const getFirstImage = (animal) => {
        const imgUrl = animal.photos && animal.photos.length > 0 ? animal.photos[0] : '';
        return `http://localhost:3001/uploads/${imgUrl}`;
    }

export function RescuedAnimalList({searchResults, initialAnimals, columns, setAnimals}){

    //add to fav
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

    const navigate = useNavigate();

    const handleAnimalCardClick = (animal) => {
        const animalProfile = animal;
        navigate('/animal_profile', { state: { animalProfile } });
        
    }
    
    const handleDeleteProfile = (a) =>{
        try {
            // Make API call to delete the animal profile
            Axios.delete(`http://localhost:3001/animalProfile/api/animalProfiles/${a.animalProfileID}`)
                .then(response => {
                    console.log('Profile deleted:', response.data);
                    
                })
                .catch(error => {
                    console.error('Error deleting profile:', error);
                });

            Axios.get(`http://localhost:3001/animalProfile/api/animalProfiles`)
            .then(response => {
                    setAnimals(response.data)                    
                }).catch(error => {
                    console.error('Error deleting profile:', error);
                });

        } catch (error) {
            console.error('Error:', error);
        }
    }
    return(
        <div className='rescued_animals_content' style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
                    
        {(searchResults.length > 0 
            ? searchResults 
            : initialAnimals
        ) && (searchResults.length > 0 || (initialAnimals && initialAnimals.length > 0)) ? (
        (searchResults.length > 0 ? searchResults : initialAnimals).map((animals, index) => (
        <div
        key={index}
        className="animal_card"
        onClick={() => handleAnimalCardClick(animals)}
        >
        <div className="adopt_status_label">
            <span>{animals.adoptionStatus}</span>
        </div>
        <div className="animal_card_content">
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end'}}><i onClick={(e) => {e.stopPropagation(); handleDeleteProfile(animals);}} className='fa fa-trash' style={{fontSize:'12px', color:'red'}}></i></div>
            <img src={getFirstImage(animals)} alt="Animal" />
            <div className="cato_fav">
            <h2 className="animal_Category">
                {animals.species}
                <span className="breed"> / {animals.breed}</span>
            </h2>
            <button
                className="add_favorite"
                onClick={() => addToFav(animals)}
                style={{
                color: isFavorited(animals) ? "rgb(255, 145, 0)" : "",
                border: isFavorited(animals) ? "2px solid rgb(255, 145, 0)" : "",
                }}
            >
                <i className="far fa-heart"></i>
            </button>
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
                {animals.age}
            </span>
            </p>
            <p className="description">{animals.description}</p>
            <hr className="animal_card_divider"></hr>
            <div className="animal_card_footer">
            <span>
                <i
                style={{ color: "rgb(255, 145, 0)" }}
                className="fas fa-venus-mars"
                ></i>{" "}
                {animals.gender}
            </span>
            <span>
                <i
                style={{ color: "rgb(255, 145, 0)" }}
                className="fas fa-paw"
                ></i>{" "}
                {animals.weight}
            </span>
            <span>
                <i
                style={{ color: "rgb(255, 145, 0)" }}
                className="fas fa-dog"
                ></i>{" "}
                {animals.color}
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
    )
}