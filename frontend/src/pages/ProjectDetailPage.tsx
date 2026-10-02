/*
 * PROJECT DETAIL PAGE
 * Displays a project's details and allows a project to be edited.
 * Also allows for management of the playtest sessions within the project.
*/

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectsApi, sessionsApi } from "../api/checkpointApi";
import { Badge } from "../components/Badge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ProjectFormModal } from "../components/ProjectFormModal";
import { SessionFormModal } from "../components/SessionFormModal";
import { EmptyState, SkeletonBlock } from "../components/Ui";
import type { PlaytestSession, Project } from "../types";

/*
 * EMPTY SESSION FORM
 * The initial values used when creating a new playtest session.
*/
const emptySessionForm = { name: "", sessionDate: "", gameVersion: "", notes: "" };

/*
 * PROJECT DETAIL PAGE
 * Loads the selected project and its associated playtest sessions using project ID.
*/
export function ProjectDetailPage() {
	const { projectId } = useParams();
	const id = Number(projectId);

	const [project, setProject] = useState<Project | null>(null);
	const [sessions, setSessions] = useState<PlaytestSession[]>([]);
	const [loading, setLoading] = useState(true);

	const [editingProject, setEditingProject] = useState(false);

	const [sessionFormOpen, setSessionFormOpen] = useState(false);
	const [editingSession, setEditingSession] = useState<PlaytestSession | null>(null);
	
	const [deleteTarget, setDeleteTarget] = useState<PlaytestSession | null>(null);

	/*
	 * LOAD PROJECT / SESSIONS
	 * Retrieves the project details and playtest sessions from the backend.
	*/
	function loadAll() {
		setLoading(true);

		Promise.all([projectsApi.getById(id), sessionsApi.getAll(id)])
			.then(([loadedProject, loadedSessions]) => {
			setProject(loadedProject);
			setSessions(loadedSessions);
		})
		.finally(() => setLoading(false));
	}

	/*
	 * INITIAL DATA LOAD
	 */
	useEffect(loadAll, [id]);

	/*
	 * OPEN, EDIT AND DELETE PLAYTEST SESSION
 	 */
	function openNewSession() {
		setEditingSession(null);
		setSessionFormOpen(true);
	}

	function openEditSession(session: PlaytestSession) {
		setEditingSession(session);
		setSessionFormOpen(true);
	}

	async function handleDeleteSession() {
		if (!deleteTarget) return;
		await sessionsApi.remove(id, deleteTarget.id);
		setDeleteTarget(null);
		loadAll();
	}

	if (loading) return <SkeletonBlock rows={5} />;
	if (!project) return <p className="error-text">This project could not be found.</p>

	return (
		<div>
			<Link to="/projects" className="back-link">&larr; All Projects</Link>

			<div className="card-panel">
				<div className="detail-header">
					<div>
						<h1>{project.name}</h1>
						<p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.92rem", maxWidth: "60ch" }}>
							{project.description || "No description provided."}
						</p>						
					</div>
					<button type="button" className="btn btn-secondary" onClick={() => setEditingProject(true)}>
						Edit Project
					</button>
				</div>
			</div>
			
			<div className="page-head">
				<div>
					<h2 style={{ marginBottom: 0 }}>Playtest Sessions</h2>
					<p>Each session groups the feedback from one round of testing.</p>
				</div>
				<button type="button" className="btn btn-primary" onClick={openNewSession}>
					New Session
				</button>
			</div>

			{sessions.length === 0 ? (
				<EmptyState title="No sessions yet for this project.">
					Create a playtest session to start collecting structured feedback.
				</EmptyState>
			) : (
				<div className="table-scroll">
					<table className="data-table">
						<thead>
							<tr>
								<th>Name</th><th>Date</th><th>Version</th><th>Status</th><th>Feedback</th>
								<th><span className="visually-hidden">Actions</span></th>
							</tr>
						</thead>
						<tbody>
							{sessions.map((s) => (
								<tr key={s.id}>
									<td><Link to={`/projects/${id}/sessions/${s.id}`}>{s.name}</Link></td>
									<td>{new Date(s.sessionDate).toLocaleDateString()}</td>
									<td className="mono">{s.gameVersion}</td>
									<td><Badge kind="status" value={s.status} /></td>
									<td>{s.feedbackCount}</td>
									<td>
										<div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
											<button
												type="button"
												className="btn btn-secondary btn-small"
												onClick={() => openEditSession(s)}
											>
												Edit
											</button>
											<button
												type="button"
												className="btn btn-danger btn-small"
												onClick={() => setDeleteTarget(s)}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<ProjectFormModal
				open={editingProject}
				project={project}
				onClose={() => setEditingProject(false)}
				onSaved={loadAll}
			/>

			<SessionFormModal
				open={sessionFormOpen}
				projectId={id}
				session={editingSession}
				onClose={() => setSessionFormOpen(false)}
				onSaved={loadAll}
			/>

			<ConfirmDialog
				open={deleteTarget !== null}
				title="Delete this playtest session?"
				message={`"${deleteTarget?.name}" and all feedback submitted against it will be permanently deleted. This cannot be undone.`}
				onConfirm={handleDeleteSession}
				onCancel={() => setDeleteTarget(null)}
			/>
		</div>
	);
}