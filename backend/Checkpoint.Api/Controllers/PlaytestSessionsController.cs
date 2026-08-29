using Checkpoint.Api.Data;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Controllers;

/*
 * PLAYTEST SESSION API CONTROLLER
 * Responsible for handling HTTP requests for creating, viewing, updating, and deleting playtest sessions.
 * Sessions are nested under projects as each playtest session must belong to an existing project.
 */
[ApiController]
[Route("api/projects/{projectId:int}/sessions")]
public class PlaytestSessionsController : ControllerBase
{
    private readonly CheckpointDbContext _db;

    public PlaytestSessionsController(CheckpointDbContext db)
    {
        _db = db;
    }

    /*
     * GET ALL PLAYTEST SESSIONS
     * Returns all playtest sessions belonging to the specified project, ordered by most recent date.
     */
    [HttpGet]
    public async Task<ActionResult<List<PlaytestSessionResponseDto>>> GetAll(int projectId)
    {
        if (!await _db.Projects.AnyAsync(p => p.Id == projectId))
            return NotFound(new { message = $"Project {projectId} was not found." });

        var sessions = await _db.PlaytestSessions
            .Where(s => s.ProjectId == projectId)
            .OrderByDescending(s => s.SessionDate)
            .Select(s => new PlaytestSessionResponseDto
            {
                Id = s.Id,
                ProjectId = s.ProjectId,
                Name = s.Name,
                SessionDate = s.SessionDate,
                GameVersion = s.GameVersion,
                Notes = s.Notes,
                Status = s.Status,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                FeedbackCount = s.Feedback.Count()
            })
            .ToListAsync();

        return Ok(sessions);
    }

    /*
     * GET PLAYTEST SESSION BY ID
     * Returns a playtest session belonging to the specified project.
     */
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PlaytestSessionResponseDto>> GetById(int projectId, int id)
    {
        var session = await _db.PlaytestSessions
            .Where(s => s.Id == id && s.ProjectId == projectId)
            .Select(s => new PlaytestSessionResponseDto
            {
                Id = s.Id,
                ProjectId = s.ProjectId,
                Name = s.Name,
                SessionDate = s.SessionDate,
                GameVersion = s.GameVersion,
                Notes = s.Notes,
                Status = s.Status,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                FeedbackCount = s.Feedback.Count()
            })
            .FirstOrDefaultAsync();

        if (session == null)
            return NotFound(new { message = $"Session {id} was not found." });

        return Ok(session);
    }

    /*
     * CREATE PLAYTEST SESSION
     * Creates a new session under the selected project.
     */
    [HttpPost]
    public async Task<ActionResult<PlaytestSessionResponseDto>> Create(int projectId, PlaytestSessionCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            ModelState.AddModelError(nameof(dto.Name), "Session name cannot be blank or whitespace only.");

        if (string.IsNullOrWhiteSpace(dto.GameVersion))
            ModelState.AddModelError(nameof(dto.GameVersion), "Game version cannot be blank or whitespace only.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (!await _db.Projects.AnyAsync(p => p.Id == projectId))
            return NotFound(new { message = $"Project {projectId} was not found." });

        var session = new PlaytestSession
        {
            ProjectId = projectId,
            Name = dto.Name.Trim(),
            SessionDate = dto.SessionDate,
            GameVersion = dto.GameVersion.Trim(),
            Notes = dto.Notes.Trim(),
            Status = SessionStatus.Planned
        };

        _db.PlaytestSessions.Add(session);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { projectId, id = session.Id }, ToDto(session));
    }

    /*
     * UPDATE PLAYTEST SESSION
     * Updates the editable playtest session information.
     */
    [HttpPut("{id:int}")]
    public async Task<ActionResult<PlaytestSessionResponseDto>> Update(int projectId, int id, PlaytestSessionUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            ModelState.AddModelError(nameof(dto.Name), "Session name cannot be blank or whitespace only.");

        if (string.IsNullOrWhiteSpace(dto.GameVersion))
            ModelState.AddModelError(nameof(dto.GameVersion), "Game version cannot be blank or whitespace only.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var session = await _db.PlaytestSessions
            .FirstOrDefaultAsync(s => s.Id == id && s.ProjectId == projectId);

        if (session == null)
            return NotFound(new { message = $"Playtest session {id} was not found." });

        session.Name = dto.Name.Trim();
        session.SessionDate = dto.SessionDate;
        session.GameVersion = dto.GameVersion.Trim();
        session.Notes = dto.Notes.Trim();
        session.Status = dto.Status;
        session.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToDto(session));
    }

    /*
     * DELETE PLAYTEST SESSION
     * Deletes the session and any associated feedback.
     */
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int projectId, int id)
    {
        var session = await _db.PlaytestSessions
            .FirstOrDefaultAsync(s => s.Id == id && s.ProjectId == projectId);

        if (session == null)
            return NotFound(new { message = $"Playtest session {id} was not found." });

        _db.PlaytestSessions.Remove(session);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    /*
    * PLAYTEST SESSION TO RESPONSE DTO
    * Converts the EF Core Project entity into the API response DTO.
    */
    private static PlaytestSessionResponseDto ToDto(PlaytestSession s) => new()
    {
        Id = s.Id,
        ProjectId = s.ProjectId,
        Name = s.Name,
        SessionDate = s.SessionDate,
        GameVersion = s.GameVersion,
        Notes = s.Notes,
        Status = s.Status,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt,
        FeedbackCount = s.Feedback?.Count ?? 0,
    };
}
