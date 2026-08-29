using System.ComponentModel.DataAnnotations;

namespace Checkpoint.Api.DTOs;

/*
 * PROJECT DTOs
 * The data that can be sent to and returned from the Project API regarding Projects.
 */

/*
 * CREATE PROJECT DTO
 * Defines the information required when creating a new project.
 */
public class ProjectCreateDto
{
    [Required, MaxLength(120), MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description {  get; set; } = string.Empty;
}

/*
 * UPDATE PROJECT DTO
 * Defines the information that can be changed when updating a project.
 */
public class ProjectUpdateDto
{
    [Required, MaxLength(120), MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
}

/*
 * PROJECT RESPONSE DTO
 * Defines the project information returned by the API.
 */
public class ProjectResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public int SessionCount { get; set; }
}