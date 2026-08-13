import "../../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <h3 className="footer__title">Hospital Care</h3>
          <p className="footer__text">
            Trusted healthcare for your family and community.
          </p>
        </div>

        <div className="footer__column">
          <h4 className="footer__heading">Quick Links</h4>
          <div className="footer__links">
            <a href="/" className="footer__link">Home</a>
            <a href="/about" className="footer__link">About</a>
            <a href="/contact" className="footer__link">Contact</a>
          </div>
        </div>

        <div className="footer__column">
          <h4 className="footer__heading">Contact</h4>
          <ul className="footer__list">
            <li>
              <a href="tel:+919090090990" className="footer__link">+91 9090090990</a>
            </li>
            <li>
              <a href="mailto:abc@gmail.com" className="footer__link">abc@gmail.com</a>
            </li>
            <li>
              <span className="footer__link footer__link--static">24 Green Park Road, New Delhi</span>
            </li>
          </ul>
        </div>

        <div className="footer__column">
          <h4 className="footer__heading">Social</h4>
          <div className="footer__socials">
            <a href="#" className="footer__link" aria-label="Facebook">Facebook</a>
            <a href="#" className="footer__link" aria-label="Instagram">Instagram</a>
            <a href="#" className="footer__link" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © 2026 Hospital Care. All rights reserved.
      </div>
    </footer>
  );
}
