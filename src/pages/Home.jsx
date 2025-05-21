import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SectionCard from '../components/SectionCard';
import { SECTIONS } from '../components/sectionConfig';
import useSectionData from '../hooks/useSectionData';
import { updateNavHeight, handleNavFixed } from '../utils/navHelpers';


const Home = () => {
  const [activeSection, setActiveSection] = useState('papers');
  const [pendingSection, setPendingSection] = useState('papers');
  const { data: sectionData = [], loading, error } = useSectionData(pendingSection);

  const navRef = useRef(null);
  const navContainerRef = useRef(null);
  const headerRef = useRef(null);

  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  const handleNavClick = (section) => {
    setPendingSection(section);
    if (navContainerRef.current) {
      const top = navContainerRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Nav fixed 처리
  useEffect(() => {
    const onScroll = () => handleNavFixed(navContainerRef, setIsNavFixed);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Nav가 fixed 상태가 바뀔 때마다 navHeight 재측정
  useEffect(() => {
    updateNavHeight(isNavFixed, navRef, setNavHeight);
  }, [isNavFixed]);

  // pendingSection이 바뀌면 activeSection도 같이 바꿔줌
  useEffect(() => {
    setActiveSection(pendingSection);
  }, [pendingSection]);

  // SectionCard 렌더링
  const renderSectionCards = () => {
    if (!Array.isArray(sectionData) || sectionData.length === 0) return <div>No data available.</div>;
    return sectionData.map((item, idx) => {
      const card = <SectionCard key={idx} section={activeSection} data={item} />;
      return card === null ? (
        <div key={idx}>준비중입니다</div>
      ) : (
        card
      );
    });
  };

  return (
    <div className="container">
      <div ref={headerRef}>
        <Header />
      </div>
      <div ref={navContainerRef} style={{ position: 'relative', zIndex: 100 }}>
        <div
          ref={navRef}
          className={isNavFixed ? 'nav-fixed' : ''}
          style={isNavFixed ? { width: '100%', left: 0, top: 0 } : {}}
        >
          <Navigation
            sections={Object.entries(SECTIONS)}
            active={activeSection}
            setActive={handleNavClick}
          />
        </div>
      </div>
      <main className="content" style={isNavFixed && navHeight ? { marginTop: navHeight } : {}}>
        {loading && <div>Loading...</div>}
        {error && <div>Error loading data.</div>}
        {!loading && !error && renderSectionCards()}
      </main>
      <Footer />
    </div>
  );
};

export default Home;