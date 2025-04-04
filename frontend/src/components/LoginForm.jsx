import { useState } from 'react';
import api from '../api';
import { data, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useUser } from "../contexts/UserContext";
import "../styles/forms.css";

const LoginForm = ({ routeOne, routeTwo, method }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUser } = useUser();
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === 'register' && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        setError('');

        try {
            const requests = [
                api.post(routeOne, {
                    user_email: email,
                    password,
                    ...(method === 'register' && { user_first_name: first_name }),
                    ...(method === 'register' && { user_last_name: last_name })
                })
            ];

            if (method === 'login') {
                requests.push(api.post(routeTwo, { email, password }));

            }

            const [responseOne, responseTwo] = await Promise.all(requests);

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, responseOne.data.access);
                localStorage.setItem(REFRESH_TOKEN, responseOne.data.refresh);
                localStorage.setItem('user', JSON.stringify(responseTwo.data.user));

                setUser(responseTwo.data.user);

                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error);
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    return <form onSubmit={handleSubmit} className="login-form-container">
        <h1>{name}</h1>
        <input
            className='login-form-input'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            className='password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {method === 'register' ? <>
            <input
                className='login-form-input'
                type='password'
                placeholder='Confirm your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
                className='login_form-input'
                type='text'
                placeholder='Enter your first name'
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                className='login_form-input'
                type='text'
                placeholder='Enter your last name'
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
            />
        </> : null}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className='login-form-button' type='submit' disabled={loading}>
            {name}
        </button>
    </form>;
}

export default LoginForm;