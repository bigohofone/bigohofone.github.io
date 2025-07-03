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
    contentSectionRef,
    getContentBlockRef,
    getCurrentContentKey,
    scrollToContentKey
  } = useContent();

  const {
		navContainerRef,
		navRefs,
		sectionActive,
		handleNavClick
  } = useNavigation({
    contentSectionRef,
    getContentBlockRef,
    getCurrentContentKey,
    scrollToContentKey
  });

  return (
    <div className='app'>
      <header className="header">
        <div className="header__inner">
          <h1 className="header__title">WONJUN OH</h1>
        </div>
      </header>
      <div className="app__inner">
        <aside className="sidebar">
          <nav className="sidebar-navigation">
            <Navigation
            sectionActive={sectionActive}
            navContainerRef={navContainerRef}
            navRefs={navRefs}
            onNavClick={handleNavClick}
          />
        </nav>
        <section className="sidebar-extras">
          {/* 기타 컴포넌트나 정보가 들어갈 수 있는 영역 */}
        </section>
      </aside>
      <main className="main-content">
        {/* <Introduction /> */}
        {/* <News /> */}
        <Content
          contentSectionRef={contentSectionRef}
          getContentBlockRef={getContentBlockRef}
        />
        <Footer />
      </main>
    </div>
  </div>
  );
};

export default Home;