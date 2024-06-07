// using Microsoft.AspNetCore.Mvc;
// using System.Linq;
// using System.Security.Cryptography;
// using System.Text;
// using System.Threading.Tasks;

// namespace back.Controllers
// {
//     [ApiController]
//     [Route("auth")]
//     public class AuthController : ControllerBase
//     {
//         private readonly LoginContext _context;

//         public AuthController(LoginContext context)
//         {
//             _context = context;
//         }

//         [HttpPost("signup")]
//         public async Task<IActionResult> SignUp([FromBody] Login login)
//         {
//             if (_context.Logins.Any(l => l.Username == login.Username))
//             {
//                 return BadRequest("User already exists");
//             }

//             login.SetPassword(login.Password);
//             _context.Logins.Add(login);
//             await _context.SaveChangesAsync();
//             return Ok("User registered successfully");
//         }

//         [HttpPost("login")]
//         public IActionResult Login([FromBody] Login login)
//         {
//             // Handled by the authentication middleware
//             return Ok();
//         }
//     }
// }
