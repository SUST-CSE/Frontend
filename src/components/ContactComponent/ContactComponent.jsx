import "./ContactComponent.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faHome, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ContactComponent = ({ formData, setFormData, handleSubmit, submitting, submitMessage }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section className="contact-us">
        <div className="row">
          <div className="contact-col">
            <div>
              <FontAwesomeIcon icon={faHome} className="icon" />
              <span>
                <h5>Kumargaon, Sylhet-3114, Bangladesh</h5>
              </span>
            </div>

            <div>
              <FontAwesomeIcon icon={faPhone} className="icon" />
              <span>
                <h5>Phone : +88-02996687020, Ext-2254 Mobile: +8801746875596</h5>
              </span>
            </div>

            <div>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <span>
                <h5>E-mail : cse@sust.edu</h5>
              </span>
            </div>
          </div>

          <div className="contact-col">
            {submitMessage && (
              <div style={{
                padding: '10px',
                marginBottom: '20px',
                borderRadius: '5px',
                background: submitMessage.includes('Error') ? '#fee' : '#efe',
                color: submitMessage.includes('Error') ? '#c33' : '#3c3'
              }}>
                {submitMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Enter your subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                rows="8"
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button mailTo='2021331006@student.sust.edu' type="submit" className="hero-btn red-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactComponent;
