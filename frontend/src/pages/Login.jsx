import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <LoginForm routeOne='/api/token/' routeTwo='/api/user/login/' method='login' />
    );
};

export default Login;