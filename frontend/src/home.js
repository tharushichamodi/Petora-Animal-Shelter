import './css/home.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Footer from './footer';
import Header from './header';
import DisplayReviews from './display_reviews';
import { Suggested_Animals } from './animal_profile';

import back1png from './images/homepage1.png';
import back2png from './images/homepage2.png';
import back3png from './images/homepage3.png';
import back4png from './images/homepage4.png';
import back5png from './images/homepage5.png';
import back6png from './images/homepage6.png';
import back7png from './images/homepage7.jpg';
import back8png from './images/homepage8.jpg';

import vetpng from './images/home_vet-icon.jpg';
import daycarepng from './images/home_daycare-icon.jpg';
import groompng from './images/home_groom-icon.jpg';
import adoptpng from './images/home_adopt-icon.jpg';
import trainpng from './images/home_train-icon.jpg';
import storepng from './images/home_store-icon.jpg';

import pet1 from './images/home_pet1.png';
import pet2 from './images/home_pet2.png';
import pet3 from './images/home_pet3.png';
import pet4 from './images/home_pet4.png';


import promoBanner from './images/home_banner_Shop.jpg';
import catCard from './images/home_banner_shop3.jpg';
import dogCard from './images/home_banner_Shop4.jpg';
import hamsterImg from './images/hamster2.png';

import brand1 from './images/home_nexgard.png';
import brand2 from './images/home_meo.png';
import brand3 from './images/home_lider.jpg';
import brand4 from './images/home_frontline.png';
import brand5 from './images/home_bayer.png';
import brand6 from './images/home_beaphar.jpg';
import brand7 from './images/home_americalitter.png';
import brand8 from './images/home_divinus.png';
import brand9 from './images/home_royalcanin.png';
import brand10 from './images/home_bioline.jpg';
import brand11 from './images/home_aspen.jpg';
import brand12 from './images/home_whiskas.jpg';
import brand13 from './images/home_leorando.jpeg';


const brandLogos = [
  brand1,brand2,brand3,brand4, brand5,brand6,brand7,brand8,brand9,brand10,brand11,brand12, brand13
];

// Example reviews array (replace with your real data source)
const reviews = [
  { userID: 'Tharushi', comment: 'Great service!', rating: 4.5 },
  { userID: 'Koshitha', comment: 'My dog loves the treats!', rating: 5 },
  { userID: 'Yasitha', comment: 'Easy to order and track.', rating: 4 },
  { userID: 'Yashodha', comment: 'Adopted my puppy here!', rating: 5 },
  { userID: 'Pabasara', comment: 'Fast delivery!', rating: 4.6 },
  { userID: 'ChatGpt', comment: 'Very helpful staff.', rating: 4.7 },
  { userID: 'Ashan', comment: 'Great experience.', rating: 4.7 },
  { userID: 'Dumidu', comment: 'Will recommend!', rating: 4.7 },
  { userID: 'Guwani', comment: 'Love the adoption process.', rating: 4.7 },
];


function Home() {
  const featuresRef = useRef(null);

  // Add missing refs and state for review slider
  const displayIndexRef = useRef(0);
  const [indexRemain, setIndexRemain] = useState(5);
  const [remain, setRemain] = useState(-1);
  const intervalRef = useRef(null);

  // Dummy pause/resume functions for slider (replace with your logic if needed)
  const pauseSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  const resumeSlide = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndexRemain((prev) => (prev % 5) + 1);
      setRemain((prev) => (prev % 5));
    }, 3000);
  };

  useEffect(() => {
    const cards = featuresRef.current.querySelectorAll('.home_feature-card');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('home_show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);
//get user id from url


  return (
    <div className="home_container">
      <Header />
    <main className='home_main'>
    
      <div className="home_hero-fade">
        {[back1png, back2png, back3png, back4png, back5png, back6png, back7png, back8png].map((img, index) => (
          <img key={index} src={img} alt={`Banner ${index}`} className="home_fade-img" />
        ))}

        <div className="home_hero-overlay">
          <h1>Welcome to The Petora</h1>
          <p>Your trusted Animal Shelter and Adoption Management System</p>
          <Link to="/home#service_cards_cont" className="home_cta-btn" >View our services🐾</Link>
        </div>
      </div>

   
      <section className="home_features" id='service_cards_cont' ref={featuresRef}>
        <div className="home_feature-card"><img src={vetpng} alt="Vet" className="home_card-icon" /><h3>Meet your pets' veterinary surgeon</h3></div>
        <div className="home_feature-card"><img src={daycarepng} alt="Daycare" className="home_card-icon" /><h3>Pets daycare</h3></div>
        <Link style={{textDecoration:'none'}} to="/grooming_services?packagesOnly=1">
          <div className="home_feature-card"><img src={groompng} alt="Groom" className="home_card-icon" /><h3>Groom your pet</h3></div>
        </Link>
        <div className="home_feature-card"><img src={trainpng} alt="Training" className="home_card-icon" /><h3>Train your pet with our professional trainers</h3></div>
        <Link style={{textDecoration:'none'}} to="/rescued_animals"><div className="home_feature-card"><img src={adoptpng} alt="Adopt" className="home_card-icon" /><h3>Adopt a lovely pet to your home</h3></div></Link>
        <Link style={{textDecoration:'none'}} to="/store"><div className="home_feature-card"><img src={storepng} alt="Store" className="home_card-icon" /><h3>Buy pet accessories, food, medicines in our store</h3></div></Link>
      </section>

    
      <section className="home_promo-section">
        <div className="home_promo-banner" onClick={() => window.location.href = "/store"}>
          <img src={promoBanner} alt="Promo" className="home_promo-img" />
        </div>

        <div className="home_promo-cards">
          <div className="home_promo-card home_cat-card" onClick={() => window.location.href = "/store"}>
            <p className="home_promo-tag">Available on store</p>
            <h3>Exclusive Sale on Cat Essentials!</h3>
            <p className="home_promo-desc">Get premium-quality cat products for your furry friend.</p>
            <button className="home_card-btn">Shop Now</button>
            <img src={catCard} alt="Cat Card" />
          </div>

          <div className="home_promo-card home_dog-card" onClick={() => window.location.href = "/store"}>
            <p className="home_promo-tag">Available on store</p>
            <h3>Exclusive Sale on Dog Essentials!</h3>
            <p className="home_promo-desc">Treat your furry friend to the best food, toys, and accessories.</p>
            <button className="home_card-btn">Shop Now</button>
            <img src={dogCard} alt="Dog Card" />
          </div>
        </div>
      </section>

      <section className="home_brand-slider">
        <h2>Shop by Brand</h2>

        <div className="home_brand-row home_left-to-right">
          {brandLogos.map((logo, i) => (
            <div key={i} className="home_brand-item" onClick={() => window.location.href = "/store"}>
              <img src={logo} alt={`Brand ${i}`} />
            </div>
          ))}
        </div>

        <div className="home_brand-row home_right-to-left">
          {brandLogos.map((logo, i) => (
            <div key={`b${i}`} className="home_brand-item" onClick={() => window.location.href = "/store"}>
              <img src={logo} alt={`Brand ${i}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="home_adoptable-pets">
        <h2>Meet Our Adorable Pets</h2>
        {/* <div className="home_pet-grid">
          <div className="home_pet-card"><img src={pet1} alt="Charlie" /><h3>Charlie</h3><p>2 years old · Friendly and playful</p></div>
          <div className="home_pet-card"><img src={pet2} alt="Luna" /><h3>Luna</h3><p>1 year old · Calm and sweet</p></div>
          <div className="home_pet-card"><img src={pet3} alt="Max" /><h3>Max</h3><p>3 months · Curious and energetic</p></div>
          <div className="home_pet-card"><img src={pet4} alt="Kane" /><h3>Kane</h3><p>3 year · lovely and kindly</p></div>
        </div> */}
        <Suggested_Animals />
      </section>
            
        <DisplayReviews/>
            
    </main>
    <Footer />
    </div>
  );
}

export default Home;
