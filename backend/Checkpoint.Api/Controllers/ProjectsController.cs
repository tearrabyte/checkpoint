using Checkpoint.Api.Data;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Controllers;

/*
 * PROJECT API CONTROLLER
 * Responsible for handling HTTP requests for creating, viewing, updating, and deleting projects.
 */
[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly CheckpointDbContext _db;

    public ProjectsController(CheckpointDbContext db)
    {
        _db = db;
    }

    /*
     * GET ALL PROJECTS
     * Returns all projects ordered by most recently updated.
     * SessionCount is calculated by the database rather than loading all session records into memory.
     */
    [HttpGet]
    public async Task<ActionResult<List<ProjectResponseDto>>> GetAll()
    {
        var projects = await _db.Projects
            .OrderByDescending(p => p.UpdatedAt)
            .Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                SessionCount = p.Sessions.Count()
            })
            .ToListAsync();

        return Ok(projects);
    }

    /*
     * GET PROJECT BY ID
     * Returns a single project or a 404 response if it does not exist.
     */
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectResponseDto>> GetById(int id)
    {
        var project = await _db.Projects
            .Where(p => p.Id == id)
            .Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                SessionCount = p.Sessions.Count()
            })
            .FirstOrDefaultAsync();

        if (project == null)
            return NotFound(new { message = $"Project {id} was not found." });

        return Ok(project);
    }

    /*
     * CREATE PROJECT
     * Creates a new project using the validated ProjectCreateDto.
     */
    [HttpPost]
    public async Task<ActionResult<ProjectResponseDto>> Create(ProjectCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            ModelState.AddModelError(nameof(dto.Name), "Project name cannot be blank or whitespace only.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            ModelState.AddModelError(nameof(dto.Description), "Project description cannot be blank or whitespace only.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var project = new Project
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim()
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = project.Id }, ToDto(project));
    }

    /*
     * UPDATE PROJECT
     * Updates the editable project information and records the update time.
     */
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProjectResponseDto>> Update(
        int id,
        ProjectUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            ModelState.AddModelError(nameof(dto.Name), "Project name cannot be blank or whitespace only.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            ModelState.AddModelError(nameof(dto.Description), "Project description cannot be blank or whitespace only.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var project = await _db.Projects
            .Include(p => p.Sessions)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound(new { message = $"Project {id} was not found." });

        project.Name = dto.Name.Trim();
        project.Description = dto.Description.Trim();
        project.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToDto(project));
    }

    /*
     * DELETE PROJECT
     * Deletes the project. Related playtest sessions and feedback are also deleted through cascade relationships.
     */
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _db.Projects
            .FirstOrDefaultAsync(p =>p.Id == id);

        if (project == null)
            return NotFound(new { message = $"Project {id} was not found." });

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    /*
     * PROJECT TO RESPONSE DTO
     * Converts the EF Core Project entity into the API response DTO.
     */
    private static ProjectResponseDto ToDto(Project p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt,
        SessionCount = p.Sessions?.Count ?? 0
    };
}