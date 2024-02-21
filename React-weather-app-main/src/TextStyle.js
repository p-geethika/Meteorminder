import React, { useRef, useEffect, useState } from "react";
import "./App.css";

export function SmallText({text, color}) {
    return (
        <span className='small-text' style={{color: color}}>{text}</span>
    );
}

export function SmallTextBold({text, color}) {
    return (
        <span className='small-text-bold' style={{color: color}}>{text}</span>
    );
}

export function MainScreenTemp({text, color}) {
    return (
        <span className='main-screen-temp' style={{color: color}}>{text}</span>
    );
}

export function MainScreenCondition({text, color}) {
    return (
        <span className='main-screen-condition' style={{color: color}}>{text}</span>
    );
}

export function Title({text, color}) {
    return (
        <span className='title' style={{color: color}}>{text}</span>
    );
}

export function ScrollingText ({ text }) {
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
  
    useEffect(() => {
      if (containerRef.current.scrollWidth > containerRef.current.clientWidth) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }, [text]);
  
    return (
      <div className="scrolling-text-container" ref={containerRef}>
        <div className={`scrolling-text ${isOverflowing ? "scroll" : ""}`}>{text}</div>
      </div>
    );
  };