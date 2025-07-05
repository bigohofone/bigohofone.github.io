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
          <div className="header__content">
            <div>
              안녕하세요. 이 페이지는 임시로 작성된 소개 섹션입니다.<br />
              실제 내용이 준비되기 전까지 임시 텍스트가 표시됩니다.<br />
              개발 및 디자인 테스트를 위해 작성되었습니다.<br />
              레이아웃과 스타일을 확인하는 용도입니다.<br />
              곧 더 알찬 정보로 채워질 예정입니다.<br />
              현재는 구조와 컴포넌트 동작을 점검하고 있습니다.<br />
              임시 데이터는 언제든지 변경될 수 있습니다.<br />
              피드백이나 제안이 있으시면 언제든 연락주세요.<br />
              방문해주셔서 감사합니다.<br />
              앞으로 더 좋은 콘텐츠로 찾아뵙겠습니다.
            </div>
          </div>
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