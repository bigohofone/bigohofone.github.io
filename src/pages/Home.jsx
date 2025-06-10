/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import Introduction from '../components/Introduction';
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
    prevSectionRef,
    handleNavClick,
  } = useNavigation('papers');

  const { 
    data: sectionData = [], 
    loading: sectionLoading, 
    error: sectionError 
  } = useCard(sectionPending);

  return (
    <div className="container">
      <Introduction 
        introRef={prevSectionRef}
      />
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