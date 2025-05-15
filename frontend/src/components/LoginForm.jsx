import { useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useUser } from "../contexts/UserContext";
import "../styles/loginForm.css";

const LoginForm = ({ routeOne, routeTwo, method }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useUser();
  const { token } = useParams();
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  console.log(method);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if ((method === "register" || method === "reset_password") && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (method === "register") {
      const isChecked = document.getElementById("agreementRegister")?.checked;

      if (!isChecked) {
        setError("You must agree to the data privacy policy to proceed.");
        setLoading(false);
        return;
      }

      setError('');

    }

    try {
      const requests = [
        api.post(routeOne, {
          user_email: email,
          password,
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
      setError("Incorrect email address or password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordRequest = async () => {
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

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      return;
    }

    setLoading(true);


    try {
      await api.post("/api/user/reset_password/", { new_password: password, token });

      alert("Password reset successfully. You can now log in.");
      navigate("/login", { replace: true });

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
                  <label htmlFor="agreementRegister">
                    <input type="checkbox" id="agreementRegister" name="agreementRegister" className="mt-1" />
                    <span className="ms-2">
                      Yes, I've read the <a href="/privacy_policy_riat.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a> thoroughly and I'm ready to continue
                    </span>
                  </label>
                </>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {method === "login" && (<p>Forgot Password? <a onClick={() => navigate('/forgotpassword/')} className="create-new">Click here</a></p>)}
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
                <>
                  <div className="register-link">
                    <span>Already have an account? </span>
                    <a href="/login/" className="create-new">Login</a>
                  </div>
                  <div className="register-link">
                    <span> </span>
                    <a href="/" className="create-new">Click Here to read the GDPR</a>
                  </div>
                </>
              )}
            </form>
          </div>)}
        {method === "reset_password_request" && (
          <div className="right-section">
            {/* Section #1 */}
            <div className="welcome-section">
              <div className="welcome-subtitle">
                Enter your email to receive a password reset link
              </div>
            </div>
            {/* Section #3 */}
            <form onSubmit={handleResetPasswordRequest} className="login-form-container">
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
        {method === "reset_password" && (
          <div className="right-section">
            {/* Section #1 */}
            <div className="welcome-section">
              <div className="welcome-subtitle">
                Define your new password
              </div>
            </div>
            {/* Section #3 */}
            <form onSubmit={handleResetPassword} className="login-form-container">
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
              {error && <p style={{ color: "red" }}>{error}</p>}
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