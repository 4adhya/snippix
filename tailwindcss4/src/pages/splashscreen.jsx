import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animation after 1 sec
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 1000);

    // Redirect after animation finishes (1.6s total)
    const redirectTimer = setTimeout(() => {
      navigate("/home");
    }, 1600);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <img
        src={logo}
        alt="Snippix Logo"
        className={`w-32 transition-all duration-700 ${
          animate ? "animate-splash" : ""
        }`}
      />
    </div>
  );
}
