import '../../styles/Footer.css';

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
            <li>+91 1234567890</li>
            <li>contact@hospitalcare.com"</li>
            <li>24 Green Park Road, New Delhi</li>
          </ul>
        </div>

        <div className="footer__column">
          <h4 className="footer__heading">Social</h4>
          <div className="footer__socials">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © 2026 Hospital Care. All rights reserved.
      </div>
    </footer>
  );
}
