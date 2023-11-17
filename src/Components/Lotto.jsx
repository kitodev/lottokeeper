import React, { useState, useEffect } from 'react';
import Operator from './Operator';
import Player from './Player';
import { Link } from 'react-router-dom'
import './css/LotteryGame.css';

const initialPlayerState = {
  name: '',
  balance: 10000,
  tickets: [],
  totalWinnings: 0,
  id:0,
};

const initialOperatorState = {
  balance: 0,
  submittedTickets: [],
};

  const LotteryGame = () => {
    const [player, setPlayer] = useState(initialPlayerState);
    const [operator, setOperator] = useState(initialOperatorState);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [roundResults, setRoundResults] = useState(null);
    const [numTicketsToBuy, setNumTicketsToBuy] = useState(1);
    const [canBuyTickets, setCanBuyTickets] = useState(true);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      saveDataToServer();
    }, [player, operator]);

     /**
 * Fetch player and operator data from the specified API endpoints.
 * @async
 * @function
 * @throws {Error} If there is an issue fetching data.
 * @returns {void}
 */
  
    const fetchData = async () => {
      try {
        const playerName = player.name;
        const playersResponse = await fetch('http://localhost:3001/players');
        const playersData = await playersResponse.json();
  
        const currentPlayer = playersData.players.find((p) => p.name === playerName);
  
        if (currentPlayer) {
          setPlayer(currentPlayer);
        } else {
          const newPlayer = {
            name: playerName,
            balance: 10000,
            tickets: [],
            totalWinnings: 0,
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
  /**
 * Save player and operator data to the server by making PUT requests to the respective API endpoints.
 * @async
 * @function
 * @throws {Error} If there is an issue saving data to the server.
 * @returns {void}
 */
    const saveDataToServer = async () => {
      try {
        console.log("player",player.name)
        if(player.name!==""){
          console.log("ok")
          if (player?.id) {
            // Player has an ID, update the existing player
            await fetch(`http://localhost:3001/players/${player.id}`, {
              method: 'PUT',
              body: JSON.stringify(player),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            });
          } 
      
          // Update operator data
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
  /**
 * Checks if a player with the given name exists in the database. If the player exists,
 * updates the state with the existing player's data; otherwise, creates a new player
 * with a random ID and initializes default attributes, sets the state to the new player,
 * and sends a POST request to the server to create the player.
 *
 * @returns {Promise<void>} - A Promise that resolves when the player data is updated or created.
 */
    const checkPlayerExists = async () => {
      try {
        const response = await fetch(`http://localhost:3001/players?name=${player.name}`);
        const playerData = await response.json();
  
        if (playerData.length > 0) {
          // Player exists
          setPlayer(playerData[0]); // Assuming the server returns an array
        } else {
          // Player doesn't exist, create a new player
          const newPlayer = {
            name: player.name,
            balance: 10000,
            tickets: [],
            totalWinnings: 0,
            id:Math.floor(Math.random() * 1000000),
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

/**
 * Generate an array of unique random numbers within a specified range.
 * @param {number} count - The number of random numbers to generate.
 * @returns {number[]} - An array containing unique random numbers.
 */
  const generateRandomNumbers = (count) => {
    const numbers = [];
    while (numbers.length < count) {
      const randomNum = Math.floor(Math.random() * 39) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    return numbers;
  };
/**
 * Buy tickets for the player and submit them to the operator for the upcoming draw.
 * @function
 * @throws {Alert} If there is insufficient balance or tickets have already been purchased for the draw.
 * @returns {void}
 */

  const buyTickets = () => {
    if(player.name!=""){
      if(canBuyTickets==false){
      
      }
      if (player.balance >= 500 * numTicketsToBuy && canBuyTickets) {
        const newTickets = Array.from({ length: numTicketsToBuy }, (_, index) => ({
          numbers: generateRandomNumbers(5),
          isPlayerTicket: true,
          id: player.tickets.length + index + 1, // Use a unique ID for each ticket
        }));
    
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          balance: prevPlayer.balance - 500 * numTicketsToBuy,
          tickets: [...prevPlayer.tickets, ...newTickets],
        }
        ));
        console.log(player)
        saveDataToServer()
        setOperator((prevOperator) => ({
          ...prevOperator,
          balance: prevOperator.balance + 500 * numTicketsToBuy,
          submittedTickets: [...prevOperator.submittedTickets, ...newTickets],
        }));
  
        setCanBuyTickets(false);
      } else {
        alert('tickets already purchased for this draw! or Insufficient balance to buy tickets ');
      }
    }else{
      alert("please enter your name")
    }
  };

/**
 * Start the draw process, compare player tickets with drawn numbers, and update results.
 * @function
 * @throws {Alert} If there are not enough tickets purchased before starting the draw.
 * @returns {void}
 */
  const startDraw = () => {
    if(canBuyTickets == false){
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
  
      player.tickets.slice(0, numTicketsToBuy).forEach((ticket) => {
        const hits = ticket.numbers.filter((num) => newDrawnNumbers.includes(num)).length;
        const prize = calculatePrize(hits);
  
        results[hits]++;
        results.totalPrize += prize.prize;
  
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          balance: prevPlayer.balance + prize.prize,
          totalWinnings: prevPlayer.totalWinnings + prize.prize,
        }));
  
        setOperator((prevOperator) => ({
          ...prevOperator,
          balance: prevOperator.balance + prize.operatorProfit - prize.prize,
        }));
      });
  
      results.operatorProfit = operator.balance - results.totalPrize;
      setRoundResults(results);
  
      setCanBuyTickets(true);
    }else{
      alert("please buy the ticket")
    }
  };

/**
 * Calculate the prize and operator profit based on the number of hits in the draw.
 * @param {number} hits - The number of hits in the draw.
 * @returns {Object} - An object containing the calculated prize and operator profit.
 */
  const calculatePrize = (hits) => {
    const prizeTable = {
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

  const updatePlayerName = (newName) => {
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
