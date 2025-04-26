import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    return (
        <>
            <div>
                <h1>How responsible is your innovation?</h1>
                <p>Take our assessment to find out how your innovation strategy compares to the world's most innovative companies.</p>
            </div>
            <div>
                <button onClick={() => navigate('/assessment/')}>
                    <p>Start assessment</p>
                </button>
            </div>
            <div>
                <img
                    src="/landing_page_img.jpg"
                    alt="Innovation Assessment"
                />
            </div>
            <div>
                <img src="/flag_eu.jpg"
                    alt="Innovation Assessment"
                />
                <p>This project has received funding from the
                    European Union’s Horizon Europe research
                    and innovation programme under the
                    Grant Agreement 101058385.

                    Views and opinions expressed are however
                    those of the authors only and do not
                    necessarily reflect those of the European
                    Union or Horizon Europe. Neither the
                    European Union nor the granting authority
                    can be held responsible for them.</p>
            </div>
        </>
    );
};

export default Home;