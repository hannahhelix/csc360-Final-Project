namespace back;

public class SavingsGoals{
    public int Id { get; set; }
    public decimal CurrentSavingsBalance { get; set; }
    public decimal GoalAmount { get; set; }
    public int AccountId { get; set; }
    public Account Account { get; set; }
    public List<TransactionHistory> TransactionHistories { get; set; }
    public List<GoalMarkers> GoalMarkersList { get; set; }
}