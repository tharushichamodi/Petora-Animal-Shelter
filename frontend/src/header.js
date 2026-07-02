import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

//css
import './css/header.css';
// images
import logopng from './images/logo.png';
import dogImg from './images/dog.png';
import catImg from './images/cat2.png';
import fishImg from './images/fish.png';
import rabbitImg from './images/rabbit.png';
import hamsterImg from './images/hamster2.png';
import birdImg from './images/bird.png';
import profilepng from './images/profile.png';
import vetImg from './images/vetImg.png';
import daycareImg from './images/daycareImg.png';
import trainingImg from './images/trainingImg.png';
import groomingImg from './images/groomingImg.png';
import adoptionImg from './images/adoptionImg.png';
import searchImg from './images/searchImg.png';
import cartImg from './images/cartImg.png';

import { Link } from 'react-router-dom'; 

import searchIcon from './images/store_search.png';

const categories = [
  { icon: '🐱', label: 'Cats', link: '/store#cat_store' },
  { icon: '🐶', label: 'Dogs', link: '/store#dog_store' },
  { icon: '🐠', label: 'Fish', link: '/store#fish_store' },
  { icon: '🦜', label: 'Birds', link: '/store#bird_store' },
  { icon: '🐰', label: 'Rabbit', link: '/store#rabbit_store' },
  { icon: '🐹', label: 'Hamster', link: '/store#hamster_store' },
  { icon: '🐭', label: 'Quinea Pig', link: '/store#guinea_store' },
];



function Header() {

    //seearch funtionality
    const [showSearch, setShowSearch] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (link) => {
    handleClose();
    setTimeout(() => navigate(link), 300);
  };

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowSearch(false);
      setAnimateOut(false);
      setSearchTerm('');
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  const filtered = categories.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  //globle session user id
  let userID = Number(localStorage.getItem('userID')) || 0;
  const [loggedin, setLoggedin] = useState( userID !== 0 );
  
  useEffect(() => {
    
  if(userID === 0){
    setLoggedin(false);
  }else{
    setLoggedin(true);
  }
    }, []);


    const handleDashboardClick = () =>{
        if(userID){
            console.log("userID :" , userID)
            navigate("/customer_dashboard");
        }
        else{
            alert("you have to log in first")
            navigate("/signup")
        }
    }
    const handleLogOut = () =>{
        userID = null;
        console.log(userID)
        navigate("/signup")
    }
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <div id="root" className="header_container">
            <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
            <header className={`home_header ${dropdownOpen ? "dropdown_open" : ""}`}>
                <nav className="navbar">
                    <div className="logo">
                        <img src={logopng} alt="Petora" />
                    </div>
                    <div>
                        <ul className="nav_links">
                            <li className="nav_obejects"><Link to="/home">Home</Link></li>
                            <li className="nav_obejects"><Link to="/aboutus_and_contactus#aboutUs-section">About us</Link></li>

                            <li className="nav_obejects dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                                <a href="#services">Services</a>
                                <ul className="dropdown_menu service_menu">
                                    <li className="service_card">
                                    <Link to="/services/veterinary">
                                        <img src={vetImg} alt="HealthCare" />
                                        <div className="card_content service_card_content">
                                        <h4>Health Care</h4>
                                        <span className="arrow">&#8594;</span>
                                        </div>
                                    </Link>
                                    </li>

                                    <li className="service_card">
                                    <Link to="/services/daycare">
                                        <img src={daycareImg} alt="Daycare" />
                                        <div className="card_content service_card_content">
                                        <h4>Daycare</h4>
                                        <span className="arrow">&#8594;</span>
                                        </div>
                                    </Link>
                                    </li>

                                    <li className="service_card">
                                    <Link to="/services/grooming">
                                        <img src={groomingImg} alt="Grooming" />
                                        <div className="card_content service_card_content">
                                        <h4>Grooming</h4>
                                        <span className="arrow">&#8594;</span>
                                        </div>
                                    </Link>
                                    </li>

                                    <li className="service_card">
                                    <Link to="/services/training">
                                        <img src={trainingImg} alt="Training" />
                                        <div className="card_content service_card_content">
                                        <h4>Training</h4>
                                        <span className="arrow">&#8594;</span>
                                        </div>
                                    </Link>
                                    </li>

                                    <li className="service_card">
                                    <Link to="/rescued_animals">
                                        <img src={adoptionImg} alt="Adoption" />
                                        <div className="card_content service_card_content">
                                        <h4>Adoption</h4>
                                        <span className="arrow">&#8594;</span>
                                        </div>
                                    </Link>
                                    </li>
                                </ul>
                            </li>


                            <li className="nav_obejects dropdown"  onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                                <a href="/store">Store</a>
                                <ul className="dropdown_menu pet_menu">
                                    <li className="pet_menu_card">
                                        <Link to="/store/dog">
                                            <img src={dogImg} alt="Dog" />
                                            <div className="card_content">
                                                <h4>Dog</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="pet_menu_card">
                                        <Link to="/store/cat">
                                            <img src={catImg} alt="Cat" />
                                            <div className="card_content">
                                                <h4>Cat</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="pet_menu_card">
                                        <Link to="/store/hamster">
                                            <img src={hamsterImg} alt="Hamster" />
                                            <div className="card_content">
                                                <h4>Hamster</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="pet_menu_card">
                                        <Link to="/store/rabbit">
                                            <img src={rabbitImg} alt="Rabbit" />
                                            <div className="card_content">
                                                <h4>Rabbit</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="pet_menu_card">
                                        <Link to="/store/fish">
                                            <img src={fishImg} alt="Fish" />
                                            <div className="card_content">
                                                <h4>Fish</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="pet_menu_card">
                                        <Link to="/store/birds">
                                            <img src={birdImg} alt="Birds" />
                                            <div className="card_content">
                                                <h4>Birds</h4>
                                                <span className="arrow">&#8594;</span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav_obejects"><Link to="/aboutus_and_contactus#contact-section">Contact Us</Link></li>
                        </ul>
                    </div>                
                    <div className="right_corner">
                        <div className="nav_obejects dropdown search" onMouseEnter={() => {setShowSearch(true);}} onMouseLeave={() => {setShowSearch(false);}}>
                            {/* <img src={searchImg} className="search_icon" alt="Search Icon" /> */}
                            <i className='fa fa-search'style={{fontSize:'25px', cursor:'pointer'}}></i>
                            <div className="dropdown_menu search_dropdown" >
                                {showSearch && (
                                    <div className={`store_search_modal_overlay ${animateOut ? 'store_fade_out' : 'store_fade_in'}`}>
                                        <div
                                        className={`store_search_modal ${animateOut ? 'store_slide_out' : 'store_slide_in'}`}
                                        ref={modalRef}
                                        >
                                        <div className="store_search_header">
                                            <h2>Search In Store</h2>
                                            <button className="store_close_btn" onClick={handleClose}>✕</button>
                                        </div>
                                        <input
                                            type="text"
                                            className="store_search_input"
                                            placeholder="Search for ..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <ul className="store_search_list">
                                            {filtered.map((item, idx) => (
                                            <li key={idx} onClick={() => handleClick(item.link)} className="store_search_item">
                                                <span className="store_icon">{item.icon}</span>
                                                {item.label}
                                            </li>
                                            ))}
                                        </ul>
                                        </div>
                                    </div>
                                    )}
                            </div>
                        </div>
                        {loggedin && 
                        <div className="dropdown profile">
                            {/* <img src={profilepng} alt="Profile Icon" /> */}
                            <i className='fa fa-user' style={{fontSize:'25px', cursor:'pointer'}}></i>
                            <div className="dropdown_menu profile_menu">
                                <a className="username">User Name</a>
                                <hr className="profile_name_hr"></hr>
                                <a className="dashboard" onClick={handleDashboardClick}>Dashboard</a>
                                <a className="logout_btn" onClick={handleLogOut}>log Out</a>
                            </div>
                        </div>
                    }
                        {loggedin &&
                        <div className="dropdown cart_cont" >
                            {/* <img src={cartImg} alt="Cart Icon"/> */}
                            <i className='fa fa-shopping-cart' style={{fontSize:'25px', cursor:'pointer'}}></i>
                        </div>
                        }
                        {!loggedin &&
                        <div className="login_signup" >
                            <Link to="/signup" className="login_btn" style={{textDecoration:'none', color:'black'}}>Log In / Sign Up</Link>
                        </div>
                        }
                    </div>                    
                    
                </nav>
            </header>
            
                        
        </div>        
    );
}

export default Header;
