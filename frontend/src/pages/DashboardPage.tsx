/*
 * DASHBOARD PAGE
 * Displays the main quality overview of Checkpoint.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../api/checkpointApi";
import { BarChart, DonutChart, LineChart } from "../components/Charts";
import type { ChartSlice } from "../components/Charts";
import { Badge } from "../components/Badge";
import { EmptyState, SkeletonBlock } from "../components/UI";
import type { DashboardSummary } from "../types";

/*
 * CHART COLOURS
 */
const CATEGORY_COLOURS: Record<string, string> = {
	Defect: "#FF6B81",
	Gameplay: "#A78BFA",
	Usability: "#FFB454",
	Balance: "#22D3EE",
	Accessibility: "#34D399",
	FeatureRequest: "#60A5FA",
};

const STATUS_COLOURS: Record<string, string> = {
	New: "#A78BFA",
	InProgress: "#FFB454",
	Resolved: "#34D399",
	Rejected: "#8FA0C0",
};

const PRIORITY_COLOURS: Record<string, string> = {
	Low: "#8FA0C0",
	Medium: "#60A5FA",
	High: "#FFB454",
	Critical: "#FF6B81",	
};

/* 
 * READABLE STRINGS 
 */
const READABLE: Record<string, string> = {
	InProgress: "In Progress",
	FeatureRequest: "Feature Request",
}

/*
 * TO CHART DATA
 * Converts dictionaries into chart slices and applies styling.
 */
function toChartData(data: Record<string, number>, colors: Record<string, string>, order?: string[]): ChartSlice[] {
	const keys = order ? order.filter((key) => key in data) : Object.keys(data);

	return keys.map((key) => ({
		label: READABLE[key] ?? key,
		value: data[key],
		color: colors[key] ?? "#8FA0C0",
	}));
}

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
	if (loading) return <SkeletonBlock rows={5} />;
	if (error) return <p className="error-text">Could not load dashboard: {error}</p>;
	if (!summary) return null;

	const categoryData = toChartData(summary.feedbackByCategory, CATEGORY_COLOURS, [
		"Defect", "Gameplay", "Usability", "Balance", "Accessibility", "FeatureRequest",
	]);

	const statusData = toChartData(summary.feedbackByStatus, STATUS_COLOURS, [
		"New", "InProgress", "Resolved", "Rejected",	
	]);

	const priorityData = toChartData(summary.feedbackByPriority, PRIORITY_COLOURS, [
		"Low", "Medium", "High", "Critical",
	]);

	const statusTotal = statusData.reduce((sum, slice) => sum + slice.value, 0);
	const hasFeedback = summary.totalFeedbackItems > 0;

	return (
		<div>
			<div className="page-head">
				<div>
					<h1>Quality Overview</h1>
					<p>Everything reported across your projects, in one place.</p>
				</div>
			</div>
			
			{/* Overall build health */}
			<div className="pulse">
				<div>
					<p className="pulse-eyebrow">Needs attention now</p>
					<div className="pulse-figure">
						<span className="pulse-number">{summary.openCriticalOrHighCount}</span>
						<span className="pulse-unit">
							open high &amp; critical {summary.openCriticalOrHighCount === 1 ? "issue" : "issues"}
						</span>
					</div>
					<p className="pulse-note">
						Across {summary.totalProjects} {summary.totalProjects === 1 ? "project" : "projects"} and {" "}
						{summary.totalPlaytestSessions} playtest {summary.totalPlaytestSessions === 1 ? "session" : "sessions"}.
					</p>
				</div>

				{/* Status split */}
				<div className="pulse-meter">
					{statusData.map((slice) => (
						<div className="meter-row" key={slice.label}>
							<span>{slice.label}</span>
							<span className="meter-track">
								<span
									className="meter-fill"
									style={{
										width: `${statusTotal > 0 ? (slice.value / statusTotal) * 100: 0}%`,
										background: slice.color,
									}}
								/>
							</span>
							<span className="meter-num">{slice.value}</span>
						</div>
					))}
				</div>
			</div>

			{/* Main dashboard statistics */}
			<div className="stat-cards">
				<StatCard label="Projects" value={summary.totalProjects} />
				<StatCard label="Playtest Sessions" value={summary.totalPlaytestSessions} />
				<StatCard label="Feedback Items" value={summary.totalFeedbackItems} />
				<StatCard label="Defects Reported" value={summary.feedbackByCategory.Defect ?? 0} highlight />
			</div>

			{/* Feedback breakdowns by category, status and priority. */}
			{hasFeedback ? (
				<div className="chart-grid">
					<div className="chart-card">
						<h3>Feedback by Category</h3>
						<DonutChart data={categoryData} total={summary.totalFeedbackItems} />
					</div>

					<div className="chart-card">
						<h3>Feedback by Priority</h3>
						<BarChart data={priorityData} />
					</div>

					<div className="chart-card" style={{ gridColumn: "1 / -1" }}>
						<h3>Playtest Sessions Over Time</h3>
						<LineChart data={summary.sessionsPerMonth.map((p) => ({ label: p.label, value: p.count }))} />
					</div>
				</div>
			) : (
				<EmptyState title="No feedback recorded yet.">
					Charts appear here once playtesters start submitting feedback.
				</EmptyState>
			)}

			{/* Recent playtest sessions */}
			<h2>Recent Playtest Sessions</h2>
			{summary.recentPlaytestSessions.length === 0 ? (
				<EmptyState title="No playtest sessions recorded yet.">
					Create a project, then add a playtest session to start collecting feedback.
				</EmptyState>
			) : (
				<div className="table-scroll">
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
									<td><Badge kind="status" value={s.status} /></td>
									<td>{s.feedbackCount}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

/* 
 * STAT CARD
 * Displays one of the supporting dashboard counts.
 */
function StatCard({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) {
	return (
		<div className={`stat-card ${highlight ? "stat-card-highlight" : ""}`}>
			<div className="stat-value">{value}</div>
			<div className="stat-label">{label}</div>
		</div>
	);
}