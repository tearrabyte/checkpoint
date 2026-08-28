namespace Checkpoint.Api.Models;

/*
 * FEEDBACK CATEGORY
 * Defines the available categories for submitted feedback.
 */
public enum FeedbackCategory
{
    Defect,
    Usability,
    Gameplay,
    Balance,
    Accessibility,
    FeatureRequest
}

/*
 * FEEDBACK PRIORITY
 * Defines the priority levels that developers can assign to feedback.
 */
public enum FeedbackPriority
{
    Low,
    Medium,
    High,
    Critical
}

/*
 * FEEDBACK STATUS
 * Defines the resolution status of an individual feedback item.
 */
public enum FeedbackStatus
{
    New,
    InProgress,
    Resolved,
    Rejected
}

/*
 * SESSION STATUS
 * Defines the lifecycle status of a playtest session.
 */
public enum SessionStatus
{
    Planned,
    InProgress,
    Completed
}