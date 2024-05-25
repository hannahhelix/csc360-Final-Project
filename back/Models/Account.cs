namespace back;

public class Account{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public decimal InitialSavingsBalance { get; set; }
    public List<SavingsGoals> SavingsGoalsList { get; set; }
    public List<BudgetGoals> BudgetGoalsList { get; set; }
}