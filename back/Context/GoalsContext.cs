namespace back;
using Microsoft.EntityFrameworkCore;

public class GoalsContext : DbContext
{
    public GoalsContext(DbContextOptions<GoalsContext> options) : base(options)  {  }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<BudgetGoals> BudgetGoals { get; set; }
    public DbSet<SavingsGoals> SavingsGoals { get; set; }
    public DbSet<TransactionHistory> TransactionHistories { get; set; }
    public DbSet<GoalMarkers> GoalMarkers { get; set; }

}