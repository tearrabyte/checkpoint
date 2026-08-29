using Checkpoint.Api.Data;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Controllers;

/*
 * FEEDBACK QUERY API CONTROLLER
 * Used to provide a flat and filterable view across all feedback, independent of which project or playtest session the feedback belongs to.
 */
[ApiController]
[Route("api/feedback")]
public class FeedbackQueryController : ControllerBase
{
    private readonly CheckpointDbContext _db;

    public FeedbackQueryController(CheckpointDbContext db)
    {
        _db = db;
    }

    /*
     * GET ALL FEEDBACK WITH FILTERS
     * Returns all feedback ordered by creation date, with optional filters for status, priority, category, playtest session, and project.
     */
    [HttpGet]
    public async Task<ActionResult<List<FeedbackResponseDto>>> GetAll(
        [FromQuery] FeedbackStatus? status,
        [FromQuery] FeedbackPriority? priority,
        [FromQuery] FeedbackCategory? category,
        [FromQuery] int? sessionId,
        [FromQuery] int? projectId)
    {
        var query = _db.FeedbackItems
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(f => f.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(f => f.Priority == priority.Value);

        if (category.HasValue)
            query = query.Where(f => f.Category == category.Value);

        if (sessionId.HasValue)
            query = query.Where(f => f.PlaytestSessionId == sessionId.Value);

        if (projectId.HasValue)
            query = query.Where(f => f.PlaytestSession!.ProjectId == projectId.Value);

        var result = await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FeedbackResponseDto
            {
                Id = f.Id,
                PlaytestSessionId = f.PlaytestSessionId,
                SessionName = f.PlaytestSession!.Name,
                ProjectId = f.PlaytestSession.ProjectId,
                Title = f.Title,
                Description = f.Description,
                SubmittedBy = f.SubmittedBy,
                Category = f.Category,
                Priority = f.Priority,
                Status = f.Status,
                ExpectedBehaviour = f.ExpectedBehaviour,
                ActualBehaviour = f.ActualBehaviour,
                ReproductionSteps = f.ReproductionSteps,
                Environment = f.Environment,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            })
            .ToListAsync();

        return Ok(result);
    }
}