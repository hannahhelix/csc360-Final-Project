namespace back;
using Microsoft.EntityFrameworkCore;
public class LoginContext : DbContext
{
    public LoginContext(DbContextOptions<LoginContext> options) : base(options)
    {
    }
    public DbSet<Login> Logins {get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=LoginDb.db");
    }
}