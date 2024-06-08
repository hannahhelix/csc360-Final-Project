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
    using(var financeContext = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options)) {

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

        // Create a response object to send back to the client
        var response = new {
            AccountId = newAccount.Id,
            InitialSavingsBalance = newAccount.SavingsGoalsList.First().CurrentSavingsBalance,
            GoalSavingsBalance = newAccount.SavingsGoalsList.First().GoalAmount
        };
        return Results.Created($"/newUser/{newUser.Id}", response);
    }
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

app.MapGet("/accounts/{accountId}/savingsGoals", (int accountId) =>
{
    using (var context = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
    {
        var savingsGoals = context.SavingsGoals
            .Where(sg => sg.AccountId == accountId)
            .Include(sg => sg.GoalMarkersList)
            .Select(sg => new 
            {
                sg.Id,
                sg.CurrentSavingsBalance,
                sg.GoalAmount,
                sg.AccountId,
                sg.GoalMarkersList
            })
            .ToList();
        return Results.Ok(savingsGoals);
    }
}).WithName("GetSavingsGoals").WithOpenApi();

app.MapPost("/newTransaction", async (HttpContext context) =>
{
    try
    {
        var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync();
        var transactionData = System.Text.Json.JsonSerializer.Deserialize<TransactionHistory>(requestBody);
        if (transactionData == null)
        {
            return Results.BadRequest("Invalid request data");
        }
        using (var financeContext = new GoalsContext(new DbContextOptionsBuilder<GoalsContext>().UseSqlite("Data Source=FinanceApp.db").Options))
        {
            financeContext.TransactionHistories.Add(transactionData);
            await financeContext.SaveChangesAsync();
            financeContext.Database.ExecuteSqlRaw("PRAGMA wal_checkpoint;");
        }
        return Results.Created($"/transactions/{transactionData.Id}", transactionData);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Exception occurred: " + ex.ToString());
        return Results.BadRequest($"Error adding transaction: {ex.Message}");
    }
}).WithName("PostTransaction").WithOpenApi();

app.MapGet("/accounts/{accountId}/transactions", async (HttpContext context, GoalsContext dbContext) =>
{
    try
    {
        var accountId = context.Request.RouteValues["accountId"] as string;
        
        if (!int.TryParse(accountId, out int accountIdInt))
        {
            return Results.BadRequest("Invalid account ID");
        }
        var transactions = await dbContext.TransactionHistories
            .Where(t => t.Account.Id == accountIdInt)
            .ToListAsync();

        return Results.Ok(transactions);
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error fetching transaction history: {ex.Message}");
    }
}).WithName("GetTransactions").WithOpenApi();

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
