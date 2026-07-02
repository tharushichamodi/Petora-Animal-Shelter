import React, { useState } from 'react';
import './css/FAQ.css';

function FAQpage() {
  const [activeTab, setActiveTab] = useState('adoption');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = {
    adoption: [
      {
        question: 'How do I adopt a pet?',
        answer: 'Browse available pets and fill out an adoption form. We’ll contact you shortly after.'
      },
      {
        question: 'Do I need a home visit?',
        answer: 'Yes, we do a quick home check to ensure the pet’s safety and well-being.'
      }
    ],
    shelter: [
      {
        question: 'Can I volunteer at the shelter?',
        answer: 'Absolutely! Fill out the volunteer form and we’ll get in touch.'
      },
      {
        question: 'What are your visiting hours?',
        answer: 'We’re open from 9AM to 5PM, Tuesday to Sunday.'
      }
    ]
  };

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="faqpage_container">
      <div className="faqpage_hero">
        <h1>Here to help</h1>
        <p>Pet Paradise - Frequently Asked Questions</p>
      </div>

      <div className="faqpage_section">
        <h2>Frequently <span>asked questions</span></h2>

        <div className="faqpage_tabs">
          <button
            className={activeTab === 'adoption' ? 'active' : ''}
            onClick={() => {
              setActiveTab('adoption');
              setOpenIndex(null);
            }}
          >
            Pet Adoption FAQ
          </button>
          <button
            className={activeTab === 'shelter' ? 'active' : ''}
            onClick={() => {
              setActiveTab('shelter');
              setOpenIndex(null);
            }}
          >
            Animal Shelter FAQ
          </button>
        </div>

        <div className="faqpage_accordion">
          {faqs[activeTab].map((faq, index) => (
            <div key={index} className="faqpage_item">
              <div
                className="faqpage_question"
                onClick={() => handleToggle(index)}
              >
                {faq.question}
                <span>{openIndex === index ? '-' : '+'}</span>
              </div>
              {openIndex === index && (
                <div className="faqpage_answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQpage;
