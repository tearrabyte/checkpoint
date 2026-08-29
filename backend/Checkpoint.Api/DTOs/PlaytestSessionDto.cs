using System.ComponentModel.DataAnnotations;
using Checkpoint.Api.Models;

namespace Checkpoint.Api.DTOs;

/*
 * PLAYTEST SESSION DTOs
 * The data that can be sent to and returned from the Project API regarding Session.
 */

/*
 * CREATE PLAYTEST SESSION DTO
 * Defines the information required when creating a new playtest session.
 */
public class PlaytestSessionCreateDto
{
    [Required, MaxLength(120), MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime SessionDate { get; set; }

    [Required, MaxLength(50)]
    public string GameVersion { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Notes {  get; set; } = string.Empty;
}

/*
 * UPDATE PLAYTEST SESSION DTO
 * Defines the information that can be changed when updating a playtest session.
 */
public class PlaytestSessionUpdateDto
{
    [Required, MaxLength(120), MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime SessionDate { get; set; }

    [Required, MaxLength(50)]
    public string GameVersion { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Notes { get; set; } = string.Empty;

    [Required]
    public SessionStatus Status {  get; set; }
}

/*
 * PLAYTEST SESSION RESPONSE DTO
 * Defines the playtest session information returned by the API.
 */
public class PlaytestSessionResponseDto
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string Name { get; set; } = string.Empty;
    public DateTime SessionDate {  set; get; }
    public string GameVersion {  set; get; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public SessionStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public int FeedbackCount { get; set; }
}