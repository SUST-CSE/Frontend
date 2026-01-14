import "./Facilities.css";

const Facilities = () => {
  return (
    <section className="facilities">
      <h1>Our Facilities</h1>
      <p>Immerse yourself in a world of exceptional amenities and services.</p>
      <div className="row">
        <div className="facilities-col">
          <img src="/images/iict.jpg" alt="" />
          <h3>Library</h3>
          <p>
            Dive into a sea of knowledge with our state-of-the-art library. An
            oasis for intellectual exploration.
          </p>
        </div>
        <div className="facilities-col">
          <img src="/images/iict.jpg" alt="" />
          <h3>Advanced Lab</h3>
          <p>
            Practice makes a man perfect. Our advanced labs provide hands-on
            experience with cutting-edge technology.
          </p>
        </div>
        <div className="facilities-col">
          <img src="/images/iict.jpg" alt="" />
          <h3>Tasty and Healthy Food</h3>
          <p>
            Indulge your taste buds with our delightful and nutritious cuisine.
            Fuel for both body and mind.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
