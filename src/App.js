import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AboutMe from './pages/AboutMe';
import Publications from './pages/Publications';
import CV from './pages/CV';
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
          <Route path="/cv" element={<CV />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div style={{ height: '4rem' }}></div>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;