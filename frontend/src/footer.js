import React, { useEffect, useRef, useState } from 'react';

import './css/footer.css';

import logopng from './images/logo.png';

function Footer(){
    return(
        <div className='bottom'>
            <div className='common_bottom'>
                        <section className="features_section"> {/* ✅ CHANGED */}
                            <div className="feature_item"> {/* ✅ CHANGED */}
                                <div className="feature_icon">🎧</div>
                                <h3>Friendly Pet Support</h3>
                                <p>We’re here to help with all your pet needs <strong>075 622 9799</strong>.</p>
                            </div>

                            <div className="feature_item">
                                <div className="feature_icon">📦</div>
                                <h3>Fast & Free Delivery</h3>
                                <p>Enjoy <strong>free shipping</strong> on orders over <strong>Rs. 10,000</strong> across Sri Lanka.</p>
                            </div>

                            <div className="feature_item">
                                <div className="feature_icon">👥</div>
                                <h3>Refer a Friend</h3>
                                <p>Invite your fellow pet lovers and get <strong>15% off</strong> your next order!</p>
                            </div>

                            <div className="feature_item">
                                <div className="feature_icon">🛡️</div>
                                <h3>Secure Payments</h3>
                                <p>Your payment information is processed safely with trusted, secure methods.</p>
                            </div>
                        </section>
                    </div>
        <footer className='home_footer'>
                <div className='footer_container'>
                    <div className="footer_top">
                        {/* Left - Logo and Description */}
                        <div className="footer_section logo_section">
                        <img className="logoImg" src={logopng} alt="Petora Logo" />
                        <p>
                            At Petora, we go beyond pet care — we create smarter, safer, and more loving experiences for your pets. From adoption and grooming to real-time health tracking, smart training, and doorstep delivery, Petora connects every paw-step with care, technology, and trust.
                        </p>
                        <div className="social_icons">
                            <a href="#"><i className="fab fa-facebook-f" /></a>
                            <a href="#"><i className="fab fa-instagram" /></a>
                            <a href="#"><i className="fab fa-tiktok" /></a>
                        </div>
                        </div>
                        <div class="vertical_hr">
                            
                        </div>
                        {/* Middle - Navigation */}
                        <div className="footer_section nav_section">
                        <h3>Main Navigation</h3>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Shop All</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                            <li><a href="/faq">FAQ</a></li>
                        </ul>
                        </div>

                        {/* Right - Categories */}
                        <div className="footer_section category_section">
                        <h3>Category</h3>
                        <ul>
                            <li><a href="#">Cats</a></li>
                            <li><a href="#">Dogs</a></li>
                            <li><a href="#">Rabbits</a></li>
                            <li><a href="#">Birds</a></li>
                            <li><a href="#">Fish</a></li>
                            <li><a href="#">Hamster</a></li>
                        </ul>
                        </div>
                        <div className="footer_section services_section">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#">Adoption</a></li>
                            <li><a href="#">Health Care</a></li>
                            <li><a href="#">Day Care</a></li>
                            <li><a href="#">Grooming</a></li>
                            <li><a href="#">Training</a></li>
                        </ul>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="footer_bottom">
                        <div className="info">                            
                            <p><i className="fas fa-phone" /> +94 770 723 434</p>                            
                            <p><i className="fas fa-envelope" />  thushantharathnayake@gmail.com</p>  
                            <p><i className="fas fa-clock" /> 9am - 8pm | Opens Everyday</p>                            
                            <a href='#'  onClick={(e) => { 
                                                            e.preventDefault(); // prevent normal navigation
                                                            window.open('https://maps.app.goo.gl/B6mYBJ9YbJMfvrgG7', '_blank');
                                                            }} >
                            <i className="fas fa-location-arrow" /> 277/3F Godagama Rd, 10150</a> 
                            
                        </div>
                    </div>

                    <div className="footer_legal">
                        <p>© 2025 Pet Paradise. <a href="#">All rights reserved</a></p>
                        <ul>
                        <li><a href="#">Privacy policy</a></li>
                        <li><a href="#">Refund policy</a></li>
                        <li><a href="#">Shipping policy</a></li>
                        <li><a href="#">Terms of service</a></li>
                        <li><a href="#">Contact information</a></li>
                        </ul>
                    </div>
                </div>    
                                        
            </footer>
        </div>
        
    );
};

export default Footer;
