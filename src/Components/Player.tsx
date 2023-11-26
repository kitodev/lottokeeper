import React from 'react';
import './sass/Player.scss';

interface Ticket {
  id: number;
  numbers: number[];
  isPlayerTicket: boolean;
}

interface PlayerProps {
  player: {
    name: string;
    balance: number;
    totalWinnings: number;
    tickets: Ticket[];
  };
  updateName: (newName: string) => void;
  numTicketsToBuy: number;
  setNumTicketsToBuy: (numTickets: number) => void;
  buyTickets: () => void;
  checkPlayerExists: () => void;
}

const Player: React.FC<PlayerProps> = ({ player, updateName, numTicketsToBuy, setNumTicketsToBuy, buyTickets, checkPlayerExists }) => {
  return (
    <div className="player-container">
      <div className="player-input">
        <h2>Player</h2>
        <p>Name: {player.name}</p>
        <label>
          Name:
          <input type="text" value={player.name} onChange={(e) => updateName(e.target.value)} />
        </label>
        <label>
          <button onClick={checkPlayerExists}>Enter</button>
        </label>
      </div>
      <div className="balance">
          <p>Balance: {player.balance} coins</p>
          <p>Winning Amount: {player.totalWinnings} coins</p>
        <label>
          Number of Tickets to Buy:
          <input
            type="number"
            value={numTicketsToBuy}
            onChange={(e) => setNumTicketsToBuy(Number(e.target.value))}
          />
        </label>
        <button onClick={buyTickets}>Buy Tickets</button>
      </div>
      <h3>Your Tickets</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Numbers</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {player.tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.numbers.join(', ')}</td>
              <td>{ticket.isPlayerTicket ? 'Player' : 'Generated'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Player;
