import "./FacultyHeader.css"
const FacultyHeader = () => {
  return (
    <div>
      <section className="FacultyHeader">
      <h1>Our Faculties</h1>
      <div className="row">
        <div className="faculty-col">
          <img src="/images/Masum.jpg" alt="" />
          <h3>Md Masum</h3>
          <p>
            Professor & Head
          </p>
        </div>
        <div className="faculty-col">
          <img src="/images/shahid.jpg" alt="" />
          <h3>Mohammad Shahidur Rahman, PhD</h3>
          <p>
            Professor
          </p>
        </div>
        <div className="faculty-col">
          <img src="/images/rumi.jpg" alt="" />
          <h3>Md. Mehedi Hasan</h3>
          <p>
            Lecturer
          </p>
        </div>
      </div>
    </section>
    </div>
  );
};

export default FacultyHeader;