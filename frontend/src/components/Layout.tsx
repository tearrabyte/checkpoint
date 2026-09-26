/*
 * APPLICATION LAYOUT
 * Provides the shared page structure and navigation used across the frontend of Checkpoint.
 */

 import { NavLink, Outlet } from "react-router-dom";

 /* 
  * BRAND MARK
  * Draws an inline Checkpoint logo mark for visual identity.
  */
 function BrandMark() {
	return (
		<span className="brand-mark" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
				<path d="M20 6 9 17l-5-5" />
			</svg>
		</span>
	);
 }

 /*
  * APPLICATION LAYOUT
  * Displays the Checkpoint header and navigation.
  * Renders the selected page inside the shared content area.
  */
export function Layout() {
	return (
		<div className="app-shell">
			{/* Lets keyboard users jump straight to the page content as an accessibility feature. */}
			<a className="visually-hidden" href="#main">Skip to content</a>

			<header className="app-header">
				<div className="brand">
					<BrandMark />
					Checkpoint
				</div>

				<nav aria-label="Main">
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

			<main className="app-content" id="main">
				<Outlet />
			</main>
		</div>
	);
}