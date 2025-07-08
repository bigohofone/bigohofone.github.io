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
import useNavigation from '../hooks/useNavigation';
import Content from '../components/Content';
import Header from '../components/Header';

import useContent from '../hooks/useContent';

import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Home = () => {

  const {
    contentRefs,
    contentSectionRef,
    getContentBlockRef,
    getCurrentContentKey,
  } = useContent();

  const {
		navRef,
		sectionActive,
		handleNavClick
  } = useNavigation({
    contentRefs,
    contentSectionRef,
    getContentBlockRef,
    getCurrentContentKey,
  });

  return (
    <>
      <div className='app'>
        <div className="app__inner">
          <Navigation
            sectionActive={sectionActive}
            navRef={navRef}
            onNavClick={handleNavClick}
          />
          <Header />
          <Content
            contentSectionRef={contentSectionRef}
            getContentBlockRef={getContentBlockRef}
          />
      </div>
    </div>
    <Footer />
  </>
  );
};

export default Home;