// Cart.js
import React, { useState, useEffect } from 'react';
import './css/cart.css';

// Import all product images
import productImg1 from './images/sample_product_image1.webp';
import productImg2 from './images/sample_product_image2.webp';
import productImg3 from './images/sample_product_image3.webp';
import productImg4 from './images/sample_product_image4.webp'; 
import productImg5 from './images/sample_product_image5.webp'; 
import productImg6 from './images/sample_product_image6.webp'; 
import lockIcon from './images/lock_icon.png'; // Import the lock icon

const Cart = () => {
  // Initial static cart items with an added 'id' for better key management and 'quantity' state
  const [cartItems, setCartItems] = useState([
    {
      id: 1, // Added unique ID
      imageUrl: productImg1,
      imageAlt: 'Vetzyme B Plus E',
      badgeText: '5% Cashback',
      title: 'Vetzyme B Plus E',
      subtitle: 'Vetzyme & 100 Tablets',
      initialPrice: 2867.0,
      quantity: 1, // Initial quantity
    },
    {
      id: 2,
      imageUrl: productImg2,
      imageAlt: 'PetCal Calcium Syrup',
      badgeText: 'New Arrival',
      title: 'PetCal Calcium Syrup',
      subtitle: 'For Strong Bones & Teeth (200ml)',
      initialPrice: 1550.0,
      quantity: 1,
    },
    {
      id: 3,
      imageUrl: productImg3,
      imageAlt: 'Premium Adult Dog Food',
      badgeText: 'Best Seller',
      title: 'Premium Adult Dog Food - Salmon',
      subtitle: 'High Protein, Grain-Free (2kg)',
      initialPrice: 5499.0,
      quantity: 1,
    },
    {
      id: 4,
      imageUrl: productImg4,
      imageAlt: 'EverFresh Clumping Cat Litter',
      badgeText: 'Eco-Friendly',
      title: 'EverFresh Clumping Cat Litter',
      subtitle: 'Odor Control, Low Dust (5kg)',
      initialPrice: 1200.0,
      quantity: 1,
    },
    {
      id: 5,
      imageUrl: productImg5,
      imageAlt: 'EverFresh Clumping Cat Litter',
      badgeText: 'Eco-Friendly',
      title: 'EverFresh Clumping Cat Litter',
      subtitle: 'Odor Control, Low Dust (5kg)',
      initialPrice: 1200.0,
      quantity: 1,
    },
    {
      id: 6,
      imageUrl: productImg6,
      imageAlt: 'Durable Rope Tug Toy',
      badgeText: 'Limited Stock',
      title: 'Durable Rope Tug Toy',
      subtitle: 'Interactive Play for Dogs',
      initialPrice: 450.0,
      quantity: 1,
    },
  ]);

  // Helper function to format price
  const formatPrice = (price) =>
    `Rs ${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Handler for changing quantity via input field
  const handleQuantityChange = (id, event) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1; // Ensure quantity is at least 1
    }
    updateItemQuantity(id, value);
  };

  // Handler for incrementing quantity
  const handleIncrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handler for decrementing quantity
  const handleDecrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  // Helper function to update quantity (used by input change)
  const updateItemQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handler for removing an item from the cart
  const handleRemoveItem = (id, title) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    alert(`Removed: ${title}`);
  };
  const [orderNote, setOrderNote] = useState(''); // State for the order note textarea
  const subtotal = cartItems.reduce(
  (sum, item) => sum + item.initialPrice * item.quantity,
  0
);
const handleCheckout = () => {
  alert(`Proceeding to checkout!\nSubtotal: ${formatPrice(subtotal)} LKR\nOrder Note: ${orderNote}`);
  
};
  return (
    <div className="cart_container">
      <main className="cart_main">
        <div className='main_content'>
          <div className='cart_items_cont'>
        {cartItems.map((item) => (
          <div className="product_item_container" key={item.id}>
            <div className="product_image_section">
              <img src={item.imageUrl} alt={item.imageAlt} className="product_image" />
              {item.badgeText && <span className="product_badge">{item.badgeText}</span>}
            </div>
            <div className="product_details_section">
              <h3 className="product_title">{item.title}</h3>
              <p className="product_subtitle">{item.subtitle}</p>
              <p className="product_price_single">{formatPrice(item.initialPrice)}</p>
            </div>
            <div className="product_quantity_section">
              <div className="quantity_control">
                <button
                  className="quantity_button decrement_button"
                  onClick={() => handleDecrement(item.id)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity_input"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.id, e)}
                />
                <button
                  className="quantity_button increment_button"
                  onClick={() => handleIncrement(item.id)}
                >
                  +
                </button>
              </div>
              <button
                className="remove_button"
                onClick={() => handleRemoveItem(item.id, item.title)}
              >
                Remove
              </button>
            </div>
            <div className="product_total_price_section">
              <p className="product_total_price">
                {formatPrice(item.initialPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        {cartItems.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px' }}>Your cart is empty.</p>
        )}
        </div>
        <div className='total_cont'>
          <div className="cart_summary_section">
            <div className="subtotal_line">
              <span className="subtotal_label">Subtotal</span>
              <span className="subtotal_amount">{formatPrice(subtotal)} LKR</span>
            </div>
            <p className="shipping_info">
              Taxes and <a href="#" className="shipping_link" style={{color:'black', textDecoration: 'underline'}}>shipping</a> calculated at checkout
            </p>

            <div className="order_note_section">
              <label htmlFor="order-note" className="order_note_label">Add a note to your order</label>
              <textarea
                id="order-note"
                className="order_note_textarea"
                placeholder="Order note"
                value={orderNote} // Make sure 'orderNote' state is defined (e.g., const [orderNote, setOrderNote] = useState('');)
                onChange={(e) => setOrderNote(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <button className="checkout_button" onClick={handleCheckout}> {/* Make sure 'handleCheckout' function is defined */}
              <img src={lockIcon} alt="Lock Icon" className="lock_icon" />
              Check out
            </button>
          </div> 
        </div>
        </div>
        
      </main>
    </div>
  );
};

export default Cart;