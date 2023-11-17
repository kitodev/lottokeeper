import React, { useState, useEffect } from 'react';
import './css/OperatorDashboard.css'; // Import your CSS file

const OperatorDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    try {
      const response = await fetch('http://localhost:3001/players');
      const playersData = await response.json();
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
