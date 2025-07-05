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
import Introduction from '../components/Introduction';
import News from '../components/News';

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
      <header className="header">
        <div className="header__inner">
          <h1 className="header__title">WONJUN OH</h1>
          <Introduction />
          <News />
        </div>
      </header>
      <div className='app'>
        <div className="app__inner">
          <aside className="sidebar">
            <nav className="sidebar-navigation">
              <Navigation
                sectionActive={sectionActive}
                navRef={navRef}
                onNavClick={handleNavClick}
              />
            </nav>
          <section className="sidebar-extras">
            {/* 기타 컴포넌트나 정보가 들어갈 수 있는 영역 */}
          </section>
        </aside>
        <main className="main-content">
          <Content
            contentSectionRef={contentSectionRef}
            getContentBlockRef={getContentBlockRef}
          />
        </main>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default Home;