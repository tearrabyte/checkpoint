/*
 * PROJECTS PAGE
 * Lists all Checkpoint projects and provides creation, searching and deletion of projects.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projectsApi } from "../api/checkpointApi";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ProjectFormModal } from "../components/ProjectFormModal";
import { EmptyState, SearchField, SkeletonBlock } from "../components/UI";
import type { Project } from "../types";

/*
 * PROJECTS PAGE
 * Loads the existing projects and provides access to creation and deletion of projects.
 */
export function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [formOpen, setFormOpen] = useState(false);
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
 * VISIBLE PROJECTS
 * Allows for searching applied in the browser
 */
const visible = useMemo(() => {
	const term = search.trim().toLowerCase();
	if (!term) return projects;

	return projects.filter(
		(p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
	);
}, [projects, search]);

async function handleDeleteOnConfirmed() {
	if (!deleteTarget) return;
	await projectsApi.remove(deleteTarget.id);
	setDeleteTarget(null);
	load();
}

return (
	<div>
		<div className="page-head">
			<div>
				<h1>Projects</h1>
				<p>Each project holds its own playtest sessions and feedback.</p>
			</div>				
			<button type="button" className="btn btn-primary" onClick={() => setFormOpen(true)}>
				New Project
			</button>
		</div>

		{projects.length > 0 && (
			<div className="toolbar">
				<SearchField
					value={search}
					onChange={setSearch}
					placeholder="Search projects by name or description"
					label="Search Projects"
				/>
				<span className="result-count" role="status">
					{visible.length === projects.length
						? `${projects.length} ${projects.length === 1 ? "project" : "projects"}`
						: `${visible.length} of ${projects.length} projects`}
				</span>
			</div>
		)}		

		{loading ? (
			<SkeletonBlock rows={4} />
		) : projects.length === 0 ? (
			<EmptyState title="No projects yet.">
				Create your first project to start recording playtest sessions and feedback.
			</EmptyState>
		) : visible.length === 0 ? (
			<EmptyState title="No projects match your search">
				Try a different name, or clear the search box.
			</EmptyState>
		) : (
			<div className="card-grid">
				{projects.map((p) => (
					<article className="card project-card" key={p.id}>
						<h3><Link to={`/projects/${p.id}`}>{p.name}</Link></h3>
						<p className="muted" style={{ fontSize: "0.88rem", lineHeight: 1.55 }}>
							{p.description || "No description provided."}
						</p>
						<div className="project-meta">
							<span>{p.sessionCount} {p.sessionCount === 1 ? "session" : "sessions"}</span>
						</div>
						<div className="card-actions">
							<Link className="btn btn-secondary btn-small" to={`/projects/${p.id}`}>Open</Link>
							<button 
								type="button"
								className="btn btn-danger btn-small" 
								onClick={() => setDeleteTarget(p)}
							>
								Delete
							</button>
						</div>
					</article>
				))}
			</div>
		)}

		<ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={load} />
		
		{/* Shared confirmation dialog for project deletion */}
		<ConfirmDialog
			open={deleteTarget !== null}
			title="Delete this project?"
			message={`"${deleteTarget?.name}" will be permanently deleted, along with all of its playtest sessions and feedback. This cannot be undone.`}
			onConfirm={handleDeleteOnConfirmed}
			onCancel={() => setDeleteTarget(null)}
			/>
		</div>
	);
}