/*
 * DASHBOARD PAGE
 * Displays the main quality overview of Checkpoint.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../api/checkpointApi";
import type { DashboardSummary } from "../types";

/*
 * DASHBOARD PAGE
 * Fetches the current dashboard summary when the page loads.
 */
export function DashboardPage() {
	const [summary, setSummary] = useState<DashboardSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/*
	 * LOAD DASHBOARD
	 * Request the current dashboard summary from Checkpoint's backend.
	 */
	useEffect(() => {
		dashboardApi
			.getSummary()
			.then(setSummary)
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, []);

	/* 
	 * LOADING AND ERROR STATES
	 * Displays feedback while the dashboard data is being retrieved.
	 */
	if (loading) return <p>Loading overview...</p>;
	if (error) return <p className="error-text">Could not load dashboard: {error}</p>;
	if (!summary) return null;

	return (
		<div>
			<h1>Quality Overview</h1>
			
			{/* Main dashboard statistics */}
			<div className="stat-cards">
				<StatCard label="Projects" value={summary.totalProjects} />
				<StatCard label="Playtest Sessions" value={summary.totalPlaytestSessions} />
				<StatCard label="Feedback Items" value={summary.totalFeedbackItems} />
				<StatCard label="Open High/Critical Issues" value={summary.openCriticalOrHighCount} highlight />
			</div>

			{/* Feedback breakdowns by category, status and priority. */}
			<div className="breakdown-grid">
				<BreakdownCard title="By Category" data={summary.feedbackByCategory} />
				<BreakdownCard title="By Status" data={summary.feedbackByStatus} />
				<BreakdownCard title="By Priority" data={summary.feedbackByPriority} />
			</div>

			{/* Recent playtest sessions */}
			<h2>Recent Playtest Sessions</h2>
			{summary.recentPlaytestSessions.length === 0 ? (
				<p className="empty-state">No playtest sessions recorded yet.</p>
			) : (
				<table className="data-table">
					<thead>
						<tr>
							<th>Session</th><th>Project</th><th>Date</th><th>Status</th><th>Feedback</th>
						</tr>
					</thead>
					<tbody>
						{summary.recentPlaytestSessions.map((s) => (
							<tr key={s.id}>
								<td><Link to={`/projects/${s.projectId}/sessions/${s.id}`}>{s.name}</Link></td>
								<td>{s.projectName}</td>
								<td>{new Date(s.sessionDate).toLocaleDateString()}</td>
								<td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
								<td>{s.feedbackCount}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

/* 
 * STAT CARD
 * Displays one of the main dashboard statistics.
 */
function StatCard({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) {
	return (
		<div className={`stat-card ${highlight ? "stat-card-highlight" : ""}`}>
			<div className="stat-value">{value}</div>
			<div className="stat-label">{label}</div>
		</div>
	);
}

/* 
 * BREAKDOWN CARD
 * Displays a list of feedback counts grouped by category, status or priority.
 */
function BreakdownCard({ title, data }: { title: string, data: Record<string, number> }) {
	const entries = Object.entries(data);

	return (
		<div className="breakdown-card">
			<h3>{title}</h3>
			{entries.length === 0 ? (
				<p className="empty-state">No data yet.</p>
			) : (
				<ul>
					{entries.map(([key, count]) => (
						<li key={key}><span>{key}</span><span className="count">{count}</span></li>
					))}
				</ul>
			)}
		</div>
	);
}