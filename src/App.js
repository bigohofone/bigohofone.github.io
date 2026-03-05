import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/footer'

import { routeConfig } from './routes';

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