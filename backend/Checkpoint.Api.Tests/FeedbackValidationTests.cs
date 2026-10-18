using System.ComponentModel.DataAnnotations;
using Checkpoint.Api.DTOs;
using Checkpoint.Api.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Checkpoint.Api.Tests;

/*
 * FEEDBACK VALIDATION TESTS
 * Automate the validation rules for TC-05 and TC-06.
 */
[TestClass]
public class FeedbackValidationTests
{
    /* SETUP */
    private static readonly string[] DefectFields =
        { "ExpectedBehaviour", "ActualBehaviour", "ReproductionSteps", "Environment" };

    private static List<ValidationResult> Validate(object dto)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(dto, new ValidationContext(dto), results, validateAllProperties: true);
        return results;
    }

    private static FeedbackCreateDto CreateDto(FeedbackCategory category) => new()
    {
        Title = "Crash on load",
        Description = "Game crashes when loading level",
        Category = category
    };

    /* TESTS */
    [TestMethod]
    public void Create_Defect_WithoutDefectFields_ReportsAllFourFields()
    {
        var results = Validate(CreateDto(FeedbackCategory.Defect));

        foreach (var field in DefectFields)
            Assert.IsTrue(results.Any(r => r.MemberNames.Contains(field)), $"No error reported for {field}");
    }

    [TestMethod]
    public void Create_Defect_WithAllDefectFields_IsValid()
    {
        var dto = CreateDto(FeedbackCategory.Defect);
        dto.ExpectedBehaviour = "Level loads normally";
        dto.ActualBehaviour = "App exits with an error";
        dto.ReproductionSteps = "1. Launch the game";
        dto.Environment = "Windows 11";

        Assert.AreEqual(0, Validate(dto).Count);
    }

    [TestMethod]
    [DataRow(FeedbackCategory.Usability)]
    [DataRow(FeedbackCategory.Balance)]
    [DataRow(FeedbackCategory.FeatureRequest)]
    public void Create_NonDefect_DoesNotRequireDefectFields(FeedbackCategory category)
    {
        Assert.AreEqual(0, Validate(CreateDto(category)).Count);
    }

    [TestMethod]
    public void Update_RecategorisedToDefect_WithoutDefectFields_ReportsAllFourFields()
    {
        var dto = new FeedbackUpdateDto
        {
            Category = FeedbackCategory.Defect,
            Priority = FeedbackPriority.Medium,
            Status = FeedbackStatus.New
        };

        var results = Validate(dto);

        foreach (var field in DefectFields)
            Assert.IsTrue(results.Any(r => r.MemberNames.Contains(field)), $"No error reported for {field}");
    }
}