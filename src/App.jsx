import { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import useStore from "./zustand/store";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;