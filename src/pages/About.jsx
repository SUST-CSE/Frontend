import Subheader from "../components/Subheader/Subheader";
import AboutUsBox from "../components/AboutUsBox/AboutUsBox";
import Footer from "../components/Footer/Footer";
import './About.css';

const About = () => {
  return (
    <>
      <Subheader header="About Us" backgroundImage="/images/background.jpg" />
      <div className="about-page">
        <AboutUsBox />
      </div>
      <Footer />
    </>
  );
};

export default About;
