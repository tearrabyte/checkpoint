using System.ComponentModel.DataAnnotations;

namespace Checkpoint.Api.Models;

/* 
 * FEEDBACK
 * Represents a feedback record submitted by a playtester as part of a specific playtest session.
 */
public class Feedback
{
    /*
     * ATTRIBUTES
     * A feedback record contains a title, description, category, priority, status, and submitter information.
     */
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(3000)]
    public string Description {  get; set; } = string.Empty;

    [MaxLength(100)]
    public string SubmittedBy {  get; set; } = string.Empty; // Free-text. Authentication system explicitly out of scope.

    public FeedbackCategory Category { get; set; }
    public FeedbackPriority Priority { get; set; } = FeedbackPriority.Medium;
    public FeedbackStatus Status { get; set; } = FeedbackStatus.New;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /*
     * DEFECT-ONLY FIELDS
     * The following fields become mandatory when the defect category is selected. 
     * Conditional validation is enforced by the API.
     */
    [MaxLength(1000)]
    public string? ExpectedBehaviour {  get; set; }

    [MaxLength(1000)]
    public string? ActualBehaviour {  get; set; }

    [MaxLength(2000)]
    public string? ReproductionSteps {  get; set; }

    [MaxLength(500)]
    public string? Environment {  get; set; }


    /*
     * PLAYTEST SESSION
     * Each feedback record belongs to a playtest session.
     */
    [Required]
    public int PlaytestSessionId { get; set; }
    public PlaytestSession? PlaytestSession { get; set; }

}