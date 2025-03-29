import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={handleLogoClick}>
                RIQ
            </div>
            <div className="navbar-right">
                <Link to="/beats" className="navbar-link">
                    Beats
                </Link>
                <Link to="/mixing" className="navbar-link">
                    Mixing + Mastering
                </Link>
                <Link to="/about" className="navbar-link">
                    About
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;