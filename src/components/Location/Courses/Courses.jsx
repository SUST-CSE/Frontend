import "./Courses.css";

const Courses = () => {
  return (
    <section className="course">
      <h1>Courses We Offer</h1>
      <p>
        CSE department mainly offers four-year undergraduate course in Computer Science & Engineering where courses are
        designed in such a way so that students graduating from this department have a balance of theory and practical 
        skills to prepare them for the highly competitive workplace.
        A one year M.Sc. (General) and one-and-half year M.Sc.(Thesis) programs in Computer Science and Engineering are also 
        being run by the department. Usually, every year we advertise in the national news papers for admission in the Masters 
        programs.
        Besides, the department also offers Ph.D. degrees in the relevant fields. Students fulfilling the requirements can 
        apply for admission in the Ph.D. program at any time of the year. Here is the application form for Ph.D. admission.  
        Besides undergraduate and Masters and Ph.D. programs, this department is also successfully running one year 
        (four semesters) certification program CCNA (CISCO Certified Network Associate) in collaboration with UNDP and CISCO).
      </p>
      <div className="row">
        <div className="course-col">
          <h2>Undergraduate</h2>
          <p>
            CSE department mainly offers four-year undergraduate course in Computer Science & Engineering
          </p>
        </div>
        <div className="course-col">
          <h2>M.Sc.</h2>
          <p>
            Every year we advertise in the national news papers for admission in the Masters programs.
          </p>
        </div>
        <div className="course-col">
          <h2>Ph. D.</h2>
          <p>
            The GSC may suggest courses, if felt necessary, for the Ph. D. students.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;
