/*
 * APPLICATION ENTRY POINT
 * Starts the React application and provides global configuration for frontend.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/*
 * REACT APPLICATION
 * Renders the application.
 * BrowserRouter provides client-side routing for the application.
 * StrictMode helps identify potential problems during development.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);