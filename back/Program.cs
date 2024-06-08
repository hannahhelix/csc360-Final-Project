using System.Linq;
using System.Text.Json;
using back;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAllOrigins", builder =>{
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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>{
    c.AddSecurityDefinition("basic", new OpenApiSecurityScheme{
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "basic",
        In = ParameterLocation.Header,
        Description = "Basic Authorization header using the Bearer scheme."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
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

app.UseHttpsRedirection();
app.UseCors(builder =>{
    builder.WithOrigins("http://localhost:3000")
           .AllowAnyHeader()
           .AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();


app.MapPost("/newUser", (Login newUser) => {
    using(var loginContext = new LoginContext()) {
        loginContext.Logins.Add(newUser);
        loginContext.SaveChanges();
        loginContext.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;"); // Ensure WAL checkpoint
    }
    using(var financeContext =new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options)){

        var newAccount = new Account {
            Username = newUser.Username,
            Password = newUser.Password,
            SavingsGoalsList = new List<SavingsGoals> { 
                new SavingsGoals {
                    CurrentSavingsBalance = newUser.InitialSavingsBalance,
                    GoalAmount = newUser.GoalSavingsBalance,
                }
            },
            BudgetGoalsList = new List<BudgetGoals> {
                new BudgetGoals {
                    Title = newUser.BudgetGoalTitle,
                    GoalAmount = newUser.BudgetGoalAmount,
                    Description = newUser.BudgetGoalDescription
                }
            }
        };
        financeContext.Accounts.Add(newAccount);
        financeContext.SaveChanges(); 
        financeContext.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;"); // Ensure WAL checkpoint
    }
    
    return Results.Created($"/newUser/{newUser.Id}", newUser);
}).WithName("PostLogin").WithOpenApi();

app.MapGet("/initialize", () =>
{
   using (var goalsContext = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        goalsContext.Database.EnsureDeleted();
        goalsContext.Database.EnsureCreated();
    }

    using (var loginContext = new LoginContext())
    {
        loginContext.Database.EnsureDeleted();
        loginContext.Database.EnsureCreated();
    }

    using(var loginContext = new LoginContext())
        {
            Login starter = new Login("testuser", "somepassword");
            loginContext.Logins.Add(starter);
            loginContext.SaveChanges();
            loginContext.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
    return Results.Ok("Database initialized");
}).WithName("Init").WithOpenApi();


app.MapPost("/accounts", (Account account) =>
{
    using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        context.Accounts.Add(account);
        context.SaveChanges();
        foreach (var monthlyGoal in account.MonthlyGoals)
        {
            var goalMarker = new GoalMarkers
            {
                SavingsGoalId = monthlyGoal.SavingsGoalId,
                Month = monthlyGoal.Month,
                Amount = monthlyGoal.Amount,
                IsCheckedOff = false 
            };
            context.GoalMarkers.Add(goalMarker);
        }
        context.SaveChanges();
        context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
    }
    return Results.Created($"/accounts/{account.Id}", account);
}).WithName("PostAccounts").WithOpenApi();

// app.MapGet("/accounts", () =>
// {
//     using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
//     {
//         var accounts = context.Accounts
//             .Include(a => a.SavingsGoalsList)
//                 .ThenInclude(sg => sg.GoalMarkersList)
//             .Include(a => a.BudgetGoalsList)
//             .ToList();
//         return Results.Ok(accounts);
//     }
// }).WithName("GetAccounts").WithOpenApi();

app.MapPut("/accounts/{id}", (int id, Account updatedAccount) =>
{
    using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var account = context.Accounts.Include(a => a.SavingsGoalsList)
                                      .ThenInclude(sg => sg.GoalMarkersList)
                                      .Include(a => a.BudgetGoalsList)
                                      .FirstOrDefault(a => a.Id == id);
        if (account == null)
        {
            return Results.NotFound();
        }

        account.Username = updatedAccount.Username;
        account.InitialSavingsBalance = updatedAccount.InitialSavingsBalance;
        account.GoalSavingsBalance = updatedAccount.GoalSavingsBalance;

        context.SaveChanges();
        context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");

        return Results.Ok(account);
    }
}).WithName("UpdateAccount").WithOpenApi();

// app.MapGet("/savingsGoals", () =>
// {
//     using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
//     {
//         var savingsGoals = context.SavingsGoals.Include(sg => sg.TransactionHistories).Include(sg => sg.GoalMarkersList).ToList();
//         return Results.Ok(savingsGoals);
//     }
// }).WithName("GetSavingsGoals").WithOpenApi();

// app.MapPost("/savingsGoals", (SavingsGoals savingsGoal) =>
// {
//     using (var context =  new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
//     {
//         context.SavingsGoals.Add(savingsGoal);
//         context.SaveChanges();
//         context.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
//     }
//     return Results.Created($"/savingsGoals/{savingsGoal.Id}", savingsGoal);
// }).WithName("PostSavingsGoals").WithOpenApi();

// app.MapPost("/transactions", async (TransactionHistory transactionHistory, GoalsContext context) =>
// {
//     // Add the new transaction to the context
//     context.TransactionHistories.Add(transactionHistory);
//     await context.SaveChangesAsync();
//     var updatedTransactions = await context.TransactionHistories.ToListAsync();
//     return Results.Ok(updatedTransactions);
// })
// .WithName("PostTransaction")
// .WithOpenApi()
// .RequireAuthorization(new AuthorizeAttribute() { AuthenticationSchemes = "BasicAuthentication" });

app.MapGet("/accounts/{accountId}/budgetGoal", (int accountId) =>
{
    using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var budgetGoals = context.BudgetGoals
            .Where(bg => bg.AccountId == accountId)
            .ToList();
        return Results.Ok(budgetGoals);
    }
}).WithName("GetBudgetGoalsByAccount").WithOpenApi();

app.MapPost("/newBudgetGoal", async (HttpContext context, GoalsContext dbContext) =>
{
    try
    {
        var budgetGoalData = await context.Request.ReadFromJsonAsync<BudgetGoals>();

        if (budgetGoalData == null)
        {
            return Results.BadRequest("Invalid request data");
        }

        dbContext.BudgetGoals.Add(budgetGoalData);
        await dbContext.SaveChangesAsync();
        
        // If you need to return the created budget goal with the assigned ID
        return Results.Created($"/budgetGoals/{budgetGoalData.Id}", budgetGoalData);
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error creating budget goal: {ex.Message}");
    }
}).WithName("PostBudgetGoals").WithOpenApi();

app.MapPut("/budgetGoals/{id}/increment", async (int id, HttpContext httpContext, GoalsContext dbContext) =>
{
    try
    {
        var incrementValue = await httpContext.Request.ReadFromJsonAsync<decimal>();
        var existingGoal = await dbContext.BudgetGoals.FindAsync(id);
        if (existingGoal == null){
            return Results.NotFound("Budget goal not found");
        }
        existingGoal.CurrentAmount += incrementValue;
        await dbContext.SaveChangesAsync();
        return Results.Ok(existingGoal); 
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error updating current amount of budget goal: {ex.Message}");
    }
}).WithName("IncrementBudgetGoal").WithOpenApi();

app.MapPost("/login", (Login authenticatedUser) => {
  
    using(var context = new LoginContext())
    {
        var user = context.Logins.FirstOrDefault(l => l.Username == authenticatedUser.Username);
        if(user == null){
            return Results.NotFound();
        }

        using(var financeContext = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
        {
            var account = financeContext.Accounts.FirstOrDefault(a => a.Username == authenticatedUser.Username);
            if (account == null)
            {
                return Results.NotFound("Account not found");
            }

            var response = new {
                user,
                accountId = account.Id 
            };

            return Results.Ok(response);
        }
    }
}).WithName("Login").WithOpenApi().RequireAuthorization(new AuthorizeAttribute() {AuthenticationSchemes="BasicAuthentication"});

app.MapPost("/logout", (HttpContext context) => {
    // Perform sign-out actions, such as clearing cookies or redirecting to the login page
    // For example:
    // Clear authentication cookies
    // HttpContext.SignOutAsync();\
    context.Response.Cookies.Delete("username");
    context.Response.Cookies.Delete("accountId");
    
    return Results.Ok("Logged out successfully");
}).WithName("Logout").WithOpenApi().RequireAuthorization(new AuthorizeAttribute());

app.MapGet("/account/{id}", (string username) => {
    using(var financeContext = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var account = financeContext.Accounts.FirstOrDefault(a => a.Username == username);
        if (account == null)
        {
            return Results.NotFound("Account not found");
        }

        return Results.Ok(account.Id);
    }
}).WithName("GetAccountId").WithOpenApi();

app.Run();
