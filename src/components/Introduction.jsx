/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React, { useRef } from 'react';
import NeuralNetBackground from '../utils/backgroundUtils';

function ArrowDown() {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        position: 'relative',
        bottom: '3rem',
        fontSize: '3.5rem',
        fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
        display: 'inline-block',
        margin: 0,
        transform: 'rotate(90deg)',
        animation: 'bounce-arrow 1s infinite alternate',
      }}
    >
      arrow_forward
      <style>
        {`
          @keyframes bounce-arrow {
            0% { transform: rotate(90deg) translateX(0); }
            100% { transform: rotate(90deg) translateX(1rem); }
          }
        `}
      </style>
    </span>
  );
}

const Introduction = () => {
  const introRef = useRef(null);

  const handleClick = () => {
    if (introRef.current) {
      const rect = introRef.current.getBoundingClientRect();
      window.scrollTo({
        top: rect.bottom + window.scrollY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className="introduction responsive-header"
      ref={introRef}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="introduction-content" style={{ position: 'relative', zIndex: 1 }}>
        <h1>
          Hello World <br /> I'm Wonjun Oh
        </h1>
        <p>
          I’m an undergraduate student at Korea University, driven by a curiosity for how machines understand and reason in an increasingly complex world. My research interests lie in building intelligent systems that can sift through vast, multimodal streams of information to surface what’s relevant and make informed decisions. Currently, I explore topics in search systems and conversational AI with a broader goal of understanding and advancing multimodal intelligence that can ground, reason, and interact across diverse forms of information.
        </p>
      </div>
      <div className="introduction-arrow" style={{ position: 'relative', zIndex: 1 }}>
        <ArrowDown />
      </div>
      <NeuralNetBackground containerRef={introRef} />
    </header>
  );
};

export default Introduction;