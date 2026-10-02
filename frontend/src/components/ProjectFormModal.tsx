/*
 * PROJECT FORM MODAL
 * Handles creation and editing of projects within a dialog.
 */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { projectsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { FieldError } from "./FieldError";
import { Modal } from "./Modal";
import type { Project } from "../types";

/*
 * EMPTY PROJECT FORM
 * The initial values used when creating a new project.
 */
const EMPTY_FORM = { 
	name: "",
	description: "",
};

 /*
  * PROJECT MODAL PROPS
  * Defines the values and callback functions required by the project modal.
  */
 interface ProjectFormModalProps {
	open: boolean;
	project?: Project | null;
	onClose: () => void;
	onSaved: () => void;
 }

 /*
 * PROJECT FORM MODAL
 */
export function ProjectFormModal({ open, project, onClose, onSaved }: ProjectFormModalProps) {
	const [form, setForm] = useState(EMPTY_FORM);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();
	const [saving, setSaving] = useState(false);

	const isEditing = Boolean(project);

	/*
	 * LOAD EXISTING
	 * Utilised to load the form with a project's current values when editing, otherwise, load empty form.
	 */
	useEffect(() => {
		if (!open) return;

		setForm(project ? { name: project.name, description: project.description } : EMPTY_FORM);
		setFieldErrors(undefined);
	}, [open, project]);

	const invalid = (field: string) => (fieldErrors?.[field] ? "input-invalid" : "");

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setFieldErrors(undefined);
		setSaving(true);

		try {
			if (project) {
				await projectsApi.update(project.id, form);
			} else {
				await projectsApi.create(form);
			}

			onSaved();
			onClose();
		} catch (err) {
			if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
		} finally {
			setSaving(false);
		}
	}

	return (
		<Modal
			open={open}
			title={isEditing ? "Edit Project" : "New Project"}
			description={
				isEditing
					? "Update the project name or description."
					: "A project holds the playtest sessions and feedback for a game."
			}
			onClose={onClose}
			footer={
				<>
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" form="project-form" className="btn btn-primary" disabled={saving}>
						{saving ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
					</button>
				</>
			}
		>
			<form id="project-form" className="form-card" onSubmit={handleSubmit}>
				<label>
					Project Name
					<input
						className={invalid("Name")}
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						placeholder="e.g. Orbital Drift"
					/>
					<FieldError errors={fieldErrors} field="Name" />
				</label>

				<label>
					Description
					<textarea
						className={invalid("Description")}
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						placeholder="A short summary of the game."
					/>
					<FieldError errors={fieldErrors} field="Description" />
				</label>
			</form>
		</Modal>
	);
}