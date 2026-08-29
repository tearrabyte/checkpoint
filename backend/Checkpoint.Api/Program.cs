using Checkpoint.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*
 * SERVICES
 * Registers the services required by the Checkpoint API with the ASP.NET Core dependency injection container.
 */
builder.Services.AddControllers();

builder.Services.AddDbContext<CheckpointDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("Default") 
        ?? "Data Source=checkpoint.db"));

builder.Services.AddOpenApi();

/* HTTP REQUEST PIPELINE
 * Configures the middleware and endpoints used by the API.
 */
var app = builder.Build();

/*
 * DATABASE
 * Applies the committed EF Core migrations when  the API starts.
 * Ensures the local SQLite database exists and matches the database schema.
 */
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CheckpointDbContext>();

    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
