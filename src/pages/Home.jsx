import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import Card from '../components/Card';
import useCard from '../hooks/useCard';
import useNavigation from '../hooks/useNavigation';

const Home = () => {

  const {
    sectionActive,
    sectionPending,
    isNavFixed,
    navHeight,
    navRef,
    navContainerRef,
    handleNavClick,
  } = useNavigation('papers');

  const { 
    data: sectionData = [], 
    loading: sectionLoading, 
    error: sectionError 
  } = useCard(sectionPending);

  return (
    <div className="container">
      <Header />
      <Navigation
        sectionActive={sectionActive}
        isNavFixed={isNavFixed}
        navRef={navRef}
        navContainerRef={navContainerRef}
        onNavClick={handleNavClick}
      />
      <Card
        sectionActive={sectionActive}
        sectionData={sectionData}
        loading={sectionLoading}
        error={sectionError}
        isNavFixed={isNavFixed}
        navHeight={navHeight}
      />
      <Footer />
    </div>
  );
};

export default Home;