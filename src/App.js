import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { routeConfig } from './Routes';

import Footer from './components/footer'

import './assets/styles/fonts.css';
import './assets/styles/material-symbols.css';

import './assets/styles/base/global.css';
import './assets/styles/base/layout.css';
import './assets/styles/base/menu.css';
import './assets/styles/base/dock.css';
import './assets/styles/base/contact.css';

import './assets/styles/components/footer.css';
import './assets/styles/components/resume.css';
import './assets/styles/components/cv.css';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* <Nav /> */}
        <Routes>
          {routeConfig.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </BrowserRouter>
      <Footer />
    </AppProvider>
  );
};

export default App;