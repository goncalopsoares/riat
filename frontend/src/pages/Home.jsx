import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className='w-100 h-screen flex flex-col items-center justify-center' style={{ backgroundColor: '#f0f0f0' }}>
            <div className='text-center mb-5' style={{ padding: '8rem 9.5rem 0 9.5rem' }}>
                <h1 className='main-title'>How responsible is your innovation?</h1>
                <p className='sub-title'>Take our assessment to find out how your innovation strategy compares to the world's most innovative companies.</p>
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
                    alt="Innovation Assessment"
                    className='w-100'
                />
            </div>
        </div>
    );
};

export default Home;