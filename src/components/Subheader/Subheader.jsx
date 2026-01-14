import "./Subheader.css";

import Navbar from "../Navbar/Navbar";

const Subheader = ({ header, backgroundImage }) => {
  const style = backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(4,9,30,0.7), rgba(4,9,30,0.7)), url(${backgroundImage})` }
    : {};

  return (
    <section className="sub-header" style={style}>
      <Navbar />
      <h1>{header}</h1>
    </section>
  );
};
export default Subheader;
