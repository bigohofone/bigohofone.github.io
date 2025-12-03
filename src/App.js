import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Nav from './components/Nav';
import Contact from './pages/Contact';
import FloatingControls from './components/Functional';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div style={{ height: '8rem' }}></div>
        <Footer />
      </BrowserRouter>
      {/* <FloatingControls /> */}
    </AppProvider>
  );
};

export default App;