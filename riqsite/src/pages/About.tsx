import '../styles/PageContent.css';
import '../styles/About.css';
import cropped from '../assets/cropped.png';

const About = () => {
    return (
        <div className="page-content">
            <h2>About</h2>
            
            <div className="profile-container">
                <img src={cropped} alt="Tariq Georges" className="profile-image" />
            </div>
            
            <div className="about-content">
                <div className="about-section">
                    <h3>About Me</h3>
                    <p>
                        Tariq Georges is a multi-faceted Musician that has been trained in classical music. 
                        He has been playing the piano since the age of 4 and is a self taught producer and audio engineer.
                        He has been making beats since 2020 when COVID-19 hit. He used that time to develop his skills 
                        as a producer and engineer. He now works with a variety of artists from Boston, London, 
                        and more to make hits.
                    </p>
                </div>
                {/* You can add more sections here if needed */}
            </div>
        </div>
    );
};

export default About;
