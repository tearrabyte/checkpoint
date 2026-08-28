using Checkpoint.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Checkpoint.Api.Data;

/*
 * DATABASE CONTEXT
 * Provides access to the application's SQLite database through Entity Framework Core.
 */
public class CheckpointDbContext : DbContext
{
    public CheckpointDbContext(DbContextOptions<CheckpointDbContext> options) : base(options) { }

    /* DATABASE TABLES
     * Each table is represented by a database set managed by EF Core within the Checkpoint database.
     */
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<PlaytestSession> PlaytestSessions => Set<PlaytestSession>();
    public DbSet<Feedback> FeedbackItems => Set<Feedback>();

    /*
     * RELATIONSHIPS
     * Configure the one-to-many relationships between projects, playtest sessions, and feedback records.
     * Deleting a parent record cascades to its associated records.
     */
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>()
            .HasMany(project => project.Sessions)
            .WithOne(session => session.Project)
            .HasForeignKey(session => session.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlaytestSession>()
            .HasMany(session => session.Feedback)
            .WithOne(feedback => feedback.PlaytestSession)
            .HasForeignKey(feedback => feedback.PlaytestSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        /*
         * ENUM STORAGE
         * Store enums as string names so SQLite files remain human-readable.
         */
        modelBuilder.Entity<Feedback>().Property(f => f.Category).HasConversion<string>();
        modelBuilder.Entity<Feedback>().Property(f => f.Priority).HasConversion<string>();
        modelBuilder.Entity<Feedback>().Property(f => f.Status).HasConversion<string>();
        modelBuilder.Entity<PlaytestSession>().Property(s => s.Status).HasConversion<string>();
    }
}