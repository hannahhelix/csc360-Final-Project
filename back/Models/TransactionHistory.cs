namespace back;

public class TransactionHistory{
    public int Id { get; set; }
    public int SavingsGoalId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
}