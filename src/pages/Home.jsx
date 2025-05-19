import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!loading && !error) {
      setActiveSection(pendingSection);
    }
  }, [loading, error, pendingSection]);

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
      <Header />
      <Navigation
        sections={Object.entries(SECTIONS)} // 배열로 변환해서 전달
        active={activeSection}
        setActive={setPendingSection}
      />
      <main className="content">
        {loading && <div>Loading...</div>}
        {error && <div>Error loading data.</div>}
        {!loading && !error && renderSectionCards()}
      </main>
      <Footer />
    </div>
  );
};

export default Home;