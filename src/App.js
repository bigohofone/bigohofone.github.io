import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { routeConfig } from './route';

import Footer from './components/footer'
import Menu from './components/menu';
import HeaderShortcutDock from './components/headerShortcutDock';

import './assets/styles/fonts.css';
import './assets/styles/material-symbols.css';

import './assets/styles/global.css';
import './assets/styles/layout.css';
import './assets/styles/menu.css';
import './assets/styles/dock.css';
import './assets/styles/links.css';

import './assets/styles/components/footer.css';
import './assets/styles/components/resume.css';
import './assets/styles/components/cv.css';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* <Menu /> */}
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