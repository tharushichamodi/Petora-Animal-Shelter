import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './css/review_display.css'

import  hamsterImg from './images/hamster2.png'
function DisplayReviews(){
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3001/review/api/reviews')
            .then((response) => {
                setReviews(response.data);  
            })
            .catch((error) => {
                console.error('Error fetching reviews:', error);
            });
    }, []);
    

    const intervalRef = useRef(null);

    // For controlling the sliding animation
    const [remain, setRemain] = useState(-1);
        const iRef = useRef(0);
        const jRef = useRef(0);
        const displayIndexRef = useRef(0);
        const [indexRemain,setIndexRemain] = useState(5);
    
        
    const pauseSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const resumeSlide = () => {
        
        if (intervalRef.current) return;
            intervalRef.current = setInterval(() => {
            setIndexRemain((jRef.current % 5) + 1);
            setRemain(jRef.current % 5);
            jRef.current++;

        }, 3000);
    };

        
        

    useEffect(() => {
        resumeSlide();
        return () => pauseSlide();
    }, []);
    return(
        <div className='display_review_cont'>
            <div className="slider_cont"
                onMouseEnter={pauseSlide} 
                onMouseLeave={resumeSlide}
                    
                    >
                    {console.log(" ")}
                    {[0, 1, 2, 3, 4].map((id) => {
                        // const reviewIndex = ((remain + id) + reviews.length) % reviews.length;

                        // conditionally assign transform style
                        const slideTransform =
                        remain >= id
                            ? `translateX(${250+(1200 - (remain * 300))}px)`
                            : `translateX(-${-250+((remain + 1) * 300)}px)`;

                        const ctrlZindex =
                        (indexRemain - 1) === id
                        ? `${id- 100}`
                        : `${id}`;

                        console.log('index' +  displayIndexRef.current + ' / id' + id + ' /R' + indexRemain );

                        let reviewIndex = displayIndexRef.current % reviews.length;
                        
                        if (reviews.length === 0) {
                            return null; // If no reviews, skip rendering
                        }
                        let currentReview = reviews[reviewIndex];
                        console.log('/RID' + currentReview.reviewID );

                        if(currentReview.rating <= 3 || currentReview.comment === null || currentReview.comment === undefined){
                            displayIndexRef.current++;
                            reviewIndex = displayIndexRef.current % reviews.length;
                            currentReview = reviews[reviewIndex];
                        }

                            if(indexRemain === id){
                                displayIndexRef.current = displayIndexRef.current - 4;
                            }
                            
                            else{
                                displayIndexRef.current++;
                            }
                            
                        return (
                            
                        <div

                            key={id}
                            className="slider"
                            id={id}
                            style={{
                            zIndex:ctrlZindex,
                            transform: slideTransform,
                            
                            transition: "transform 0.4s ease-in-out",
                            

                            }}
                        >
                            
                                <img src={hamsterImg} alt="User" className="review_profile" />
                                <h4 className="review_name">{currentReview.userID},{id}</h4>
                                <p className="review_text">"{currentReview.comment}"</p>
                                <div className="review_footer">
                                    <span className="review_rating_value">{currentReview.rating}/5</span>
                                    <div className="review_stars">
                                        {Array.from({ length: 5 }, (_, i) => {
                                        const full = i + 1 <= Math.floor(currentReview.rating);
                                        const half = i + 0.5 === currentReview.rating;
                                        return (
                                            <span key={i} className={`star ${full ? 'full' : half ? 'half' : ''}`}>★</span>
                                            );
                                        })}
                                    </div>
                                </div>
                        </div>
                        
                        );
                    })}
            </div>
        </div>
            
    );
};

export default DisplayReviews;