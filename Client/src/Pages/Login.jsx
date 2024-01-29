import "../Pages/Page Styles/Login.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import logo from "../assets/siteimages/sitelogo/whitelogo.png";


function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const response = await axios.post('/login', {
        email,
        password,
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const token = response.data.token; // Assuming your server returns a token
        localStorage.setItem('token', token);
        toast.success('Login successful');
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-main-cont">
      <div className="login-container">
        <img src={logo} alt="Logo" className="login-logo"   />

        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <input
              className="email-form"
              type="email"
              id="email"
              value={data.email} // Access email from the state
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="Email"
            />
          </div>

          <div className="login-input-group">
            <input
              className="login-password-form"
              type="password"
              id="password"
              value={data.password} // Access password from the state
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="Password"
            />
          </div>

          {/* Use Link to navigate to the dashboard */}
          {/* <Link to="/dashboard"> */}
          <button className="login-sign-button" type="submit">
            Log in
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
