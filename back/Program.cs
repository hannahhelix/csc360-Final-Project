using System.Linq;
using System.Text.Json;

using back;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAllOrigins",
    builder =>{
        builder.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyOrigin();
    });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication("BasicAuthentication")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

builder.Services.AddDbContext<GoalsContext>(options =>
    options.UseSqlite("Data Source=FinanceApp.db"));

builder.Services.AddDbContext<LoginContext>(options =>
    options.UseSqlite("Data Source=LoginDb.db"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("basic", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "basic",
        In = ParameterLocation.Header,
        Description = "Basic Authorization header using the Bearer scheme."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "basic"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();



app.MapPost("/newUser", (Login newUser) =>{
    using(var context = new LoginContext(new DbContextOptionsBuilder<LoginContext>().UseSqlite("Data Source=LoginDb.db").Options))
    {
        context.Logins.Add(newUser);
        context.SaveChanges();
        context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }
    return Results.Created($"/newUser/{newUser.Id}", newUser);
}).WithName("PostLogin").WithOpenApi();


app.MapGet("/initialize", () =>
{
    using (var goalsContext =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        goalsContext.Database.EnsureDeleted();
        goalsContext.Database.EnsureCreated();
    }

    using (var loginContext = new LoginContext(new DbContextOptionsBuilder<LoginContext>().UseSqlite("Data Source=LoginDb.db").Options))
    {
        loginContext.Database.EnsureDeleted();
        loginContext.Database.EnsureCreated();
    }

    using (var loginContext = new LoginContext(new DbContextOptionsBuilder<LoginContext>().UseSqlite("Data Source=LoginDb.db").Options))
    {
        //CHECK HERE
        Login starter = new Login("test", "test");
        loginContext.Logins.Add(starter);
        loginContext.SaveChanges();
        loginContext.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }

    return Results.Ok("Database initialized");
}).WithName("Init").WithOpenApi();


app.MapGet("/accounts", () =>
{
    using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var accounts = context.Accounts.Include(a => a.SavingsGoalsList).ThenInclude(sg => sg.GoalMarkersList).Include(a => a.BudgetGoalsList).ToList();
        return Results.Ok(accounts);
    }
}).WithName("GetAccounts").WithOpenApi();

app.MapPost("/accounts", (Account account) =>
{
    using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        context.Accounts.Add(account);
        context.SaveChanges();
        context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }
    return Results.Created($"/accounts/{account.Id}", account);
}).WithName("PostAccounts").WithOpenApi();


app.MapGet("/savingsGoals", () =>
{
    using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var savingsGoals = context.SavingsGoals.Include(sg => sg.TransactionHistories).Include(sg => sg.GoalMarkersList).ToList();
        return Results.Ok(savingsGoals);
    }
}).WithName("GetSavingsGoals").WithOpenApi();

app.MapPost("/savingsGoals", (SavingsGoals savingsGoal) =>
{
    using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        context.SavingsGoals.Add(savingsGoal);
        context.SaveChanges();
        context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }
    return Results.Created($"/savingsGoals/{savingsGoal.Id}", savingsGoal);
}).WithName("PostSavingsGoals").WithOpenApi();



app.MapPost("/login", (Login authenticatedUser) =>
{
    Console.WriteLine("Executing login: " + DateTime.Now.ToShortTimeString());
    using (var context = new LoginContext(new DbContextOptionsBuilder<LoginContext>().UseSqlite("Data Source=LoginDb.db").Options))
    {
        var user = context.Logins.FirstOrDefault(l => l.Username == authenticatedUser.Username);
        if (user == null)
        {
            return Results.NotFound();
        }
        return Results.Ok(user);
    }
}).WithName("Login").WithOpenApi().RequireAuthorization(new AuthorizeAttribute() { AuthenticationSchemes = "BasicAuthentication" });

app.Run();
