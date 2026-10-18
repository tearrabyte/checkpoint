using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Checkpoint.Api.Tests;

/*
 * API TESTS
 * Automates test cases by calling the real API in memory.
 */
[TestClass]
public class ApiTests
{
    /* SETUP AND CLEANUP */
    private static CheckpointFactory _factory = null!;
    private HttpClient _client = null!;

    [ClassInitialize]
    public static void StartApi(TestContext context) => _factory = new CheckpointFactory();

    [ClassCleanup]
    public static void StopApi() => _factory.Dispose();

    [TestInitialize]
    public void CreateClient() => _client = _factory.CreateClient();

    private static string FeedbackUrl(int projectId, int sessionId) =>
        $"/api/projects/{projectId}/sessions/{sessionId}/feedback";

    private static int Total(JsonElement summary, string name) =>
        summary.GetProperty(name).GetInt32();

    private static int Count(JsonElement summary, string group, string key) =>
        summary.GetProperty(group).TryGetProperty(key, out var value) ? value.GetInt32() : 0;

    [TestCleanup]
    public void CleanupClient()
    {
        _client.Dispose();
    }

    /* TC-01: Create a valid project */
    [TestMethod]
    public async Task CreateProject_WithValidData_Returns201()
    {
        var response = await _client.PostAsJsonAsync("/api/projects",
            new { name = "Project Aurora", description = "Test project for Aurora build" });

        Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
        var body = await response.ReadJsonAsync();
        Assert.AreEqual("Project Aurora", body.GetProperty("name").GetString());
        Assert.AreEqual(0, body.GetProperty("sessionCount").GetInt32());
    }

    /* TC-02: Reject a blank project name */
    [TestMethod]
    public async Task CreateProject_WithBlankName_Returns400WithNameError()
    {
        var response = await _client.PostAsJsonAsync("/api/projects",
            new { name = "", description = "Test" });

        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.IsTrue((await response.ReadJsonAsync()).HasFieldError("Name"));
    }

    /* TC-13: Boundary and unsafe input */
    [TestMethod]
    public async Task CreateProject_BoundaryAndUnsafeInput_IsHandledCorrectly()
    {
        /* Boundary cases */
        var boundaryCases = new (string Name, HttpStatusCode Expected)[]
        {
        (new string('a', 1), HttpStatusCode.BadRequest),
        (new string('a', 2), HttpStatusCode.Created),
        (new string('a', 120), HttpStatusCode.Created),
        (new string('a', 121), HttpStatusCode.BadRequest),

        /* Invalid whitespace-only names */
        ("", HttpStatusCode.BadRequest),
        ("   ", HttpStatusCode.BadRequest),
        ("\t", HttpStatusCode.BadRequest),

        /* Unsafe-looking input that should be safely handled as data */
        ("'; DROP TABLE Projects; --", HttpStatusCode.Created),
        ("<script>alert(1)</script>", HttpStatusCode.Created),
        ("Player's \"Final\" Project!", HttpStatusCode.Created)
        };

        foreach (var (name, expected) in boundaryCases)
        {
            var response = await _client.PostAsJsonAsync(
                "/api/projects",
                new { name, description = "Boundary and input validation test" });

            Assert.AreEqual(
                expected,
                response.StatusCode,
                $"Unexpected status for project name: [{name}]");
        }
    }

    /* TC-03, DEF-01: Create a playtest session */
    [TestMethod]
    public async Task CreateSession_Returns201WithReadableStatus()
    {
        var projectId = await _client.CreateProjectAsync();

        var response = await _client.PostAsJsonAsync($"/api/projects/{projectId}/sessions",
            new { name = "Alpha Test 1", sessionDate = "2026-09-15", gameVersion = "v0.9.1-alpha", notes = "" });

        Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
        var body = await response.ReadJsonAsync();
        Assert.AreEqual(projectId, body.GetProperty("projectId").GetInt32());

        /* DEF-01 Guard: Enums return as readable text */
        Assert.AreEqual("Planned", body.GetProperty("status").GetString());
    }

    /* TC-05: Submit a valid defect */
    [TestMethod]
    public async Task SubmitDefect_WithAllFields_Returns201()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);

        var response = await _client.PostAsJsonAsync(FeedbackUrl(projectId, sessionId), new
        {
            title = "Crash on load",
            description = "Game crashes when loading level",
            category = "Defect",
            expectedBehaviour = "Level loads normally",
            actualBehaviour = "App exits with error 0xDEAD",
            reproductionSteps = "1. Launch; 2. Load level X; 3. Observe crash",
            environment = "Windows 11, RTX 3060"
        });

        Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
        var body = await response.ReadJsonAsync();
        Assert.AreEqual("Windows 11, RTX 3060", body.GetProperty("environment").GetString());
    }

    /* TC-06: Reject an incomplete defect */
    [TestMethod]
    public async Task SubmitDefect_WithoutDefectFields_Returns400ForEachField()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);

        var response = await _client.PostAsJsonAsync(FeedbackUrl(projectId, sessionId),
            new { title = "Crash on load", description = "Game crashes", category = "Defect" });

        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.ReadJsonAsync();
        foreach (var field in new[] { "ExpectedBehaviour", "ActualBehaviour", "ReproductionSteps", "Environment" })
            Assert.IsTrue(problem.HasFieldError(field), $"No validation error for {field}");
    }

    /* TC-07: Triage priority and status */
    [TestMethod]
    public async Task TriageFeedback_PersistsPriorityAndStatus()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);
        var feedbackId = await _client.CreateFeedbackAsync(projectId, sessionId);
        var url = $"{FeedbackUrl(projectId, sessionId)}/{feedbackId}";

        var update = await _client.PutAsJsonAsync(url,
            new { category = "Usability", priority = "High", status = "InProgress" });
        Assert.AreEqual(HttpStatusCode.OK, update.StatusCode);

        var fetched = await (await _client.GetAsync(url)).ReadJsonAsync();
        Assert.AreEqual("High", fetched.GetProperty("priority").GetString());
        Assert.AreEqual("InProgress", fetched.GetProperty("status").GetString());
    }

    /* DEF-06 Guard */
    [TestMethod]
    public async Task RecategoriseToDefect_WithoutDefectFields_Returns400()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);
        var feedbackId = await _client.CreateFeedbackAsync(projectId, sessionId);

        var response = await _client.PutAsJsonAsync($"{FeedbackUrl(projectId, sessionId)}/{feedbackId}",
            new { category = "Defect", priority = "Medium", status = "New" });

        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
    }

    /* TC-10: Filter feedback */
    [TestMethod]
    public async Task Filters_ReturnOnlyMatchingItems()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);
        await _client.CreateFeedbackAsync(projectId, sessionId, "Menu confusing", "Usability", "High");
        await _client.CreateFeedbackAsync(projectId, sessionId, "Boss damage too high", "Balance", "Critical");
        await _client.CreateFeedbackAsync(projectId, sessionId, "Camera feels floaty", "Gameplay", "Low");

        async Task<int> CountAsync(string query) =>
            (await (await _client.GetAsync($"/api/feedback?projectId={projectId}{query}")).ReadJsonAsync()).GetArrayLength();

        Assert.AreEqual(3, await CountAsync(""));
        Assert.AreEqual(1, await CountAsync("&priority=High"));
        Assert.AreEqual(1, await CountAsync("&category=Balance"));
        Assert.AreEqual(3, await CountAsync("&status=New"));
        Assert.AreEqual(0, await CountAsync("&status=Resolved"));
        Assert.AreEqual(0, await CountAsync("&category=Balance&priority=Low"));
    }

    /* TC-11: Dashboard accuracy */
    [TestMethod]
    public async Task Dashboard_TotalsIncreaseByTheDataAdded()
    {
        var before = await (await _client.GetAsync("/api/dashboard")).ReadJsonAsync();

        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);
        await _client.CreateFeedbackAsync(projectId, sessionId, "Boss damage too high", "Balance", "Critical");
        await _client.CreateFeedbackAsync(projectId, sessionId, "Menu confusing", "Usability", "Low");

        var after = await (await _client.GetAsync("/api/dashboard")).ReadJsonAsync();

        Assert.AreEqual(Total(before, "totalProjects") + 1, Total(after, "totalProjects"));
        Assert.AreEqual(Total(before, "totalPlaytestSessions") + 1, Total(after, "totalPlaytestSessions"));
        Assert.AreEqual(Total(before, "totalFeedbackItems") + 2, Total(after, "totalFeedbackItems"));
        Assert.AreEqual(Count(before, "feedbackByCategory", "Balance") + 1, Count(after, "feedbackByCategory", "Balance"));
        Assert.AreEqual(Count(before, "feedbackByPriority", "Critical") + 1, Count(after, "feedbackByPriority", "Critical"));
        Assert.AreEqual(Total(before, "openCriticalOrHighCount") + 1, Total(after, "openCriticalOrHighCount"));
    }

    /* TC-08: Cascade deletion (Confirmation dialog remains manual) */
    [TestMethod]
    public async Task DeleteProject_RemovesItsSessionsAndFeedback()
    {
        var projectId = await _client.CreateProjectAsync();
        var sessionId = await _client.CreateSessionAsync(projectId);
        await _client.CreateFeedbackAsync(projectId, sessionId);

        var delete = await _client.DeleteAsync($"/api/projects/{projectId}");
        Assert.AreEqual(HttpStatusCode.NoContent, delete.StatusCode);

        Assert.AreEqual(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/projects/{projectId}")).StatusCode);
        Assert.AreEqual(HttpStatusCode.NotFound, (await _client.GetAsync($"/api/projects/{projectId}/sessions/{sessionId}")).StatusCode);

        var feedback = await (await _client.GetAsync($"/api/feedback?projectId={projectId}")).ReadJsonAsync();
        Assert.AreEqual(0, feedback.GetArrayLength());
    }

}