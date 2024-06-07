namespace back;
public class BudgetGoals{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal GoalAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public int AccountId { get; set; }
    public Account Account { get; set; }
}