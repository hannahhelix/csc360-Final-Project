namespace back;

using System;
using System.Security.Cryptography;
using System.Text;

public class Login{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Base64Credentials { get; set; }
    public string Hash { get; set; }

    public Login(string username, string password){
        this.Id = RandomNumberGenerator.GetInt32(1000);
        Username = username;
        Password = password;
        this.Base64Credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(username + ":" + password));
        var byteCredentials = Convert.FromBase64String(this.Base64Credentials);
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(byteCredentials);
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            this.Hash = builder.ToString();
        }
    }

}