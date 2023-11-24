# Getting Started with Create React App

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `Starting the JSON Server`

Open another terminal window (keep the React app terminal running).

Navigate to the root directory of the project.

Run the following command to start the JSON server:json-server --watch db.json --port 3001

# Lottery Game

Welcome to the Lottery Game, a simple web-based application where you can participate in a lottery draw, buy tickets, and try your luck to win prizes!

## How to Play

1. **Getting Started:**
   - Upon opening the game, you are greeted with a default player profile.
   - You have an initial balance of 10,000 coins.

2. **Buying Tickets:**
   - To participate in the draw, you can buy tickets by clicking the "Buy Tickets" button.
   - Each ticket costs 500 coins.
   - You can specify the number of tickets you want to buy by entering the desired quantity.
   - Alert: If you attempt to buy tickets without sufficient balance or if tickets have already been purchased for the ongoing draw, an alert will notify you.

3. **Start Draw:**
   - Once you have purchased your tickets, you can click the "Start Draw" button to initiate the lottery draw.
   - Alert: If you attempt to start the draw without buying enough tickets, an alert will prompt you to purchase more tickets.

4. **Draw Results:**
   - After starting the draw, the game will generate five random numbers as the winning draw.
   - Your tickets are compared with the drawn numbers, and the results are displayed.
   - The results include the number of hits for 5, 4, 3, and 2 correct numbers, as well as the total prize and operator profit.

5. **Prizes and Operator Profit:**
   - The prize for hitting 2, 3, 4, or 5 numbers is determined based on a predefined prize table.
   - If you do not win any amount, the total ticket price contributes to the operator's balance.
   - Operator profit is calculated as a percentage of the total prize.
   - The operator's profit percentage is set at 10%.

6. **Balance Update:**
   - Your account balance is updated based on the prizes you win.
   - If you do not win any amount, the total ticket price is added to the operator's balance.
   - The operator's balance is adjusted to reflect the operator's profit.

7. **Resetting the Game:**
   - You can reset the game at any time by clicking the "Reset Game" button.
   - This action restores the initial player and operator states.

8. # Operator Dashboard

The Operator Dashboard is a web application designed for operators to manage and view details of players participating in the lottery game. The dashboard provides insights into player information, purchased tickets, and winning amounts.

## Features

- View a list of players along with their details.
- Access information on each player's balance, total winnings, and purchased tickets.
- Monitor the submitted tickets by players for each draw.
- Track the winning amounts for each player based on the draw results.

## Components

The game consists of two main components:

- **Player Component:**
  - Displays the player's name, balance, winning amount, and allows purchasing tickets.
  - Shows the player's tickets in a table format.

- **Operator Component:**
  - Displays the operator's balance.
  - Initiates the draw, shows drawn numbers, and presents round results.

## Development

- The game is built using React.js.
- State management is handled using React hooks (useState and useEffect).
- Data is fetched and saved to a fake API endpoint.
- Random numbers are generated for the draw.
- Prize calculation and balance updates are based on predefined rules.

Feel free to explore, enjoy the game, and good luck with your lottery draws!
