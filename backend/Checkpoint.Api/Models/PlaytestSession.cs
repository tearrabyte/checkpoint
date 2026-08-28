using System.ComponentModel.DataAnnotations;

namespace Checkpoint.Api.Models;

/* 
 * PLAYTEST SESSION
 * Represents a playtest session associated with a project. A developer can create, view and update a session.
 */
public class PlaytestSession
{
    /*
     * ATTRIBUTES
     * A playtest session records an identification number, name, date, game version, and status.
     */
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime SessionDate {  get; set; }

    [Required, MaxLength(50)]
    public string GameVersion { get; set; } = string.Empty;

    [Required]
    public SessionStatus Status { get; set; } = SessionStatus.Planned;

    [MaxLength(2000)]
    public string Notes {  get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /*
     * PROJECT
     * Each playtest session belongs to one project.
     */
    [Required]
    public int ProjectId { get; set; }
    public Project? Project { get; set; }

    /*
     * FEEDBACK
     * A playtest session may have many associated feedback records.
     */
    public ICollection<Feedback> Feedback { get; set; } = new List<Feedback>();

}