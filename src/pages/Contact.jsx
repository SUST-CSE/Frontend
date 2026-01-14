import { useState } from 'react';
import Subheader from "../components/Subheader/Subheader";
import Location from "../components/Location/Location";
import ContactComponent from "../components/ContactComponent/ContactComponent";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import contactService from '../api/services/contactService';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitting(true);

    try {
      const response = await contactService.submitContact(formData);
      if (response.success) {
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage('Error: ' + (response.message || 'Failed to send message'));
      }
    } catch (err) {
      setSubmitMessage('Error: ' + (err.message || 'Failed to send message'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      { }
      <Subheader header="If you have any queries, please contact us." backgroundImage="/images/banner2.jpg" />
      <div className="contact-page">
        <ContactComponent
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitting={submitting}
          submitMessage={submitMessage}
        />
        <Location />
      </div>
      <Footer />
    </>
  );
};

export default Contact;
