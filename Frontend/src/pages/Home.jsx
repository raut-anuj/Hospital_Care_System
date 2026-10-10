import { Button, Card } from "../components/index.js"
import React from 'react'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="h-125 md:text-left text-center bg-blue-300 py-20 px-8 p-6">

        <h1 className="text-white text-7xl font-bold px-3">
          Your Health,<br />
          <span className="text-red-700">Our Priority</span>
        </h1>

        <p className="font-bold text-2xl mt-4 px-5">
          Simplify your healthcare journey with expert doctors, easy scheduling,
          and secured appointments.
        </p>

        <div className="mt-6 space-x-4 px-4">
         <Button
          bgColor="bg-black"
          textColor="text-blue-700"
          className="
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
          onClick={() => window.open('/signup', '_self')}
        >
          Sign In
        </Button>

        <Button
          bgColor="bg-white"
          textColor="text-blue-600"
          className="
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
          onClick={() => window.open('/login', '_self')}
        >
          Login
        </Button>
        </div>
        
      </div>

      {/* Why Choose Us */}
      <div className="text-4xl text-center font-bold text-slate-700 py-10 tracking-wide">
        Why Choose Us?
      </div>

      {/* Cards */}
      <div className="w-full flex flex-wrap justify-center gap-8 mx-auto py-10">
  {[
    {
      title: "Easy Scheduling",
      desc: "Book appointments with just a few clicks, 24/7 at your convenience.",
      img: "https://cdn-icons-png.flaticon.com/128/15440/15440333.png",
    },
    {
      title: "Instant Confirmation",
      desc: "Receive immediate confirmation and reminders for your appointments.",
      img: "https://cdn-icons-png.flaticon.com/128/5290/5290076.png",
    },
    {
      title: "Top Specialists",
      desc: "Access a wide network of qualified healthcare professionals.",
      img: "https://cdn-icons-png.flaticon.com/128/11278/11278170.png",
    },
    {
      title: "Secure & Private",
      desc: "Your health information is protected with top-tier security.",
      img: "https://cdn-icons-png.flaticon.com/128/10394/10394686.png",
    },
  ].map((card, i) => (
    <div
      key={i}
      className="w-64 flex flex-col items-center text-center 
                 bg-white rounded-xl shadow-md p-6 
                 hover:shadow-xl hover:-translate-y-1 
                 transition-all duration-300"
    >
      <img src={card.img} alt={card.title} className="w-20 h-20 mb-3" />
      <p className="text-black font-semibold text-lg mb-2">{card.title}</p>
      <p className="text-gray-600 text-sm">{card.desc}</p>
    </div>
  ))}
      </div>

      {/* Meet our doctor */}
      <p className="text-gray-700 font-bold p-3 text-center
      mb-6.5 text-4xl tracking-wide" 
      >Meet Our Doctors</p>

    <div className="max-w-7xl mx-auto px-6 lg:px-8">
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
    
    {[
      { name: "Dr. Raju", speciality: "Physician" },
      { name: "Dr. Narinder", speciality: "Orthologist" },
      { name: "Dr. Mahit", speciality: "Cardiologist" },
      { name: "Dr. Bhudev", speciality: "Pediatrician" },
      { name: "Dr. Shant", speciality: "General Physician" },
      { name: "Dr. Khushboo", speciality: "Cardiologist" },
    ].map((doc, i) => (
      
      <div
        key={i}
        className="bg-white shadow-lg rounded-xl p-2 text-center hover:shadow-xl transition max-w-2xl"
      >
        <h3 className="text-xl font-bold text-red-500 capitalize">
          {doc.name}
        </h3>

        <p className="mt-2 text-gray-600 capitalize">
          Speciality: {doc.speciality}
        </p>

        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold">
          Book Appointment
        </button>
      </div>

    ))}

  </div>

    </div>
  
      <div className="bg-blue-100">

        <h2 className="p-5 text-4xl font-bold text-center text-gray-800 mb-12">
        What Our Patients Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow mb-1">
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
              </svg>
            ))}
          </div>

          <p className="italic text-gray-600 mb-4">
            "The platform made booking my specialist appointment so easy and convenient!"
          </p>

          <p className="font-semibold text-blue-700">
            - Esha Sharma
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow mb-1">
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
              </svg>
            ))}
          </div>

          <p className="italic text-gray-600 mb-4">
            "Professional service and quick response times. Highly recommend!"
          </p>

          <p className="font-semibold text-blue-700">
            - Riya Garg
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow mb-1">
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
              </svg>
            ))}
          </div>

          <p className="italic text-gray-600 mb-4">
            "Great user interface and wonderful selection of doctors."
          </p>

          <p className="font-semibold text-blue-700">
            - Shivam Verma
          </p>
        </div>
      </div>

      </div>
     
   </div>
  );
}

export default Home