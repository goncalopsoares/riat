import LoginForm from "../components/LoginForm";

const Register = () => {
    return (
        <LoginForm routeOne='/api/user/register/' method='register' />
    );
};

export default Register;