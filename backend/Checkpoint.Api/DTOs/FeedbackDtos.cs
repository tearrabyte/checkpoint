using System.ComponentModel.DataAnnotations;
using Checkpoint.Api.Models;

namespace Checkpoint.Api.DTOs;

/*
 * FEEDBACK DTOs
 * The data that can be sent to and returned from the Project API regarding Feedback records.
 */

/*
 * CREATE FEEDBACK DTO
 * Defines the information required when creating a new feedback submission.
 * Implements IValidatableObject to accommodate required fields when the category is defect.
 */
public class FeedbackCreateDto : IValidatableObject
{
    [Required, MaxLength(150), MinLength(2)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(3000), MinLength(5)]
    public string Description {  get; set; } = string.Empty;

    [MaxLength(100)]
    public string SubmittedBy { get; set; } = string.Empty;

    [Required]
    public FeedbackCategory Category { get; set; }

    public FeedbackPriority Priority { get; set; } = FeedbackPriority.Medium;

    [MaxLength(1000)]
    public string? ExpectedBehaviour { get; set; }

    [MaxLength(1000)]
    public string? ActualBehaviour {  get; set; }

    [MaxLength(2000)]
    public string? ReproductionSteps { get; set; }

    [MaxLength(500)]
    public string? Environment {  get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Category != FeedbackCategory.Defect) yield break;

        if (string.IsNullOrWhiteSpace(ExpectedBehaviour))
            yield return new ValidationResult(
                "Expected behaviour is required for defect reports.",
                new[] { nameof(ExpectedBehaviour) });

        if (string.IsNullOrWhiteSpace(ActualBehaviour))
            yield return new ValidationResult(
                "Actual behaviour is required for defect reports.",
                new[] { nameof(ActualBehaviour) });
        
        if (string.IsNullOrWhiteSpace(ReproductionSteps))
            yield return new ValidationResult(
                "Reproduction steps are required for defect reports.",
                new[] { nameof(ReproductionSteps) });

        if (string.IsNullOrWhiteSpace(Environment))
            yield return new ValidationResult(
                "Environment information is required for defect reports.",
                new[] { nameof(Environment) });
    }
}

/*
 * UPDATE FEEDBACK DTO
 * Defines the information that can be changed when updating a feedback report.
 */
public class FeedbackUpdateDto
{
    [Required]
    public FeedbackCategory Category {  get; set; }

    [Required]
    public FeedbackPriority Priority {  get; set; }

    [Required]
    public FeedbackStatus Status { get; set; }

    [MaxLength(1000)]
    public string? ExpectedBehaviour { get; set; }

    [MaxLength(1000)]
    public string? ActualBehaviour { get; set; }

    [MaxLength(2000)]
    public string? ReproductionSteps { get; set; }

    [MaxLength(500)]
    public string? Environment { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Category != FeedbackCategory.Defect) yield break;

        if (string.IsNullOrWhiteSpace(ExpectedBehaviour))
            yield return new ValidationResult(
                "Expected behaviour is required for defect reports.",
                new[] { nameof(ExpectedBehaviour) });

        if (string.IsNullOrWhiteSpace(ActualBehaviour))
            yield return new ValidationResult(
                "Actual behaviour is required for defect reports.",
                new[] { nameof(ActualBehaviour) });

        if (string.IsNullOrWhiteSpace(ReproductionSteps))
            yield return new ValidationResult(
                "Reproduction steps are required for defect reports.",
                new[] { nameof(ReproductionSteps) });

        if (string.IsNullOrWhiteSpace(Environment))
            yield return new ValidationResult(
                "Environment information is required for defect reports.",
                new[] { nameof(Environment) });
    }
}

/*
 * FEEDBACK RESPONSE DTO
 * Defines the feedback information returned by the API.
 */
public class FeedbackResponseDto
{
    public int Id { get; set; }

    public int PlaytestSessionId { get; set; }
    public string SessionName { get; set; } = string.Empty;
    public int ProjectId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SubmittedBy {  get; set; } = string.Empty;
    public FeedbackCategory Category { get; set; }
    public FeedbackPriority Priority { get; set; }
    public FeedbackStatus Status { get; set; }

    public string? ExpectedBehaviour { get; set; }
    public string? ActualBehaviour { get; set; }
    public string? ReproductionSteps { get; set; }
    public string? Environment { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}