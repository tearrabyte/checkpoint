/*
 * FIELD ERROR
 * Displays validation messages for specific form fields.
 */

/*
 * FIELD ERROR PROPS
 * Defines the validation errors and field name used by the component.
 */
interface FieldErrorProps {
	errors?: Record<string, string[]>;
	field: string;
}

/*
 * FIELD ERROR
 * Displays messages for a specific field from the ASP.NET Core validation response.
 */
export function FieldError({ errors, field }: FieldErrorProps) {
	const messages = errors?.[field];
	if (!messages || messages.length === 0) return null;

	return (
		<div className="field-error">
			{messages.map((message, index) => (
				<div key={index}>{message}</div>
			))}
		</div>
	);
}