import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useUser } from "../contexts/UserContext";
import "../styles/LoginForm.css";

const LoginForm = ({ routeOne, routeTwo, method }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (method === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const requests = [
        api.post(routeOne, {
          user_email: email,
          password,
          ...(method === "register" && { user_first_name: first_name }),
          ...(method === "register" && { user_last_name: last_name }),
        }),
      ];

      if (method === "login") {
        requests.push(api.post(routeTwo, { email, password }));
      }

      const [responseOne, responseTwo] = await Promise.all(requests);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, responseOne.data.access);
        localStorage.setItem(REFRESH_TOKEN, responseOne.data.refresh);
        localStorage.setItem("user", JSON.stringify(responseTwo.data.user));

        setUser(responseTwo.data.user);

        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await api.post("/api/user/reset_password_request/", { email });
      alert("Password reset link sent to your email.");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page-container">
      <div className="login-content-wrapper">
        {/* Left Section */}
        <div className="left-section">
          <div className="centered-content">
            <span className="tool-title">
              Responsible Innovation Assessment Tool
              <br />
            </span>
            <span className="tool-subtitle">by INESC TEC</span>
          </div>
        </div>
        {/* Right Section */}
        {(method === "login" || method === "register") && (
          <div className="right-section">
            {/* Section #1 */}
            <div className="welcome-section">
              {method === "login" && (
                <div className="welcome-title">Welcome Back!</div>
              )}
              {method === "login" ? (<div className="welcome-subtitle">
                Login to start a new assessment.
              </div>) : (
                <div className="welcome-subtitle">
                  Create an account to start a new assessment.
                </div>
              )}
            </div>
            {/* Section #3 */}
            <form onSubmit={handleSubmit} className="login-form-container">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="Your email here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Your password here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {method === "register" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter your first name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter your last name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
              <a onClick={() => navigate('/forgotpassword/')} className="forgot-password">Forgot password?</a>
              <button
                className="login-form-button"
                type="submit"
                disabled={loading}
              >
                {name}
              </button>
              {method === "login" ? (
                <div className="register-link">
                  <span>Don't have an account? </span>
                  <a href="/register/" className="create-new">Create new</a>
                </div>) : (
                <div className="register-link">
                  <span>Already have an account? </span>
                  <a href="/login/" className="create-new">Login</a>
                </div>
              )}
            </form>
          </div>)}
        {method === "reset_password" && (
          <div className="right-section">
            {/* Section #1 */}
            <div className="welcome-section">
              {method === "login" && (
                <div className="welcome-title">Welcome Back!</div>
              )}
              {method === "login" ? (<div className="welcome-subtitle">
                Login to start a new assessment.
              </div>) : (
                <div className="welcome-subtitle">
                  Create an account to start a new assessment.
                </div>
              )}
            </div>
            {/* Section #3 */}
            <form onSubmit={handleResetPassword} className="login-form-container">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="Your email here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="login-form-button"
                type="submit"
                disabled={loading}
              >
                Reset Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div >
  );
};

export default LoginForm;