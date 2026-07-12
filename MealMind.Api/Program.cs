using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//registering service for dependency injection
builder.Services.AddScoped<IRecipeService, RecipeService>();
//the pantry lives at mealmind.db, and it's a SQLite pantry
builder.Services.AddDbContext<MealMindDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
