using Checkpoint.Api.Data;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Controllers;

/*
 * DASHBOARD API CONTROLLER
 * Provides a read-only summary of the current projects, playtest sessions, and feedback data.
 */
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly CheckpointDbContext _db;

    public DashboardController(CheckpointDbContext db)
    {
        _db = db;
    }

    /* 
     * SESSION TREND CHART 
     * Number of months to include in the trend chart. Default is 6 months.
     */
    private const int TrendMonths = 6;

    /*
     * GET DASHBOARD SUMMARY
     * Returns dashboard information calculated from the current database records.
     */
    [HttpGet]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalProjects = await _db.Projects.CountAsync();
        var totalPlaytestSessions = await _db.PlaytestSessions.CountAsync();
        var totalFeedbackItems = await _db.FeedbackItems.CountAsync();

        /*
         * FEEDBACK BREAKDOWNS
         * Counts of feedback items grouped by category, status, and priority.
         */
        var categoryCounts = await _db.FeedbackItems
            .GroupBy(f => f.Category)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .ToListAsync();

        var statusCounts = await _db.FeedbackItems
            .GroupBy(f => f.Status)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .ToListAsync();

        var feedbackCounts = await _db.FeedbackItems
            .GroupBy(f => f.Priority)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .ToListAsync();

        var feedbackByCategory = categoryCounts.ToDictionary(x => x.Key.ToString(), x => x.Count);
        var feedbackByStatus = statusCounts.ToDictionary(x => x.Key.ToString(), x => x.Count);
        var feedbackByPriority = feedbackCounts.ToDictionary(x => x.Key.ToString(), x => x.Count);

        var openCriticalOrHighCount = await _db.FeedbackItems
            .CountAsync(f =>
                f.Status != FeedbackStatus.Resolved &&
                f.Status != FeedbackStatus.Rejected &&
                (f.Priority == FeedbackPriority.Critical || f.Priority == FeedbackPriority.High));

        /*
         * SESSION TREND DATA
         * Reads the session dates from the database and groups them by month.
         */
        var windowStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1)
            .AddMonths(-(TrendMonths - 1));

        var sessionDates = await _db.PlaytestSessions
            .Where(s => s.SessionDate >= windowStart)
            .Select(s => s.SessionDate)
            .ToListAsync();

        var sessionsPerMonth = Enumerable.Range(0, TrendMonths)
            .Select(offset => windowStart.AddMonths(offset))
            .Select(month => new SessionTrendPointDto
            {
                Label = month.ToString("MMM yyyy"),
                Countdown = sessionDates.Count(d => d.Year == month.Year && d.Month == month.Month)
            })
            .ToList();

        var recentPlaytestSessions = await _db.PlaytestSessions
            .OrderByDescending(s => s.SessionDate)
            .Take(5)
            .Select(s => new RecentPlaytestSessionDto
            {
                Id = s.Id,
                ProjectId = s.ProjectId,
                ProjectName = s.Project!.Name,
                Name = s.Name,
                SessionDate = s.SessionDate,
                Status = s.Status,
                FeedbackCount = s.Feedback.Count()
            })
            .ToListAsync();

        var summary = new DashboardSummaryDto
        {
            TotalProjects = totalProjects,
            TotalPlaytestSessions = totalPlaytestSessions,
            TotalFeedbackItems = totalFeedbackItems,
            FeedbackByCategory = feedbackByCategory,
            FeedbackByStatus = feedbackByStatus,
            FeedbackByPriority = feedbackByPriority,
            OpenCriticalOrHighCount = openCriticalOrHighCount,
            SessionsPerMonth = sessionsPerMonth,
            RecentPlaytestSessions = recentPlaytestSessions
        };

        return Ok(summary);
    }
}