namespace back;
using Microsoft.EntityFrameworkCore;

public class GoalsContext : DbContext
{
    public GoalsContext(DbContextOptions<GoalsContext> options) : base(options)
    {
    }

    public DbSet<SavingsGoals> SavingsGoals { get; set; }
    public DbSet<TransactionHistory> TransactionHistories { get; set; }
    public DbSet<GoalMarkers> GoalMarkers { get; set; }
    public DbSet<BudgetGoals> BudgetGoals { get; set; }
    public DbSet<Account> Accounts { get; set; }


    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //     optionsBuilder.UseSqlite("Data Source=FinanceApp.db");
    // }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships and constraints here if needed

        modelBuilder.Entity<SavingsGoals>()
            .HasOne<Account>()
            .WithMany(a => a.SavingsGoalsList)
            .HasForeignKey(sg => sg.AccountId);

        modelBuilder.Entity<TransactionHistory>()
            .HasOne<SavingsGoals>()
            .WithMany(sg => sg.TransactionHistories)
            .HasForeignKey(th => th.SavingsGoalId);

        modelBuilder.Entity<GoalMarkers>()
            .HasOne<SavingsGoals>()
            .WithMany(sg => sg.GoalMarkersList)
            .HasForeignKey(gm => gm.SavingsGoalId);

        modelBuilder.Entity<BudgetGoals>()
            .HasOne<Account>()
            .WithMany(a => a.BudgetGoalsList)
            .HasForeignKey(bg => bg.AccountId);
    }
}