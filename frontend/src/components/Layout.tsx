/*
 * APPLICATION LAYOUT
 * Provides the shared page structure and navigation used across the frontend of Checkpoint.
 */

 import { NavLink, Outlet } from "react-router-dom";

 /*
  * APPLICATION LAYOUT
  * Displays the Checkpoint header and navigation.
  * Renders the selected page inside the shared content area.
  */
export function Layout() {
	return (
		<div className="app-shell">
			<header className="app-header">
				<div className="brand">Checkpoint</div>
				<nav>
					<NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
						Dashboard
					</NavLink>
					<NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
						Projects
					</NavLink>
					<NavLink to="/feedback" className={({ isActive }) => (isActive ? "active" : "")}>
						All Feedback
					</NavLink>
				</nav>
			</header>
			<main className="app-content">
				<Outlet />
			</main>
		</div>
	);
}