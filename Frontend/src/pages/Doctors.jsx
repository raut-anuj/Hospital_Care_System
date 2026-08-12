import './Doctors.css';
import Footer from '../components/Footer/Footer';

const doctors = [
  { name: 'Dr. Raju', specialization: 'General Physician', experience: '12 years' },
  { name: 'Dr. Narinder', specialization: 'Orthologist', experience: '10 years' },
  { name: 'Dr. Mahit', specialization: 'Cardiologist', experience: '14 years' },
  { name: 'Dr. Bhudev', specialization: 'Pediatrician', experience: '8 years' },
];

const Doctors = () => {
  return (
    <div className="page-shell page-shell--doctors">
      <section className="page-hero page-hero--compact">
        <div className="page-hero__content">
          <p className="page-kicker">Our Doctors</p>
          <h1>Meet the specialists behind your care.</h1>
        </div>
      </section>

      <section className="doctor-grid">
        {doctors.map((doctor) => (
          <article key={doctor.name} className="doctor-card">
            <div className="doctor-avatar">{doctor.name.split(' ')[1]}</div>
            <h3>{doctor.name}</h3>
            <p className="doctor-specialization">{doctor.specialization}</p>
            <p className="doctor-experience">{doctor.experience} experience</p>
            <button type="button">Book Appointment</button>
          </article>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Doctors;
