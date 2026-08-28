using System.ComponentModel.DataAnnotations;

namespace Checkpoint.Api.Models;

/* 
 * PROJECT
 * Represents a project being managed within Checkpoint. A top-level container that a developer can create, view and update.
 */
public class Project
{
    /*
     * ATTRIBUTES
     * A project holds an identification number, name, description, and edit tracking.
     */
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /*
     * PLAYTEST SESSIONS
     * A project may have many associated playtest sessions.
     */
    public ICollection<PlaytestSession> Sessions { get; set; } = new List<PlaytestSession>();

}