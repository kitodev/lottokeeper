import React, { useState, useEffect } from 'react';
import './sass/OperatorDashboard.scss';
import { api } from "./Api";
import { Link } from 'react-router-dom';

interface Player {
  id: number;
  name: string;
  balance: number;
  totalWinnings: number;
  tickets: Ticket[];
}

interface Ticket {
  id: number;
  numbers: number[];
}

const OperatorDashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    try {
      const response = await fetch(`${api}/players`);
      const playersData: Player[] = await response.json();
      setPlayers(playersData || []);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="operator-dashboard">
      <h1>Operator Dashboard</h1>
      <div>
        <Link to="/">
          <button>Go To Home Page</button>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Total Winnings</th>
            <th>Tickets</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.balance}</td>
              <td>{player.totalWinnings}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Numbers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player.tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.numbers.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorDashboard;
