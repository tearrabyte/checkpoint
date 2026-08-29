using Checkpoint.Api.Data;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Controllers;

/*
 * FEEDBACK API CONTROLLER
 * Responsible for handling HTTP requests for creating, viewing, updating, and deleting feedback items.
 * Each feedback item is nested under a playtest session.
 */
[ApiController]
[Route("api/projects/{projectId:int}/sessions/{sessionId:int}/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly CheckpointDbContext _db;

    public FeedbackController(CheckpointDbContext db)
    {
        _db = db;
    }

    /*
     * GET ALL FEEDBACK
     * Returns all feedback belonging to the specified project and playtest session, ordered by creation date.
     */
    [HttpGet]
    public async Task<ActionResult<List<FeedbackResponseDto>>> GetAll(int projectId, int sessionId)
    {
        var session = await _db.PlaytestSessions
            .FirstOrDefaultAsync(s => s.Id  == sessionId && s.ProjectId == projectId);
        if (session == null)
            return NotFound(new { message = $"Playtest session {sessionId} was not found." });

        var items = await _db.FeedbackItems
            .Where(f => f.PlaytestSessionId == sessionId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        return Ok(items.Select(f => ToDto(f, session)).ToList());
    }

    /*
     * GET FEEDBACK BY ID
     * Returns feedback belonging to the specified playtest session.
     */
    [HttpGet("{id:int}")]
    public async Task<ActionResult<FeedbackResponseDto>> GetById(int projectId, int sessionId, int id)
    {
        var session = await _db.PlaytestSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.ProjectId == projectId);
        if (session == null)
            return NotFound(new { message = $"Session {sessionId} was not found." });

        var item = await _db.FeedbackItems
            .FirstOrDefaultAsync(f => f.Id == id && f.PlaytestSessionId == sessionId);
        if (item == null)
            return NotFound(new { message = $"Feedback {id} was not found." });

        return Ok(ToDto(item, session));
    }

    /*
     * CREATE FEEDBACK
     * Creates a new feedback item under the selected playtest session.
     */
    [HttpPost]
    public async Task<ActionResult<FeedbackResponseDto>> Create(int projectId, int sessionId, FeedbackCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            ModelState.AddModelError(nameof(dto.Title), "Feedback title connot be blank or whitespace only.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            ModelState.AddModelError(nameof(dto.Description), "Feedback description cannot be blank or whitespace only.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var session = await _db.PlaytestSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.ProjectId == projectId);
        if (session == null)
            return NotFound(new { message = $"Session {sessionId} was not found." });

        var feedback = new Feedback
        {
            PlaytestSessionId = sessionId,
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            SubmittedBy = string.IsNullOrWhiteSpace(dto.SubmittedBy) ? "Anonymous" : dto.SubmittedBy.Trim(),
            Category = dto.Category,
            Priority = dto.Priority,
            Status = FeedbackStatus.New,
            ExpectedBehaviour = dto.ExpectedBehaviour?.Trim(),
            ActualBehaviour = dto.ActualBehaviour?.Trim(),
            ReproductionSteps = dto.ReproductionSteps?.Trim(),
            Environment = dto.Environment?.Trim()
        };

        _db.FeedbackItems.Add(feedback);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { projectId, sessionId, id = feedback.Id }, ToDto(feedback, session));
    }

    /*
     * UPDATE FEEDBACK
     * Updates the editable feedback information.
     */
    [HttpPut("{id:int}")]
    public async Task<ActionResult<FeedbackResponseDto>> Update(int projectId, int sessionId, int id, FeedbackUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var session = await _db.PlaytestSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.ProjectId == projectId);
        if (session == null)
            return NotFound(new { message = $"Playtest session {sessionId} was not found." });

        var feedback = await _db.FeedbackItems
            .FirstOrDefaultAsync(f => f.Id == id && f.PlaytestSessionId == sessionId);
        if (feedback == null)
            return NotFound(new { message = $"Feedback {id} was not found." });

        feedback.Category = dto.Category;
        feedback.Priority = dto.Priority;
        feedback.Status = dto.Status;
        feedback.ExpectedBehaviour = dto.ExpectedBehaviour?.Trim();
        feedback.ActualBehaviour = dto.ActualBehaviour?.Trim();
        feedback.ReproductionSteps = dto.ReproductionSteps?.Trim();
        feedback.Environment = dto.Environment?.Trim();
        feedback.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToDto(feedback, session));
    }

    /*
     * DELETE FEEDBACK
     * Deletes the feedback.
     */
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int projectId, int sessionId, int id)
    {
        var feedback = await _db.FeedbackItems
            .FirstOrDefaultAsync(f => f.Id == id && f.PlaytestSessionId == sessionId);
        if (feedback == null)
            return NotFound(new { message = $"Feedback {id} was not found." });

        _db.FeedbackItems.Remove(feedback);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    /*
    * FEEDBACK TO RESPONSE DTO
    * Converts the EF Core Project entity into the API response DTO.
    */
    private static FeedbackResponseDto ToDto(Feedback f, PlaytestSession s) => new()
    {
        Id = f.Id,
        PlaytestSessionId = f.PlaytestSessionId,
        SessionName = s.Name,
        ProjectId = s.ProjectId,
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
        UpdatedAt = f.UpdatedAt,
    };
}