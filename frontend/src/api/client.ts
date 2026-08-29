/*
 * API CLIENT
 * Provides the shared HTTP client used by the React frontend to communicate with the Checkpoint ASP.NET Core Api.
 */

/* 
 * API BASE URL
 * Uses a relative "/api" path.
 */
const BASE_URL = "/api";

/*
 * API ERROR
 * Represents an error returned from the API.
 */
export class ApiError extends Error {
	status: number;
	fieldErrors?: Record<string, string[]>;

	constructor(message: string, status: number, fieldErrors?: Record<string, string[]>,
	) {
		super(message);
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
}

/*
 * API REQUEST
 * Handles the common fetch logic used by all API operations.
 */
async function request<T>(path: string, options: RequestInit  = {}): Promise<T> {
	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers ?? {}),
		},
	});

	/*
	 * NO CONTENT RESPONSE
	 * DELETE requests return HTTP 204 when the resource has been successfully deleted. 
	 * Therefore there is no response body to parse.
	 */
	if (response.status === 204) {
		return undefined as T;
	}

	/* 
	 * RESPONSE BODY 
	 * Attempts to parse the response as JSON. As some responses do not contain a JSON body, parsing failures are ignored.
	 */
	const body = await response.json().catch(() => undefined);

	/*
	 * API ERROR HANDLING
	 * Converts unsuccessfuul HTTP responses into a consistent ApiError.
	 */
	if (!response.ok) {
		const message = body?.title ?? body?.message ?? `Request failed with status ${response.status}`;
		throw new ApiError(message, response.status, body?.errors);
	}

	return body as T;
}

/*
 * API METHODS
 * Provides the HTTP operations used by the rest of the frontend.
 * Individual pages and components use these methods through checkpointApi.ts.
 */
export const api = {
	get: <T>(path: string) => request<T>(path, { method: "GET" }),
	post: <T>(path: string, data: unknown) =>
		request<T>(path, { method: "POST", body: JSON.stringify(data) }),
	put: <T>(path: string, data: unknown) =>
		request<T>(path, { method: "PUT", body: JSON.stringify(data) }),
	delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};