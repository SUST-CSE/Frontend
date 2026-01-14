import "./Footer.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import { faHeart, faEnvelope, faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col about">
          <h4>About</h4>
          <p>
            Committed to the pursuit of knowledge and the empowerment of
            individuals, our institution stands as a beacon of learning and
            inspiration. Join us to discover, create, and grow.
          </p>
          <div className="socials">
            <a aria-label="facebook" href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a aria-label="twitter" href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a aria-label="instagram" href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a aria-label="linkedin" href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </div>

        <div className="footer-col links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/course">Courses</a></li>
            <li><a href="/faculty">Faculty</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Contact</h4>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Kumargaon, Sylhet-3114</p>
          <p><FontAwesomeIcon icon={faPhone} /> Mobile: +8801746875596</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> E-mail : cse@sust.edu</p>
        </div>

        <div className="footer-col newsletter">
          <h4>Newsletter</h4>
          <p>Get the latest updates, news and events delivered to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" aria-label="email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
