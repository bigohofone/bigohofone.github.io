import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SectionCard from '../components/SectionCard';
import { SECTIONS } from '../components/sectionConfig';
import useSectionData from '../hooks/useSectionData';

const Home = () => {
  const [activeSection, setActiveSection] = useState('papers');
  const [pendingSection, setPendingSection] = useState('papers');
  const { data: sectionData, loading, error } = useSectionData(pendingSection);

  const navRef = useRef(null);
  const navContainerRef = useRef(null);
  const headerRef = useRef(null);

  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  // Header가 50vh 이상 차지하도록 보장
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.minHeight = '50vh';
    }
  }, []);

  // Nav 높이 측정
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  // Nav fixed 처리 및 Content margin/padding 조정
  useEffect(() => {
    const handleScroll = () => {
      if (!navContainerRef.current) return;
      const navTop = navContainerRef.current.getBoundingClientRect().top;
      const willBeFixed = navTop <= 0;
      setIsNavFixed(willBeFixed);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nav가 fixed 상태가 바뀔 때마다 navHeight 재측정
  useEffect(() => {
    if (isNavFixed && navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
    // fixed 해제 시에는 marginTop을 0으로
    if (!isNavFixed) {
      setNavHeight(0);
    }
  }, [isNavFixed]);

  // 스크롤 트리거: Header가 50% 이상 보이고, 25% 이상 스크롤 시 Nav를 최상단으로 부드럽게 이동
  useEffect(() => {
    let alreadyScrolled = false;
    const handleScroll = () => {
      if (alreadyScrolled) return;
      if (!headerRef.current || !navContainerRef.current) return;
      const headerRect = headerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const headerVisibleRatio = Math.min(
        1,
        Math.max(0, (headerRect.bottom - Math.max(0, headerRect.top)) / headerRect.height)
      );
      if (
        window.scrollY > viewportHeight * 0.25 &&
        headerVisibleRatio > 0.5
      ) {
        alreadyScrolled = true;
        const navTop = navContainerRef.current.getBoundingClientRect().top + window.scrollY;
        // 천천히, 사람이 스크롤하는 것보다 느리게 부드럽게 스크롤
        const startY = window.scrollY;
        const distance = navTop - startY;
        const duration = 1000;  // 1초
        let startTime = null;

        function animateScroll(currentTime) {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // easeInOutQuad
          const ease = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, startY + distance * ease);
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        }
        requestAnimationFrame(animateScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // pendingSection이 바뀌면 activeSection도 같이 바꿔줌
  useEffect(() => {
    setActiveSection(pendingSection);
  }, [pendingSection]);

  // SectionCard 렌더링
  const renderSectionCards = () => {
    if (sectionData.length === 0) return <div>No data available.</div>;

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
            setActive={setPendingSection}
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