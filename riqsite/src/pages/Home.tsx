import '../styles/Home.css'
import '../styles/PageContent.css'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="page-content home-content">
            <h2>Welcome to RIQ</h2>
            <div className="home-sections">
                <Link to="/beats" className="home-section">
                    <h3>Beats</h3>
                    <p>Beat Production</p>
                </Link>
                <Link to="/mixing" className="home-section">
                    <h3>Mixing</h3>
                    <p>Mixing Services</p>
                </Link>
                <Link to="/about" className="home-section">
                    <h3>About</h3>
                    <p>About RIQ</p>
                </Link>
            </div>
        </div>
    );
}

export default Home;