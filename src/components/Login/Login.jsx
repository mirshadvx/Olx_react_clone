import React, { useContext } from "react";
import { auth } from "../../config/firebase"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./Login.css";
import { AuthContext } from '../../App';
import { toast } from "react-toastify";
import { PropTypes } from "prop-types";

const Login = ({ isOpen, onClose }) => {

  const { LoginStatus ,login } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; 
      toast(`Welcome to Olx ${user.displayName}!`)
      login()
      onClose();
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-overlay" onClick={onClose}></div>
      <div className="login-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="login-buttons">
          <button className="btn google-btn" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Continue with Google
          </button>
          <p className="or-text">OR</p>
          <a href="/" className="email-link">
            Login with Email
          </a>
        </div>
        <div className="login-footer">
          <p>All your personal details are safe with us.</p>
          <p>
            By continuing, you are accepting OLX{" "}
            <a href="/">Terms and Conditions</a> and{" "}
            <a href="/">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  isOpen: PropTypes.boolean,
  onClose: PropTypes.boolean,
}

export default Login;




