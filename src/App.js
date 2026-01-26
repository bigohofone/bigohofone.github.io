import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResumePage from './pages/ResumePage';
// import CVPage from './pages/CVPage';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ResumePage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;