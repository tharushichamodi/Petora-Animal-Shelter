// PaymentPortal.js
import React, { useState } from 'react';

import './css/payment_portal.css'; // Import the CSS file

import visaLogo from './images/visacard.png';
import masterLogo from './images/mastercard.png';
import browserIcon from './images/browsertab_icon.png'
import productImageSample from './images/sample_product_image1.webp'
import logImg from './images/logo.png'; 
import cartImg from './images/cartImg.png';
function PaymentPortal() {

  const itemName = "Vetzyme B Plus E";
  const model = "Vetzyme B Plus E 100 Tablets"; // Example model
  const itemPrice = 1000.00; // Example price 
  const shippingStatus = "Free Shipping"; // Example shipping status

  const [selectedPayment, setSelectedPayment] = useState('koko'); // CHANGED

  const handlePaymentChange = (method) => { // CHANGED
  setSelectedPayment(method);
  };
  return (
    <div className='payment_portal_container'>
      <header className='payment_header'>
        <div className='header_content'>
          <div className='logo_cont'><img src={logImg} alt="Logo" className='logo' /></div>
          <div className='cart_cont'><img src={cartImg} alt="Cart" className='cart' /></div>
        </div>
      </header>
      <main>
      <div className="payment_container"> 
        <div className="payment_left">
          <div className="checkout_form_container">
            <h2>Contact</h2>
            <input type="email" placeholder="Email" />
            
            <h2>Delivery</h2>

            <select>
              <option>Sri Lanka</option>
            </select>

            <div className="name_row">
              <input type="text" placeholder="First name (optional)" />
              <input type="text" placeholder="Last name" />
            </div>

            <input type="text" placeholder="Address" />
            <input type="text" placeholder="Apartment, suite, etc. (optional)" />

            <div className="city_row">
              <input type="text" placeholder="City" />
              <input type="text" placeholder="Postal code (optional)" />
            </div>

            <input type="text" placeholder="Phone" />
            <div className="checkbox_row">
              <input type="checkbox" id="save" />
              <label htmlFor="save">Save this information for next time</label>
            </div>

            <h3>Shipping method</h3>
            <div className="shipping_error_box">
              <strong><span className='info-icon' style={{border: '1px solid #ff0000ff', color: '#ff0505ff', marginRight: '10px'}}>!</span>Shipping not available</strong>
              <p>
                Your order cannot be shipped to the selected address. Review your address to ensure it's correct and try again, or select a different address.
              </p>
            </div>
          </div>
          <h2 >Payment</h2>
          <p style={{fontSize:'16px'}} >All transactions are secure and encrypted.</p>

          <div className="payment_methods" >

            {/* Koko */}
            <div className="payment_option" style={{ borderRadius: '5px 5px 0px 0px' }}>
              <div className={`payment_option_visible ${selectedPayment === 'koko' ? 'selected' : ''}`} style={{ borderRadius: '5px 5px 0px 0px' }} onClick={() => handlePaymentChange('koko')}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input id="koko" type="radio" name="payment" checked={selectedPayment === 'koko'}  />
                  <strong style={{ float: 'left', width: '100%' }}>Koko: Buy Now Pay Later</strong>
                </div>
                <div className="card_icons_cont">
                  <div className="card_icons"><img src={masterLogo} alt="master" width="50" /></div>
                  <div className="card_icons"><img src={visaLogo} alt="visa" width="50" /></div>
                </div>
              </div>

              <hr className='payment_option_deivder' />

              <div className={`dropdown_cont ${selectedPayment === 'koko' ? 'open' : ''}`} id='dropdown_cont_koko'>
                <div className="browserIcon"><img src={browserIcon} alt="browser" width="100" /></div>
                <p style={{ fontSize: '80%', width: '80%', textAlign: 'center' }}>
                  After clicking “Pay now”, you will be redirected to Koko to complete your purchase securely.
                </p>
              </div>
            </div>

            {/* Mintpay */}
            <div className="payment_option">
              <div className={`payment_option_visible ${selectedPayment === 'mint' ? 'selected' : ''}`} onClick={() => handlePaymentChange('mint')}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input type="radio" name="payment" checked={selectedPayment === 'mint'}  />
                  <strong>Mintpay | Shop now. Pay later.</strong>
                </div>
                <div className="card_icons_cont">
                  <div className="card_icons"><img src={masterLogo} alt="master" /></div>
                  <div className="card_icons"><img src={visaLogo} alt="visa" /></div>
                </div>
              </div>

              <hr className='payment_option_deivder' />

              <div className={`dropdown_cont ${selectedPayment === 'mint' ? 'open' : ''}`} id='dropdown_cont_mintpay'>
                <div className="browserIcon"><img src={browserIcon} alt="browser" width="100" /></div>
                <p style={{ fontSize: '80%', width: '80%', textAlign: 'center' }}>
                  After clicking “Pay now”, You will be redirected to Mintpay to complete your payment securely.
                </p>
              </div>
            </div>

            {/* PayHere */}
            <div className="payment_option">
              <div className={`payment_option_visible ${selectedPayment === 'payhere' ? 'selected' : ''}`} onClick={() => handlePaymentChange('payhere')}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input type="radio" name="payment" checked={selectedPayment === 'payhere'}  />
                  <strong>Bank Card / Bank Account - PayHere</strong>
                </div>
                <div className="card_icons_cont">
                  <div className="card_icons"><img src={masterLogo} alt="master" /></div>
                  <div className="card_icons"><img src={visaLogo} alt="visa" /></div>
                </div>
              </div>

              <hr className='payment_option_deivder' />

              <div className={`dropdown_cont ${selectedPayment === 'payhere' ? 'open' : ''}`} id='dropdown_cont_Payhere'>
                <div className="browserIcon"><img src={browserIcon} alt="browser" width="100" /></div>
                <p style={{ fontSize: '80%', width: '80%', textAlign: 'center' }}>
                  After clicking “Pay now”, Secure transaction using PayHere gateway. Supports all major bank cards.
                </p>
              </div>
            </div>

            {/* COD */}
            <div className="payment_option" style={{ borderRadius: '0px 0px 5px 5px' }}>
              <div className={`payment_option_visible COD ${selectedPayment === 'COD' ? 'selected' : ''}`}  onClick={() => handlePaymentChange('COD')}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input type="radio" name="payment" checked={selectedPayment === 'COD'}  />
                  <strong>Cash on Delivery (COD)</strong>
                </div>
                <div className="card_icons_cont">
                  {/* Empty container for consistency */}
                </div>
              </div>

              <hr className='payment_option_deivder' />

              <div className={`dropdown_cont ${selectedPayment === 'COD' ? 'open' : ''}`} id='dropdown_cont_COD'>
                <div className="browserIcon"><img src={browserIcon} alt="browser" width="100" /></div>
                <p style={{ fontSize: '80%', width: '80%', textAlign: 'center' }}>
                  Pay in cash when your order is delivered to your doorstep.
                </p>
              </div>
            </div>

          </div>


          <button className="pay_now_btn">Pay now</button>

          <div className="policies">
            <a href="#">Refund policy</a>
            <a href="#">Shipping policy</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
            <a href="#">Contact information</a>
          </div>
        </div>
        <div className='payment_right'>
          <div className="product-row">
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <div className="product-image-wrapper">
                {/* Replace with your actual image */}
                <img src={productImageSample} alt="Vetzyme B Plus E" className="product-image" />
                <span className="item-count">1</span>
              </div>
              <div className="product-details">
                <p className="product-name">{itemName}</p>
                <p className="product-description">{model}</p>
              </div>
            </div>
            
            <div className="product-price">Rs {itemPrice.toFixed(2)}</div>
          </div>

          <hr className="divider" /> {/* Visual separator */}

          {/* Subtotal Row */}
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-value">Rs {itemPrice.toFixed(2)}</span>
          </div>

          {/* Shipping Row */}
          <div className="summary-row">
            <span className="summary-label">
              Shipping <a href="#" className="info-icon">?</a>
            </span>
            <span className="summary-value shipping-status">{shippingStatus}</span>
          </div>

          {/* Total Row */}
          <div className="total-row">
            <span className="total-label">Total</span>
            <span className="total-value"><span style={{ fontSize: '14px', fontWeight:'500', color:'gray'}}>LKR</span> Rs {itemPrice.toFixed(2)}</span>
          </div>
        </div>
          
      </div>
    </main>
    </div>
    
  );
}

export default PaymentPortal;

function paymentOption(){

}