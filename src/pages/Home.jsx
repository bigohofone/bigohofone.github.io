/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
// import Card from '../components/Section';
// import useCard from '../hooks/useCard';
import useNavigation from '../hooks/useNavigation';
import Content from '../components/Content';
import Introduction from '../components/Introduction';
import News from '../components/News';

import useContent from '../hooks/useContent';

import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Home = () => {

  const {
    contentsRef,
    getContentRef,
    getCurrentContentKey,
    scrollToContentKey
  } = useContent();

  const {
		navContainerRef,
		navRefs,
		sectionActive,
		handleNavClick
  } = useNavigation({
    contentsRef,
    getContentRef,
    getCurrentContentKey,
    scrollToContentKey
  });

  return (
    <>
      <div className='home-container' style={{ display: 'flex' }}>
        <div className='home-sidebar-container'>
          <div className="home-sidebar">
            <Navigation
              sectionActive={sectionActive}
              navContainerRef={navContainerRef}
              navRefs={navRefs}
              onNavClick={handleNavClick}
            />
          </div>
        </div>
        <div className='home-main'>
          <div className='home-main-elem'>
            <Introduction />
            <News />
          </div>
          <div className='home-main-elem'>
            <Content
              contentsRef={contentsRef}
              getContentRef={getContentRef}
              getCurrentContentKey={getCurrentContentKey}
              scrollToContentKey={scrollToContentKey}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;