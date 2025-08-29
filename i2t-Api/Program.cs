// i2t-Api/Program.cs

using i2t.Middleware;
using i2t.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IOcrService, TesseractOcrService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    builder.WithOrigins(
        "http://localhost:5173"//,//local
        //""
    ).AllowAnyMethod()
     .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
//app.Run();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");

