namespace back;

public class GoalMarkers{
    public int Id { get; set; }
    public int SavingsGoalId { get; set; }
    public SavingsGoals SavingsGoal { get; set; }
    public string Month { get; set; }
    public decimal Amount { get; set; }
    public bool IsCheckedOff { get; set; }
}