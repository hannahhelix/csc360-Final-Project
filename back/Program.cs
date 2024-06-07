using System.Linq;
using System.Text.Json;
using back;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;


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
app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseAuthorization();

// app.MapPost("/dummyData", async (HttpContext context) =>
// {
//     // Access the dummy data
//     var dummyData = new
//     {
//         savings = new
//         {
//             savingsAmount = 2000.05,
//             transactions = new[]
//             {
//                 new { date = "2024-06-01", description = "Deposit from paycheck" },
//                 new { date = "2024-06-05", description = "Grocery shopping" },
//                 new { date = "2024-06-10", description = "Utilities bill payment" }
//             }
//         },
//         budget = new []
//         {
//            new
//             {
//                 title = "Entertainment Budget",
//                 description = "Budget for movies, games, and outings",
//                 amount = 300,
//                 progress = 100
//             },
//             new
//             {
//                 title = "Food Budget",
//                 description = "Budget for groceries and dining out",
//                 amount = 200,
//                 progress = 150
//             },
//             new
//             {
//                 title = "Transport Budget",
//                 description = "Budget for public transport and fuel",
//                 amount = 100,
//                 progress = 70
//             }
//          },
//         account = new
//         {
//             username = "testuser",
//             initialSavingsBalance = 1500,
//             goalSavingsBalance = 5000
//         }
//     };

//      using (var goalsContext = new GoalsContext(context.RequestServices.GetRequiredService<DbContextOptions<GoalsContext>>()))
//     {
//         // Add account
//         var account = new Account
//         {
//             Username = dummyData.account.username,
//             Password = "somepassword",
//             InitialSavingsBalance = dummyData.account.initialSavingsBalance,
//             SavingsGoalsList = new List<SavingsGoals>(),
//             BudgetGoalsList = new List<BudgetGoals>()
//         };
//         goalsContext.Accounts.Add(account);

//         // Add savings goal
//         var savingsGoal = new SavingsGoals
//         {
//             CurrentSavingsBalance = Convert.ToDecimal(dummyData.savings.savingsAmount),
//             GoalAmount = dummyData.account.goalSavingsBalance,
//             AccountId = account.Id,
//             TransactionHistories = new List<TransactionHistory>(),
//             GoalMarkersList = new List<GoalMarkers>()
//         };
//         goalsContext.SavingsGoals.Add(savingsGoal);
//         account.SavingsGoalsList.Add(savingsGoal);

//         // Add transactions
//         foreach (var transaction in dummyData.savings.transactions)
//         {
//             var transactionHistory = new TransactionHistory
//             {
//                Date = DateTime.Parse(transaction.date),
//                 Description = transaction.description,
//                 Amount = 0, 
//                 SavingsGoalId = savingsGoal.Id
//             };
//             goalsContext.TransactionHistories.Add(transactionHistory);
//             savingsGoal.TransactionHistories.Add(transactionHistory);
//         }

//         // Add budget goal
//         foreach (var budget in dummyData.budget)
//         {
//             var budgetGoal = new BudgetGoals
//             {
//                 Title = budget.title,
//                 Description = budget.description,
//                 GoalAmount = budget.amount,
//                 CurrentAmount = budget.progress,
//                 AccountId = account.Id
//             };
//             goalsContext.BudgetGoals.Add(budgetGoal);
//             account.BudgetGoalsList.Add(budgetGoal);
//         }

//         // Save changes to the database
//         await goalsContext.SaveChangesAsync();
//     }

//     return Results.Ok("Dummy data saved into the database successfully");
// });

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
                    Description = newUser.BudgetGoalDecription
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

app.MapGet("/accounts", () =>
{
    using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var accounts = context.Accounts
            .Include(a => a.SavingsGoalsList)
                .ThenInclude(sg => sg.GoalMarkersList)
            .Include(a => a.BudgetGoalsList)
            .ToList();
        return Results.Ok(accounts);
    }
}).WithName("GetAccounts").WithOpenApi();

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

app.MapGet("/budgetGoals", async (GoalsContext context) =>
{
    var budgetGoals = await context.BudgetGoals.ToListAsync();
    return Results.Ok(budgetGoals);
}).WithName("GetBudgetGoals").WithOpenApi();

app.MapPost("/budgetGoals", async (HttpContext context, GoalsContext dbContext) =>
{
    try
    {
        var budgetGoalData = await context.Request.ReadFromJsonAsync<BudgetGoals>();

        var newBudgetGoal = new BudgetGoals
        {
            Title = budgetGoalData.Title,
            Description = budgetGoalData.Description,
            GoalAmount = budgetGoalData.GoalAmount,
            CurrentAmount = budgetGoalData.CurrentAmount
        };

        dbContext.BudgetGoals.Add(newBudgetGoal);

        await dbContext.SaveChangesAsync();

        return Results.Created($"/budgetGoals/{newBudgetGoal.Id}", newBudgetGoal);
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error creating budget goal: {ex.Message}");
    }
}).WithName("PostBudgetGoals").WithOpenApi();

app.MapPost("/login", (Login authenticatedUser) => {
  
    using(var context = new LoginContext())
    {
        var user = context.Logins.FirstOrDefault(l => l.Username == authenticatedUser.Username);
        if(user == null){
            return Results.NotFound();
        }
        return Results.Ok(user);
    }
}).WithName("Login").WithOpenApi().RequireAuthorization(new AuthorizeAttribute() {AuthenticationSchemes="BasicAuthentication"});

app.Run();
