import { AppProvider } from './contexts/AppContext';

import Home from './pages/Home';
import FloatingControls from './components/Functional';

const App = () => {
  return (
    <AppProvider>
      <Home />
      {/* <FloatingControls /> */}
    </AppProvider>
  );
};

export default App;