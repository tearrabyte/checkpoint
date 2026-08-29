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
     * GET DASHBOARD SUMMARY
     * Returns dashboard information calculated from the current database records.
     */
    [HttpGet]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalProjects = await _db.Projects.CountAsync();
        var totalPlaytestSessions = await _db.PlaytestSessions.CountAsync();
        var totalFeedbackItems = await _db.FeedbackItems.CountAsync();

        var feedbackByCategory = await _db.FeedbackItems
            .GroupBy(f => f.Category)
            .Select(g => new
            {
                Category = g.Key.ToString(),
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.Category, x => x.Count);

        var feedbackByStatus = await _db.FeedbackItems
            .GroupBy(f => f.Status)
            .Select(g => new
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.Status, x => x.Count);

        var feedbackByPriority = await _db.FeedbackItems
            .GroupBy(f => f.Priority)
            .Select(g => new
            {
                Priority = g.Key.ToString(),
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.Priority, x => x.Count);

        var openCriticalOrHighCount = await _db.FeedbackItems
            .CountAsync(f =>
                f.Status != FeedbackStatus.Resolved &&
                f.Status != FeedbackStatus.Rejected &&
                (f.Priority == FeedbackPriority.Critical || f.Priority == FeedbackPriority.High));

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
            RecentPlaytestSessions = recentPlaytestSessions
        };

        return Ok(summary);
    }
}