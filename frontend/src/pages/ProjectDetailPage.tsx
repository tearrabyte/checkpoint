/*
 * PROJECT DETAIL PAGE
 * Displays a project's details and allows a project to be edited.
 * Also allows for management of the playtest sessions within the project.
*/

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { projectsApi, sessionsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldError } from "../components/FieldError";
import type { PlaytestSession, Project } from "../types";

/*
 * EMPTY SESSION FORM
 * The iitial values used when creating a new playtest session.
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
	const [editForm, setEditForm] = useState({ name: "", description: "" });
	const [editErrors, setEditErrors] = useState<Record<string, string[]>>();
	const [editing, setEditing] = useState(false);

	const [sessions, setSessions] = useState<PlaytestSession[]>([]);
	const [sessionForm, setSessionForm] = useState(emptySessionForm);
	const [sessionErrors, setSessionErrors] = useState<Record<string, string[]>>();
	const [deleteTarget, setDeleteTarget] = useState<PlaytestSession | null>(null);

	/*
	 * LOAD PROJECT / SESSIONS
	 * Retrieves the project details and playtest sessions from the backend.
	*/
	function loadAll() {
		projectsApi.getById(id).then((p) => {
			setProject(p);
			setEditForm({ name: p.name, description: p.description });
		});
		sessionsApi.getAll(id).then(setSessions);
	}

	/*
	 * INITIAL DATA LOAD
	 */
	useEffect(loadAll, [id]);

	/*
	 * SAVE PROJECT
	 * Updates the current project's name and description.
	*/
	async function handleSaveProject(e: FormEvent) {
		e.preventDefault();
		setEditErrors(undefined);
		try {
			const updated = await projectsApi.update(id, editForm);
			setProject(updated);
			setEditing(false);
		} catch (err) {
			if (err instanceof ApiError) setEditErrors(err.fieldErrors);
		}
	}

	/*
	 * CREATE PLAYTEST SESSION
	 * Creates a new playtest session under the current project and reloads.
	*/
	async function handleCreateSession(e: FormEvent) {
		e.preventDefault();
		setSessionErrors(undefined);
		try {
			await sessionsApi.create(id, sessionForm);
			setSessionForm(emptySessionForm);
			loadAll();
		} catch (err) {
			if (err instanceof ApiError) setSessionErrors(err.fieldErrors);
		}
	}

	/*
	 * DELETE PLAYTEST SESSION
	 * Deletes the session selected in the confirmation dialog and reloads.
	*/
	async function handleDeleteSession() {
		if (!deleteTarget) return;
		await sessionsApi.remove(id, deleteTarget.id);
		setDeleteTarget(null);
		loadAll();
	}

	if (!project) return <p>Loading...</p>

	return (
		<div>
			<Link to="/projects" className="back-link">&larr; All projects</Link>

			{/* Project details and edit form */}
			<div className="card">
				{editing ? (
					<form onSubmit={handleSaveProject}>
						<h2>Edit Project</h2>
						<label>
							Name
							<input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
							<FieldError errors={editErrors} field="Name" />
						</label>
						<label>
							Description
							<textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value})} />
							<FieldError errors={editErrors} field="Description" />
						</label>
						<div className="card-actions">
							<button className="btn btn-primary" type="submit">Save</button>
							<button className="btn btn-secondary" type="button" onClick={() => setEditing(false)}>Cancel</button>
						</div>
					</form>
				) : (
					<div className="detail-header">
						<div>
							<h1>{project.name}</h1>
							<p className="muted">{project.description || "No description provided."}</p>
						</div>
						<button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Project</button>
					</div>
				)}
			</div>
			
			{/* New playtest session form */}
			<form className="card form-card" onSubmit={handleCreateSession}>
				<h2>New Playtest Session</h2>
				<label>
					Session name
					<input value={sessionForm.name} onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })} placeholder="e.g. Closed alpha - Session 2" />
					<FieldError errors={sessionErrors} field="Name" />
				</label>
				<label>
					Date
					<input type="date" value={sessionForm.sessionDate} onChange={(e) => setSessionForm({ ...sessionForm, sessionDate: e.target.value })} />
					<FieldError errors={sessionErrors} field="SessionDate" />
				</label>
				<label>
					Game version
					<input value={sessionForm.gameVersion} onChange={(e) => setSessionForm({ ...sessionForm, gameVersion: e.target.value })} placeholder="e.g. 0.4.2-alpha" />
					<FieldError errors={sessionErrors} field="GameVersion" />
				</label>
				<label>
					Notes
					<textarea value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} placeholder="e.g. What should testers focus on this session?"/>
				</label>
				<button className="btn btn-primary" type="submit">Create Session</button>
			</form>

		    {/* Existing playtest sessions */}
			<h2>Playtest Sessions</h2>
			{sessions.length === 0 ? (
				<p className="empty-state">No sessions yet for this project.</p>
			) : (
				<table className="data-table">
					<thead>
						<tr><th>Name</th><th>Date</th><th>Version</th><th>Status</th><th>Feedback</th><th></th></tr>
					</thead>
					<tbody>
						{sessions.map((s) => (
							<tr key={s.id}>
								<td><Link to={`/projects/${id}/sessions/${s.id}`}>{s.name}</Link></td>
								<td>{new Date(s.sessionDate).toLocaleDateString()}</td>
								<td>{s.gameVersion}</td>
								<td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
								<td>{s.feedbackCount}</td>
								<td><button className="btn btn-danger btn-small" onClick={() => setDeleteTarget(s)}>Delete</button></td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			
			{/* Shared confirmation dialog for session deletion */}
			<ConfirmDialog
				open={deleteTarget !== null}
				title="Delete playtest session?"
				message={`This will permanently delete "${deleteTarget?.name}" and all feedback associated with it. This action cannot be undone.`}
				onConfirm={handleDeleteSession}
				onCancel={() => setDeleteTarget(null)}
			/>
		</div>
	);
}