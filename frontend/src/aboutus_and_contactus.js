import './css/aboutus_and_contactus.css';
import aboutus from './images/aboutus_and_contactus.png';
import Header from './header.js'

// Import your local circular social icons
import facebookIcon from './images/facebook-icon.png';
import instagramIcon from './images/instagram-icon.png';
import tiktokIcon from './images/tiktok-icon.png';

import img1 from './images/image1.jpg';
import img2 from './images/image2.png';
import img3 from './images/image3.jpg';
import img4 from './images/image4.jpg';


function AboutusAndContactUs() {
    return (
        <div className="aboutus_and_contactus_container">
            <Header/>
        <main>
            <section className="aboutUs-section" style={{ backgroundImage: `url(${aboutus})` }}>
                <div className="aboutus_overlay"></div>
                <div className="aboutus-content">
                    <h1>WHO WE ARE</h1>
                    <p>To keep your beloved pets healthy and happy, we provide daycare, grooming, adoption, </p>
                    <p>training, and veterinary services at our Petora store.</p>
                    <p>We are dedicated to giving pets loving care, supporting them in finding homes,</p>
                    <p>and being there for you at every stage of your pet care journey.</p>
                </div>
            </section>

            <section className="mission">
                <div className="mission-image">
                    {/* You can add an image here if needed */}
                </div>

                <div className="about-cards">
                    <div className="about-card">
                        <h3>Mission</h3>
                        <p>Providing the best care and services for animals with a focus on health and happiness.</p>
                        <img className='img_mission' src={img1}></img>
                    </div>
                    <div className="about-card">
                        <h3>Passion</h3>
                        <p>Offering high-quality grooming, daycare, and veterinary services with love and care.</p>
                        <img className='img_passion' src={img2}></img>
                    </div>
                    <div className="about-card">
                        <h3>Values</h3>
                        <p>Commitment to transparency, compassion, and exceptional customer service for pet owners.</p>
                        <img className='img_values'src={img3}></img>
                    </div>
                </div>
            </section>

              {/* ⭐ Follow Us Section */}
              <section className="follow-us-section">
                <h1>FOLLOW Us</h1>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer">
                        <img src={facebookIcon} alt="Facebook" className="social-icon-img" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">
                        <img src={instagramIcon} alt="Instagram" className="social-icon-img" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                        <img src={tiktokIcon} alt="TikTok" className="social-icon-img" />
                    </a>
                </div>
            </section>

            <div className="grid_container">
                <div className='col c1'><img src={img1} alt="Grid 1" className="grid_object o1" /></div>
                <div className='col c2'>
                    <div className='img_cont'><img src={img2} alt="Grid 2" className="grid_object o2" /></div>
                </div>
                <div className='col c3'>
                    <div className='img_cont'><img src={img3} alt="Grid 3" className="grid_object o3" /></div>
                    <div className='img_cont'><img src={img4} alt="Grid 4" className="grid_object o4" /></div>
                </div>
            </div>

            <section className="contact-section">
                <h1>Contact Us</h1>
                <form className="contact-form">
                    <div className="input-row">
                        <input type="text" placeholder="Name" className="contact-input" />
                        <input type="email" placeholder="Email" className="contact-input" />
                    </div>
                    <textarea placeholder="Message" className="contact-textarea"></textarea>
                    <button type="submit" className="contact-button">Send message</button>
                </form>
            </section>
        </main>
        </div>
    );
}

export default AboutusAndContactUs;

