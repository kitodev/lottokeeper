/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <React.Suspense fallback="loading">
                <App />
            </React.Suspense>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
