import { useUser } from "../contexts/UserContext";

const ToolBarAdmin = () => {

    const { user } = useUser();

    const currentPage = window.location.pathname.split('/')[1];

    const userRole = user ? user.user_role : null;

    return (
        <>
            {userRole === 1 && (
                <div
                    className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary z-3 position-fixed"
                    style={{ width: '16rem', height: '100vh' }}
                >
                    <a
                        href="/"
                        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
                    >
                        <span className="fs-4">Dashboard</span>
                    </a>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item">
                            <a
                                href="/surveytools"
                                className={`nav-link ${currentPage === 'surveytools' || currentPage === 'surveyadmin' ? 'text-decoration-underline' : 'link-body-emphasis'
                                    }`}
                                aria-current={currentPage === 'surveytools' || currentPage === 'surveyadmin' ? 'page' : undefined}
                            >
                                Assessments
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentPage === 'projects' ? 'text-decoration-underline' : 'link-body-emphasis'
                                    }`}
                                aria-current={currentPage === 'projects' ? 'page' : undefined}
                            >
                                Users & Projects

                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentPage === 'reports' ? 'text-decoration-underline' : 'link-body-emphasis'
                                    }`}
                                aria-current={currentPage === 'reports' ? 'page' : undefined}
                            >
                                Reports and Data
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentPage === 'recommendations' ? 'text-decoration-underline' : 'link-body-emphasis'
                                    }`}
                                aria-current={currentPage === 'recommendations' ? 'page' : undefined}
                            >
                                Recommendations
                            </a>
                        </li>
                        <li>
                            <a
                                href="/scaletools"
                                className={`nav-link ${currentPage === 'scaletools' ? 'text-decoration-underline' : 'link-body-emphasis'
                                    }`}
                                aria-current={currentPage === 'scaletools' ? 'page' : undefined}
                            >
                                Scales
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default ToolBarAdmin;
