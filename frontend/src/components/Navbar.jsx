import { useUser } from "../contexts/UserContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Navbar = () => {
    const { user } = useUser();

    return (
        <nav className="navbar bg-body-white sticky-top border-bottom border-secondary-subtle">
            <div className="container-fluid mx-2 my-4">
                <a href="/" className="text-dark text-decoration-none">Responsible Innovation Assessment Tool</a>
                {user && user.user_role === 1 ? (
                    <ul className="navbar-nav d-flex flex-row me-3">
                        <li className="nav-item mx-2"><a className="nav-link" href="/surveytools">Assessments</a></li>
                        <li className="nav-item mx-2"><a className="nav-link" href="/">Users & Projects</a></li>
                        <li className="nav-item mx-2"><a className="nav-link" href="/">Reports & Data</a></li>
                        <li className="nav-item mx-2"><a className="nav-link" href="/scaletools">Scales</a></li>
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
                            <button
                                className="btn btn-link nav-link d-flex align-items-center dropdown-toggle position-relative"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <AccountCircleIcon />
                            </button>
                            <ul className="dropdown-menu position-absolute">
                                <li><a className="dropdown-item" href="/">Profile</a></li>
                                <li><a className="dropdown-item" href="/logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                )
                }
            </div >
        </nav >
    );
};

export default Navbar;