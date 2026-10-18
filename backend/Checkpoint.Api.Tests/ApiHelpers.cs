using System.Net.Http.Json;
using System.Text.Json;

namespace Checkpoint.Api.Tests;

/*
 * API HELPERS
 * Small helpers to streamline automated testing.
 */
internal static class ApiHelpers
{
    public static Task<JsonElement> ReadJsonAsync(this HttpResponseMessage response) =>
        response.Content.ReadFromJsonAsync<JsonElement>();

    /* DETECT FIELD ERRORS */
    public static bool HasFieldError(this JsonElement problem, string field)
    {
        if (!problem.TryGetProperty("errors", out var errors)) return false;

        return errors.EnumerateObject()
            .Any(p => string.Equals(p.Name, field, StringComparison.OrdinalIgnoreCase));
    }

    /* CREATE PROJECT */
    public static async Task<int> CreateProjectAsync(this HttpClient client, string name = "Project Aurora")
    {
        var response = await client.PostAsJsonAsync("/api/projects",
            new { name, description = "Test project for Aurora build" });
        response.EnsureSuccessStatusCode();
        return (await response.ReadJsonAsync()).GetProperty("id").GetInt32();
    }

    /* CREATE SESSION */
    public static async Task<int> CreateSessionAsync(this HttpClient client, int projectId)
    {
        var response = await client.PostAsJsonAsync($"/api/projects/{projectId}/sessions",
            new { name = "Alpha Test 1", sessionDate = "2026-09-15", gameVersion = "v0.9.1-alpha", notes = "" });
        response.EnsureSuccessStatusCode();
        return (await response.ReadJsonAsync()).GetProperty("id").GetInt32();
    }

    /* CREATE FEEDBACK */
    public static async Task<int> CreateFeedbackAsync(
        this HttpClient client, int projectId, int sessionId,
        string title = "Menu confusing", string category = "Usability", string priority = "Medium")
    {
        var response = await client.PostAsJsonAsync(
            $"/api/projects/{projectId}/sessions/{sessionId}/feedback",
            new { title, description = "Main menu items are not intuitive", category, priority });
        response.EnsureSuccessStatusCode();
        return (await response.ReadJsonAsync()).GetProperty("id").GetInt32();
    }
}