// src/components/SplashScreen.js
import React, { useRef, useEffect, useState } from 'react';
import "./css/SplashScreen.css";

function SplashScreen({ socket }) {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState('none');

  
  useEffect(() => {
    socket.on('playMedia', () => {
      setShowVideo('flex');
      if (videoRef.current) {
        videoRef.current.play();
      }
    });

    return () => {
      socket.off('playMedia');
    };
  }, []);

  return (
    <div className="splash-screen">
      <img src="/media/splashscreen.jpg" alt="question" />
      <video ref={videoRef} preload="auto" autoPlay={false} style={{display: showVideo}}>
        <source src="/media/Intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default SplashScreen;
