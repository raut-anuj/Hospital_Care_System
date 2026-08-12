import './Contact.css';
import Footer from '../components/Footer/Footer';

const Contact = () => {
  return (
    <div className="page-shell page-shell--contact">
      <section className="page-hero">
        <div className="page-hero__content">
          <p className="page-kicker">Contact</p>
          <h1>We’re here to help.</h1>
          <p>
            Reach out for appointments, support, or hospital inquiries.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-card">
          <h2>Hospital Care</h2>
          <ul>
            <li>Phone: +91 9090090990</li>
            <li>Email: abc@gmail.com</li>
            <li>Address: 24 Green Park Road, New Delhi</li>
          </ul>
        </div>

        <form className="contact-form">
          <label>
            Full Name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" placeholder="abc@gmail.com" />
          </label>
          <label>
            Message
            <textarea rows="5" placeholder="Write your message here" />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
