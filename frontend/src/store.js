import './css/store.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import Header from './header';

import delivery1 from './images/store_back1.jpg';
import delivery2 from './images/store_back2.png';
import delivery3 from './images/store_back3.png';
import delivery4 from './images/store_back4.png';
import delivery5 from './images/store_back5.jpg';
import delivery6 from './images/store_back6.jpg';
import delivery7 from './images/store_back7.jpg';
import delivery8 from './images/store_back8.png';

function Store() {
  const navigate = useNavigate();

  const images = [
    delivery1, delivery2, delivery3, delivery4,
    delivery5, delivery6, delivery7, delivery8
  ];

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const intervalTime = 4000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);
    return () => resetTimeout();
  }, [index]);

  const goTo = (i) => setIndex(i);
  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  const animalCards = [
    { name: 'Dog', path: '/store/dogs', img: require('./images/store_dog1.jpeg') },
    { name: 'Cat', path: '/store/cats', img: require('./images/store_cat1.jpg') },
    { name: 'Fish', path: '/store/fish', img: require('./images/store_fish1.jpeg') },
    { name: 'Bird', path: '/store/birds', img: require('./images/store_bird1.jpeg') },
    { name: 'Rabbit', path: '/store/rabbits', img: require('./images/store_rabbit1.jpeg') },
    { name: 'Hamster', path: '/store/hamsters', img: require('./images/store_hamster1.jpeg') },
    { name: 'Guinea pig', path: '/store/guineapigs', img: require('./images/store_gunie1.jpeg') },
  ];

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
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuggestions = saleItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store_container">
      <Header />
      <main>

        {/* Banner */}

        <div className="store_banner">
          {images.map((img, i) => (
            <div
              key={i}
              className={`store_slide ${i === index ? 'store_active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}

          <div className="store_dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`store_dot ${i === index ? 'store_active' : ''}`}
                onClick={() => goTo(i)}
              ></span>
            ))}
          </div>

          <button className="store_arrow store_left" onClick={prev}>‹</button>
          <button className="store_arrow store_right" onClick={next}>›</button>
        </div>


        {/* Search + Filter Row */}

        <div className="store_searchRow">
          <div className="store_searchContainer">
            <input
              type="text"
              placeholder="Search for products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="store_searchInput"
            />
            {searchTerm && filteredSuggestions.length > 0 && (
              <ul className="store_searchDropdown">
                {filteredSuggestions.map((item, i) => (
                  <li key={i}>{item.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="store_filterContainer">
            <div className="store_sortOptions">
              <label className="sort_label">Sort By:</label>
              <select className="sort_select">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>

              <div className="view_toggle">
                <button className="view_btn active" title="Grid View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button className="view_btn" title="List View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="5" width="16" height="2" />
                    <rect x="4" y="11" width="16" height="2" />
                    <rect x="4" y="17" width="16" height="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animal Categories */}
        <div className="store_animalCategory">
          {animalCards.map((animal, i) => (
            <div
              key={i}
              className={`store_animalCard store_bg${i % 7}`}
              onClick={() => navigate(animal.path)}
            >
              <div className="store_animalImageWrapper">
                <img src={animal.img} alt={animal.name} />
              </div>
              <h4>{animal.name}</h4>
            </div>
          ))}
        </div>

        {/* Flash Sale Section */}
        <div className="store_flash_sale">
          <h2>⚡ Flash Sale</h2>
          <div className="store_category_buttons">
            {['Dogs', 'Cats', 'Fish', 'Bird', 'Rabbit'].map((cat, i) => (
              <button key={i} className={i === 0 ? 'store_active' : ''}>{cat}</button>
            ))}
          </div>

          <div className="store_product_cards">
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

          
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Store;
