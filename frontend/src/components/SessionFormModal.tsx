/*
 * PLAYTEST SESSION FORM MODAL
 * Handles creation and editing of playtest sessions within a dialog.
 */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { sessionsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { FieldError } from "./FieldError";
import { Modal } from "./Modal";
import { SESSION_STATUSES, type PlaytestSession, type SessionStatus } from "../types";

/*
 * EMPTY PLAYTEST SESSION FORM
 * The initial values used when submitting a new session.
 */
const EMPTY_FORM = { 
	name: "",
	sessionDate: "",
	gameVersion: "",
	notes: "",
	status: "Planned" as SessionStatus,
};

/* 
 * READABLE STRINGS 
 */
const READABLE: Record<string, string> = { InProgress: "In Progress" };

 /*
  * PLAYTEST SESSION MODAL PROPS
  * Defines the values and callback functions required by the session modal.
  */
 interface SessionFormModalProps {
	open: boolean;
	projectId: number;
	session?: PlaytestSession | null;
	onClose: () => void;
	onSaved: () => void;
 }


 /*
 * PLAYTEST SESSION FORM MODAL
 */
export function SessionFormModal({ open, projectId, session, onClose, onSaved }: SessionFormModalProps) {
	const [form, setForm] = useState(EMPTY_FORM);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();
	const [formError, setFormError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const isEditing = Boolean(session);

	/*
	 * LOAD EXISTING
	 * Utilised to load the form with a session's current values when editing, otherwise, load empty form.
	 */
	useEffect(() => {
		if (!open) return;

		if (session) {
			setForm({
				name: session.name,
				sessionDate: session.sessionDate.slice(0, 10),
				gameVersion: session.gameVersion,
				notes: session.notes,
				status: session.status,
			});
		} else {
			setForm(EMPTY_FORM);
		}

		setFieldErrors(undefined);
		setFormError(null);
	}, [open, session]);

	const invalid = (field: string) => (fieldErrors?.[field] ? "input-invalid" : "");

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setFieldErrors(undefined);
		setFormError(null);
		setSaving(true);

		try {
			if (session) {
				await sessionsApi.update(projectId, session.id, form);
			} else {
				const { status, ...createInput } = form;
				await sessionsApi.create(projectId, createInput);
			}

			onSaved();
			onClose();
		} catch (err) {
			if (err instanceof ApiError && err.fieldErrors) {
				setFieldErrors(err.fieldErrors);
			} else if (err instanceof ApiError) {
				setFormError(err.message);
			} else {
				setFormError("An unexpected error occurred. Please try again.");
			}
		} finally {
			setSaving(false);
		}
	}

	return (
		<Modal
			open={open}
			title={isEditing ? "Edit Playtest Session" : "New Playtest Session"}
			description={
				isEditing
					? "Update the session details or move it through its lifecycle."
					: "Sessions group the feedback collected from one round of playtesting."
			}
			onClose={onClose}
			footer={
				<>
					<button type="button" className="btn btn-secondary" disabled={saving} onClick={onClose}>
						Cancel
					</button>
					<button type="submit" form="session-form" className="btn btn-primary" disabled={saving}>
						{saving ? "Saving..." : isEditing ? "Save Changes" : "Create Session"}
					</button>
				</>
			}
		>
			<form id="session-form" className="form-card" onSubmit={handleSubmit}>
				{formError && (
					<div className="form-alert" role="alert">
						<span>{formError}</span>
					</div>
				)}
				
				<label>
					Session Name
					<input
						className={invalid("Name")}
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						placeholder="e.g. Closed alpha — session 3"
					/>
					<FieldError errors={fieldErrors} field="Name" />
				</label>

				<div className="form-row">
					<label>
						Date
						<input
							type="date"
							className={invalid("SessionDate")}
							value={form.sessionDate}
							onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
						/>
						<FieldError errors={fieldErrors} field="SessionDate" />
					</label>

					<label>
						Game version
						<input
							className={invalid("GameVersion")}
							value={form.gameVersion}
							onChange={(e) => setForm({ ...form, gameVersion: e.target.value })}
							placeholder="e.g. 0.4.2-alpha"
						/>
						<FieldError errors={fieldErrors} field="GameVersion" />
					</label>
				</div>

				{/* Allows editing of status only for sessions that already exist. */}
				{isEditing && (
					<label>
						Status
						<select
							value={form.status}
							onChange={(e) => setForm({ ...form, status: e.target.value as SessionStatus })}
						>
							{SESSION_STATUSES.map((s) => (
								<option key={s} value={s}>{READABLE[s] ?? s}</option>
							))}
						</select>
					</label>
				)}

				<label>
					Notes
					<textarea
						value={form.notes}
						onChange={(e) => setForm({ ...form, notes: e.target.value })}
						placeholder="What should testers focus on this session?"
					/>
				</label>
			</form>
		</Modal>
	);
}