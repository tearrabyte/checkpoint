using Checkpoint.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

/*
 * SERVICES
 * Registers the services required by the Checkpoint API with the ASP.NET Core dependency injection container.
 */
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddDbContext<CheckpointDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("Default") 
        ?? "Data Source=checkpoint.db"));

builder.Services.AddOpenApi();

/*
 * CORS
 * Allows the React development server to communicate with the API during local development.
 */
const string CorsPolicy = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

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

/* HTTP REQUEST PIPELINE
 * Configures the middleware and endpoints used by the API.
 */
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(CorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
