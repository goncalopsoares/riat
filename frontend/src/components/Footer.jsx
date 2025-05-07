import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Footer = () => {

    const [isHomePage, setIsHomePage] = useState(false);
    const currentPath = useLocation().pathname;
    const { user } = useUser();

    useEffect(() => {

        if (currentPath === '/') {
            setIsHomePage(true);
        }
        else {
            setIsHomePage(false);
        }
    }, [currentPath]);

    if (user && user.user_role === 2) {
        return (
            <footer
                className={`bg-white text-black ${isHomePage ? '' : 'py-2'}`}
                style={{ zIndex: 5, height: '10vh' }}
            >
                <div
                    className={isHomePage ? 'py-5' : 'border-top border-secondary-subtle py-2'}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        alignItems: isHomePage ? '' : 'center',
                    }}
                >
                    {isHomePage && (
                        <div className="d-flex flex-row justify-content-center align-items-start me-2">
                            <img
                                src="/flag_eu.jpg"
                                alt="Innovation Assessment"
                                className="mx-4"
                            />
                            <p className='mb-0' style={{ fontSize: '0.75rem' }}>
                                This project has received funding from the European Union’s Horizon Europe research
                                and innovation programme under the Grant Agreement 101058385.
                                <br />
                                <br />
                                Views and opinions expressed are however those of the authors only and do not
                                necessarily reflect those of the European Union or Horizon Europe. Neither the
                                European Union nor the granting authority can be held responsible for them.
                            </p>
                        </div>
                    )}
                    {isHomePage ? (
                        <div className="d-flex flex-column align-items-end justify-content-end ms-2">
                            <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                                <img
                                    src="/SoTecIn_Logo_Horizontal.png"
                                    alt="SoTecIn_Logo_Horizontal"
                                    className="mx-4"
                                    style={{ width: '10rem' }}
                                />
                                <img
                                    src="/INESCTEC_logo_COLOR.png"
                                    alt="INESCTEC_logo_COLOR"
                                    className="mx-4"
                                    style={{ width: '10rem' }}
                                />
                            </div>
                            <p className="mb-0 me-4" style={{ fontSize: '0.75rem' }}>
                                2025. Responsible Innovation Assessment Tool. All rights reserved.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="align-items-center ms-4">
                                <p className="mb-0" style={{ fontSize: '0.75rem' }}>
                                    2025. Responsible Innovation Assessment Tool. All rights reserved.
                                </p>
                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-end me-4">
                                <img
                                    src="/SoTecIn_Logo_Horizontal.png"
                                    alt="SoTecIn_Logo_Horizontal"

                                    style={{ width: '10rem' }}
                                />
                                <img
                                    src="/INESCTEC_logo_COLOR.png"
                                    alt="INESCTEC_logo_COLOR"

                                    style={{ width: '10rem' }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </footer >
        );
    }
}

export default Footer;