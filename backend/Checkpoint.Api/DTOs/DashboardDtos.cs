using Checkpoint.Api.Models;

namespace Checkpoint.Api.DTOs;

/*
 * DASHBOARD DTOs
 * Aggregated counts built by the dashboard controller based on current data.
 */

/* 
 * DASHBOARD SUMMARY DTO
 * Defines the aggregated information returned by the dashboard.
 * Values are calculated from the current projects, playtest sessions, and feedback data when the dashboard is requested.
 */
public class DashboardSummaryDto
{
    public int TotalProjects { get; set; }
    public int TotalPlaytestSessions { get; set; }
    public int TotalFeedbackItems { get; set; }

    public Dictionary<string, int> FeedbackByCategory { get; set; } = new();
    public Dictionary<string, int> FeedbackByStatus { get; set; } = new();
    public Dictionary<string, int> FeedbackByPriority { get; set; } = new();

    public int OpenCriticalOrHighCount { get; set; }
    public List<RecentPlaytestSessionDto> RecentPlaytestSessions { get; set; } = new();
}

/*
 * RECENT SESSION DTO
 * Defines the session information displayed as part of the dashboard's recent-session summary.
 */
public class RecentPlaytestSessionDto
{
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
    public DateTime SessionDate { get; set; }
    public SessionStatus Status { get; set; }

    public int FeedbackCount { get; set; }
}