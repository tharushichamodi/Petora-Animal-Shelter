// RatingSystem.js
import React, { useState } from 'react';
import './css/submit_review.css'; // Make sure to create this CSS file
import Axios from 'axios';

const RatingSystem = () => {

  //connect to the backend

  
  const [rating, setRating] = useState(0); // State to store the selected rating (0 to 5)
  const [hoverRating, setHoverRating] = useState(0); // State for hover effect
  const [reviewText, setReviewText] = useState('');

  
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    
  };
  
  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0); // Reset hover when mouse leaves the stars container
  };

  const handleReviewText = (event) => {
    setReviewText(event.target.value);
  };
  

  const handleSubmit = () => {
    if (rating > 0) {
      console.log(rating);
      const payload = {
        rating: rating,
        comment: reviewText,
      };
      Axios.post('http://localhost:3001/review/api/reviews', payload)
        .then((response) => {
          // Handle the response from the backend
           // See what the backend sent back
          alert(`You rated the app: ${rating} stars!`);
        })
        .catch((error) => {
      console.error('Error fetching data:', error);
    });
    } else {
      alert('Please select a star rating before submitting.');
    }
  };

  const handleNoThanks = () => {
    alert('No Thanks clicked!');
    // Handle dismissal of the rating prompt
  };

  return (
    <div className="rating_page_container"> {/* Container for the whole page background */}
      <div className="rating_card">
        

        <h3 className="rating_question">How Would You Rate Our Service?</h3>

        <div className="stars_container" onMouseLeave={handleStarLeave}>
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
            >
              &#9733; {/* Unicode star character */}
            </span>
          ))}
        </div>
        <textarea className="review_textarea" placeholder="Write your review here..." value={reviewText} onChange={handleReviewText}></textarea>
        <button className="submit_button" onClick={handleSubmit}>Submit</button>
        <button className="no_thanks_button" onClick={handleNoThanks}>No, Thanks!</button>
      </div>

      {/* Optional: Wavy background elements */}
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
    </div>
  );
};

export default RatingSystem;