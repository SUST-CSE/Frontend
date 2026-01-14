import { useState, useEffect } from 'react';
import facultyService from '../api/services/facultyService';

const Facultylist = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await facultyService.getFaculty();
        if (response.success) {
          setFaculty(response.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading faculty...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <section className="FacultyHeader">
      <h1>Our Faculties</h1>
      <div className="row">
        {faculty.map((member) => (
          <div key={member._id} className="faculty-col">
            <img src={member.image || '/images/default-avatar.jpg'} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.designation}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Facultylist;