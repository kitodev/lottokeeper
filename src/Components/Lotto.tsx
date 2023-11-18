import React, { useState, useEffect } from 'react';
import Operator from './Operator';
import Player from './Player';
import { Link } from 'react-router-dom'
import './css/LotteryGame.css';

interface PlayerState {
  name: string;
  balance: number;
  tickets: any[];
  totalWinnings: number;
  id: number;
}

interface OperatorState {
  balance: number;
  submittedTickets: any[];
}

const initialPlayerState: PlayerState = {
  name: '',
  balance: 10000,
  tickets: [],
  totalWinnings: 0,
  id: 0,
};

const initialOperatorState: OperatorState = {
  balance: 0,
  submittedTickets: [],
};

const LotteryGame: React.FC = () => {
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
  const [operator, setOperator] = useState<OperatorState>(initialOperatorState);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [roundResults, setRoundResults] = useState<any>(null);
  const [numTicketsToBuy, setNumTicketsToBuy] = useState<number>(1);
  const [canBuyTickets, setCanBuyTickets] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    saveDataToServer();
  }, [player, operator]);

  const fetchData = async () => {
    try {
      const playerName = player.name;
      const playersResponse = await fetch('http://localhost:3001/players');
      const playersData = await playersResponse.json();

      const currentPlayer = playersData.players.find((p: PlayerState) => p.name === playerName);

      if (currentPlayer) {
        setPlayer(currentPlayer);
      } else {
        const newPlayer: PlayerState = {
          name: playerName,
          balance: 10000,
          tickets: [],
          totalWinnings: 0,
          id: Math.floor(Math.random() * 1000000),
        };

        setPlayer(newPlayer);

        await fetch('http://localhost:3001/players', {
          method: 'POST',
          body: JSON.stringify(newPlayer),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      }

      const operatorResponse = await fetch('http://localhost:3001/operator');
      const operatorData = await operatorResponse.json();

      setOperator(operatorData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveDataToServer = async () => {
    try {
      if (player.name !== '') {
        if (player?.id) {
          await fetch(`http://localhost:3001/players/${player.id}`, {
            method: 'PUT',
            body: JSON.stringify(player),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        }

        await fetch('http://localhost:3001/operator', {
          method: 'PUT',
          body: JSON.stringify(operator),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const checkPlayerExists = async () => {
    try {
      const response = await fetch(`http://localhost:3001/players?name=${player.name}`);
      const playerData = await response.json();

      if (playerData.length > 0) {
        setPlayer(playerData[0]);
      } else {
        const newPlayer: PlayerState = {
          name: player.name,
          balance: 10000,
          tickets: [],
          totalWinnings: 0,
          id: Math.floor(Math.random() * 1000000),
        };

        setPlayer(newPlayer);

        await fetch('http://localhost:3001/players', {
          method: 'POST',
          body: JSON.stringify(newPlayer),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      }
    } catch (error) {
      console.error('Error checking player existence:', error);
    }
  };

  const generateRandomNumbers = (count: number): number[] => {
    const numbers: number[] = [];
    while (numbers.length < count) {
      const randomNum: number = Math.floor(Math.random() * 39) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    return numbers;
  };

  const buyTickets = () => {
    if (player.name !== '') {
      if (canBuyTickets === false) {
        // Handle the case when tickets have already been purchased for the draw
      }
      if (player.balance >= 500 * numTicketsToBuy && canBuyTickets) {
        const newTickets = Array.from({ length: numTicketsToBuy }, (_, index) => ({
          numbers: generateRandomNumbers(5),
          isPlayerTicket: true,
          id: player.tickets.length + index + 1,
        }));

        setPlayer((prevPlayer: PlayerState) => ({
          ...prevPlayer,
          balance: prevPlayer.balance - 500 * numTicketsToBuy,
          tickets: [...prevPlayer.tickets, ...newTickets],
        }));

        saveDataToServer();

        setOperator((prevOperator: OperatorState) => ({
          ...prevOperator,
          balance: prevOperator.balance + 500 * numTicketsToBuy,
          submittedTickets: [...prevOperator.submittedTickets, ...newTickets],
        }));

        setCanBuyTickets(false);
      } else {
        alert('Tickets already purchased for this draw! or Insufficient balance to buy tickets');
      }
    } else {
      alert('Please enter your name');
    }
  };

  const startDraw = () => {
    if (canBuyTickets === false) {
      if (player.tickets.length < numTicketsToBuy) {
        alert('Buy enough tickets before starting the draw!');
        return;
      }

      const newDrawnNumbers = generateRandomNumbers(5);
      setDrawnNumbers(newDrawnNumbers);

      const results = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        0: 0,
        totalPrize: 0,
        operatorProfit: 0,
      };

      player.tickets.slice(0, numTicketsToBuy).forEach((ticket: any) => {
        const hits = ticket.numbers.filter((num: any) => newDrawnNumbers.includes(num)).length;
        const prize = calculatePrize(hits);

        results[hits as keyof typeof results] += 1;
        results.totalPrize += prize.prize;

        setPlayer((prevPlayer: PlayerState) => ({
          ...prevPlayer,
          balance: prevPlayer.balance + prize.prize,
          totalWinnings: prevPlayer.totalWinnings + prize.prize,
        }));

        setOperator((prevOperator: OperatorState) => ({
          ...prevOperator,
          balance: prevOperator.balance + prize.operatorProfit - prize.prize,
        }));
      });

      results.operatorProfit = operator.balance - results.totalPrize;
      setRoundResults(results);

      setCanBuyTickets(true);
    } else {
      alert('Please buy the ticket');
    }
  };

  const calculatePrize = (hits: number) => {
    const prizeTable: { [key: number]: number } =  {
      2: 100,
      3: 500,
      4: 1000,
      5: 5000,
    };
    const operatorProfitPercentage = 10;
    const prize = prizeTable[hits] || 0;

    const operatorProfit = (prize * operatorProfitPercentage) / 100;
    return { prize, operatorProfit };
  };

/**
 * Update the player's name using the provided new name.
 * @param {string} newName - The new name for the player.
 * @returns {void}
 */

  const updatePlayerName = (newName: string) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, name: newName }));
  };

/**
 * Reset the game state to its initial values.
 * @returns {void}
 */  

  const resetGame = () => {
    setPlayer(initialPlayerState);
    setOperator(initialOperatorState);
    setDrawnNumbers([]);
    setNumTicketsToBuy(1);
    setRoundResults(null);
    setCanBuyTickets(true);
  };

  return (
    <div className="lottery-game-container">
    <h1>Lottery Game</h1>
    <Player
      player={player}
      numTicketsToBuy={numTicketsToBuy}
      setNumTicketsToBuy={setNumTicketsToBuy}
      buyTickets={buyTickets}
      resetGame={resetGame}
      updateName={updatePlayerName}
      checkPlayerExists={checkPlayerExists}
    />
    <Operator
      operator={operator}
      startDraw={startDraw}
      drawnNumbers={drawnNumbers}
      roundResults={roundResults}
    />
    <div>
      <button onClick={resetGame}>Reset Game</button>
      
    </div>
    <div>
    <Link to="/operator-dashboard">
          <button>Go to Operator Page</button>
    </Link>
    </div>
  </div>
  );
};

export default LotteryGame

