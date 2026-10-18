using Checkpoint.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Checkpoint.Api.Tests;

/*
 * CHECKPOINT FACTORY
 * Starts the real Checkpoint API in memory for tests. 
 * Uses an in-memory SQLite database so tests never touch the real Checkpoint database.
 */
public class CheckpointFactory : WebApplicationFactory<Program>
{

    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    /*
     * CONFIGURE WEB HOST
     * Opens the connection to the in-memory SQLite database.
     * Removes the registrations that point to the real Checkpoint database.
     */
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        _connection.Open();

        builder.ConfigureServices(services =>
        {
            var toRemove = services
                .Where(d => d.ServiceType == typeof(DbContextOptions<CheckpointDbContext>)
                         || (d.ServiceType.FullName ?? string.Empty).Contains("IDbContextOptionsConfiguration"))
                .ToList();

            foreach (var descriptor in toRemove)
                services.Remove(descriptor);

            services.AddDbContext<CheckpointDbContext>(options => options.UseSqlite(_connection));
        });
    }

    /*
     * DISPOSE
     * CheckpointFactory cleanup.
     */
    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing) _connection.Dispose();
    }
}