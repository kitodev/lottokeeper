import React from 'react';
import './sass/Operator.scss';

interface OperatorProps {
  operator: {
    balance: number;
  };
  startDraw: () => void;
  drawnNumbers: number[];
  roundResults: {
    [key: number]: number;
    totalPrize: number;
    operatorProfit: number;
  } | null;
}

const Operator: React.FC<OperatorProps> = ({ operator, startDraw, drawnNumbers, roundResults }) => {
  return (
    <div className="operator-container">
      <h2>Operator</h2>
      <p>Balance: {operator.balance} coins</p>
      <button onClick={startDraw}>Start Draw</button>
      {drawnNumbers.length > 0 && <p className='drawn-numbers'>Drawn Numbers: {drawnNumbers.join(', ')}</p>}
      {roundResults && (
        <div className='round-results'>
          <h3>Round Results</h3>
          <p>5 Hits: {roundResults[5]}</p>
          <p>4 Hits: {roundResults[4]}</p>
          <p>3 Hits: {roundResults[3]}</p>
          <p>2 Hits: {roundResults[2]}</p>
          <p>No Win: {roundResults[0]}</p>
          <p>Total Prize: {roundResults.totalPrize}</p>
          <p>Operator Profit: {roundResults.operatorProfit}</p>
        </div>
      )}
    </div>
  );
};

export default Operator;
