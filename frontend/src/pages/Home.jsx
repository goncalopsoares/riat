import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className='w-100 h-screen flex flex-col items-center justify-center' style={{ backgroundColor: '#f0f0f0' }}>
            <div className='text-center mb-5' style={{ padding: '8rem 9.5rem 0 9.5rem' }}>
                <h1 className='main-title'>How responsible is your innovation?</h1>
                <p className='sub-title'>Take this self-assessment to find out how the path to full responsibility.</p>
            </div>
            <div className='my-5 w-100 text-center'>
                <button onClick={() => navigate('/assessment/')}
                    className='forms-button'>
                    <p className='m-0'>Start assessment</p>
                </button>
            </div>
            <div className='w-100'>
                <img
                    src="/landing_page_img.png"
                    alt="SoTecIn Factory"
                    className='w-100'
                />
            </div>
            <div className='mt-5' style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <div className='d-flex flex-row justify-content-center align-items-start'>
                    <img src="/flag_eu.jpg"
                        alt="Innovation Assessment"
                        className='mx-4'
                    />
                    <p>This project has received funding from the
                        European Union’s Horizon Europe research
                        and innovation programme under the
                        Grant Agreement 101058385.
                        <br />
                        <br />
                        Views and opinions expressed are however
                        those of the authors only and do not
                        necessarily reflect those of the European
                        Union or Horizon Europe. Neither the
                        European Union nor the granting authority
                        can be held responsible for them.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;