/*
 * PROJECTS PAGE
 * Displays all Checkpoint projects and enables creation and deletion of projects.
 */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { projectsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldError } from "../components/FieldError";
import type { Project } from "../types";

/*
 * EMPTY PROJECT FORM
 * Provides the initial values to create a new project.
*/
const emptyForm = { name: "", description: "", };

/*
 * PROJECTS PAGE
 * Loads the existing projects and provides access to creation and deletion of projects.
 */
export function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState(emptyForm);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();
	const [submitting, setSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

/*
 * LOAD PROJECTS
 * Retrieves the current list of projects from Checkpoint's backend.
 */
function load() {
	setLoading(true);
	projectsApi.getAll().then(setProjects).finally(() => setLoading(false));
}

useEffect(load, []);

/*
 * CREATE PROJECT
 * Submits the project form to the backend and reloads the project list.
 */
async function handleCreate(e: FormEvent) {
	e.preventDefault();
	setFieldErrors(undefined);
	setSubmitting(true);
	try {
		await projectsApi.create(form);
		setForm(emptyForm);
		load();
	} catch (err) {
		if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
	} finally {
		setSubmitting(false);
	}
}

/*
 * DELETE PROJECT
 * Deletes the project in the confirmation dialog and returns the project list.
 */
async function handleDeleteOnConfirmed() {
	if (!deleteTarget) return;
	await projectsApi.remove(deleteTarget.id);
	setDeleteTarget(null);
	load();
}

return (
	<div>
		<h1>Projects</h1>

		{/* Project creation form */}
		<form className="card form-card" onSubmit={handleCreate}>
			<h2>New Project</h2>
			<label>
				Project name
				<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bamboozled!" />
				<FieldError errors={fieldErrors} field="Name" />
			</label>
			<label>
				Description
				<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value})} placeholder="A short summary of the game." />
				<FieldError errors={fieldErrors} field="Description" />
			</label>
			<button className="btn btn-primary" type="submit" disabled={submitting}>
				{submitting ? "Creating..." : "Create Project"}
			</button>
		</form>

		<h2>Existing Projects</h2>
		{loading ? (
			<p> Loading...</p>
		) : projects.length === 0 ? (
			<p className="empty-state">No projects yet. Create your first one above.</p>
		) : (
			<div className="card-grid">
				{projects.map((p) => (
					<div className="card project-card" key={p.id}>
						<h3><Link to={`/projects/${p.id}`}>{p.name}</Link></h3>
						<p className="muted">{p.description || "No description provided."}</p>
						<span className="muted">{p.sessionCount} session{p.sessionCount === 1 ? "" : "s"}</span>
						<div className="card-actions">
							<Link className="btn btn-secondary" to={`/projects/${p.id}`}>Open</Link>
							<button className="btn btn-danger" onClick={() => setDeleteTarget(p)}>Delete</button>
						</div>
					</div>
				))}
			</div>
		)}

		{/* Shared confirmation dialog for project deletion */}
		<ConfirmDialog
			open={deleteTarget !== null}
			title="Delete the project?"
			message={`This will permanently delete "${deleteTarget?.name}" and all of its playtest sessions and feedback. This cannot be undone`}
			onConfirm={handleDeleteOnConfirmed}
			onCancel={() => setDeleteTarget(null)}
			/>
		</div>
	);
}