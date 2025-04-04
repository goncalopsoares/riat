import { useUser } from "../contexts/UserContext";

const Navbar = () => {
    const { user } = useUser();

    return (
        <nav>
            <a href="/">Responsible Innovation Assessment Tool</a>
            {user && user.user_role === 1 ? (
                <>
                    <ul>
                        <li><a href="/surveytools">Assessments</a></li>
                        <li><a href="/">Users & Projects</a></li>
                        <li><a href="/">Reports & Data</a></li>
                        <li><a href="/scaletools">Scales</a></li>
                        <li><a href="/">Profile</a></li>
                    </ul>
                </>
            ) : (
                <>
                    <ul>
                        <li><a href="/">Projects</a></li>
                        <li><a href="/assessment">Assessments</a></li>
                        <li><a href="/">Reports</a></li>
                        <li><a href="/">Profile</a></li>
                    </ul>
                </>
            )}
        </nav>
    );
};

export default Navbar;