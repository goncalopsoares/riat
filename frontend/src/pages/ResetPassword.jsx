import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <LoginForm routeOne='/api/api/user/reset_password/' method='reset_password' />
    );
};

export default Login;