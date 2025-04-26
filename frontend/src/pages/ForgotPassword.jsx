import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <LoginForm routeOne='/api/api/user/reset_password_request/' method='reset_password' />
    );
};

export default Login;