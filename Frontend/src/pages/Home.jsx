import React from 'react';
import Button from '../components/Button';
import Footer from '../components/Footer/Footer';
import HealthCareFeature from './HealthCare Feature/HealthCare Feature.jsx';
import "../styles/Home.css";

const Home = () => {
  const doctors = [
   { name: "Dr. Raju", specialization: "Physician" },
   { name: "Dr. Narinder", specialization: "Orthologist" },
   { name: "Dr. Mahit", specialization: "Cardiologist" },
   { name: "Dr. Bhudev", specialization: "Pediatrician" },
   { name: "Dr. Shant", specialization: "General Physician" },
   { name: "Dr. Khushboo", specialization: "Cardiologist" },
  ];

  return (
   <div className="home-page">
     <div className="home-hero">
       <h1 className="home-title">
         Your Health,<br />
         <span className="home-highlight">Our Priority</span>
       </h1>

       <p className="home-subtitle">
         Simplify your healthcare journey with expert doctors, easy scheduling,
         and secured appointments.
       </p>

       <div className="home-actions">

        {/* Sign Up Button */}

         <Button
           bgColor="button--bg-black"
           textColor="button--text-blue"
           className="home-action home-action--primary"
           onClick={() => window.open('/signup', '_self')}
         >
           Sign Up
         </Button>

      {/* Login Button */}

         <Button
           bgColor="button--bg-white"
           textColor="button--text-blue"
           className="home-action home-action--secondary"
           onClick={() => window.open('/login', '_self')}
         >
           Login
         </Button>
       </div>

     </div>

     <HealthCareFeature />

     <p className="home-doctors-heading">Meet Our Doctors</p>

     <div className="home-doctors-wrap">
       <div className="home-doctors-grid">
         {doctors.map((doc, i) => (
           <div key={i} className="home-doctor-card">
             <h3 className="home-doctor-name">{doc.name}</h3>
             <p className="home-doctor-specialization">Specialization: {doc.specialization}</p>
             <button className="home-doctor-button">Book Appointment</button>
           </div>
         ))}
       </div>
     </div>

     <div className="home-testimonials">
       <h2 className="home-testimonials__title">What Our Patients Say</h2>

      {/* 5 Start rating */}
       <div className="home-testimonials__grid">
         <div className="home-testimonial-card">

           <div className="home-stars">{[...Array(5)].map((_, i) => (
             <svg key={i} className="home-star" viewBox="0 0 24 24">
               <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
             </svg>
           ))}
           </div>
           
           <p className="home-testimonial-text">"The platform made booking my specialist appointment so easy and convenient!"</p>
           <p className="home-testimonial-author">- Esha Sharma</p>
         </div>

         <div className="home-testimonial-card">
           <div className="home-stars">{[...Array(5)].map((_, i) => (
             <svg key={i} className="home-star" viewBox="0 0 24 24">
               <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
             </svg>
           ))}</div>
           <p className="home-testimonial-text">"Professional service and quick response times. Highly recommend!"</p>
           <p className="home-testimonial-author">- Riya Garg</p>
         </div>

         <div className="home-testimonial-card">
           <div className="home-stars">{[...Array(5)].map((_, i) => (
             <svg key={i} className="home-star" viewBox="0 0 24 24">
               <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
             </svg>
           ))}</div>
           <p className="home-testimonial-text">"Great user interface and wonderful selection of doctors."</p>
           <p className="home-testimonial-author">- Shivam Verma</p>
         </div>
       </div>
     </div>

     <Footer />
   </div>
  );
};

export default Home;