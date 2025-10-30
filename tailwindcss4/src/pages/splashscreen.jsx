import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimate(true), 1000);
    const timer2 = setTimeout(() => navigate("/home"), 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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
