import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AboutMe from './pages/AboutMe';
import Publications from './pages/Publications';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/footer.jsx';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div style={{ height: '4rem' }}></div>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;