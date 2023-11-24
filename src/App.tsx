import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LotteryGame from './Components/Lotto';
import OperatorDashboard from './Components/OperatorDashboard';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LotteryGame />} />
        <Route path="/operator-dashboard" element={<OperatorDashboard />} />
      </Routes>
  );
};

export default App;