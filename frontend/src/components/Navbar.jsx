import { useUser } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Navbar = () => {

    const { user } = useUser();

    const navigate = useNavigate();

    return (
        <nav className="navbar sticky-top border-bottom border-secondary-subtle" style={{ zIndex: 5, height: "8rem", backgroundColor: "white" }}>
                <a href="/" className="text-dark text-decoration-none ms-4">
                    <span className="tool-title">
                        Responsible Innovation Assessment Tool
                        <br />
                    </span>
                    <span className="tool-subtitle">by INESC TEC</span>
                </a>
                {user && user.user_role === 1 ? (
                    <ul className="navbar-nav d-flex flex-row me-4">
                        <li className="nav-item mx-2 dropdown">
                            <button
                                className="btn btn-link nav-link d-flex align-items-center dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <AccountCircleIcon />
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/">Profile</a></li>
                                <li><a className="dropdown-item" href="/logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                ) : (
                    <ul className="navbar-nav d-flex flex-row me-3">
                        <li className="nav-item mx-2"><a className="nav-link" href="/projects">Projects</a></li>
                        <li className="nav-item mx-2"><a className="nav-link" href="/assessment">Assessments</a></li>
                        <li className="nav-item mx-2"><a className="nav-link" href="/">Reports</a></li>
                        <li className="nav-item mx-2 dropdown">
                            {user ? (
                                <button
                                    className="btn btn-link nav-link d-flex align-items-center dropdown-toggle position-relative"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <AccountCircleIcon />
                                </button>
                            ) : (
                                <div className="d-flex align-items-center">
                                    <button onClick={() => navigate('/login')} className="btn btn-secondary d-flex align-items-center">
                                        Sign In
                                    </button>
                                    <button onClick={() => navigate('/register')} className="btn btn-dark d-flex align-items-center ms-2">
                                        Register
                                    </button>
                                </div>
                            )}
                            <ul className="dropdown-menu position-absolute">
                                <li><a className="dropdown-item" href="/">Profile</a></li>
                                <li><a className="dropdown-item" href="/logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                )
                }
        </nav >
    );
};

export default Navbar;