import './About.css';
import Footer from '../components/Footer/Footer';

const About = () => {
  const highlights = [
    'Experienced healthcare professionals',
    'Easy online appointment booking',
    'Patient-first care and support',
  ];

  return (
    <div className="page-shell page-shell--about">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-kicker">About Us</p>
          <h1>Care built around your health.</h1>
          <p>
            Hospital Care brings together trusted doctors, streamlined booking,
            and compassionate support to make healthcare easier and more accessible.
          </p>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h2>Our Mission</h2>
          <p>
            We aim to provide timely care, modern healthcare access, and a smoother
            experience for every patient who walks through our doors or visits online.
          </p>
        </div>

        <div className="info-card">
          <h2>Why Patients Trust Us</h2>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
