using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EliteShopAPI.Data;
using EliteShopAPI.DTOs;
using EliteShopAPI.Models;

namespace EliteShopAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly EliteShopDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(EliteShopDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                throw new InvalidOperationException("Username already exists");
            }

            // Validate seller registration
            if (registerDto.Role == "Seller" && string.IsNullOrEmpty(registerDto.CompanyName))
            {
                throw new InvalidOperationException("Company name is required for seller registration");
            }

            // Hash password
            var passwordHash = HashPassword(registerDto.Password);

            // Create user
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                Username = registerDto.Username,
                PasswordHash = passwordHash,
                PhoneNumber = registerDto.PhoneNumber,
                Role = registerDto.Role,
                CompanyName = registerDto.CompanyName,
                CompanyLogo = registerDto.CompanyLogo,
                IsSellerApproved = registerDto.Role != "Seller", // Auto-approve non-sellers
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user.Id, user.Email, user.Role);
            var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpirationInMinutes"]!));

            return new AuthResponseDto
            {
                Token = token,
                User = MapToUserDto(user),
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            
            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user.Id, user.Email, user.Role);
            var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpirationInMinutes"]!));

            return new AuthResponseDto
            {
                Token = token,
                User = MapToUserDto(user),
                ExpiresAt = expiresAt
            };
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            return MapToUserDto(user);
        }

        public async Task<UserDto> UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (!string.IsNullOrEmpty(updateUserDto.FirstName))
                user.FirstName = updateUserDto.FirstName;
            
            if (!string.IsNullOrEmpty(updateUserDto.LastName))
                user.LastName = updateUserDto.LastName;
            
            if (!string.IsNullOrEmpty(updateUserDto.PhoneNumber))
                user.PhoneNumber = updateUserDto.PhoneNumber;
            
            if (!string.IsNullOrEmpty(updateUserDto.Avatar))
                user.Avatar = updateUserDto.Avatar;

            if (!string.IsNullOrEmpty(updateUserDto.CompanyName))
                user.CompanyName = updateUserDto.CompanyName;

            if (!string.IsNullOrEmpty(updateUserDto.CompanyLogo))
                user.CompanyLogo = updateUserDto.CompanyLogo;

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (!VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Current password is incorrect");
            }

            user.PasswordHash = HashPassword(changePasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public string GenerateJwtToken(int userId, string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationInMinutes"]!)),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            var hashBytes = Convert.FromBase64String(hashedPassword);
            var salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return false;
            }

            return true;
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                Avatar = user.Avatar,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                CompanyName = user.CompanyName,
                CompanyLogo = user.CompanyLogo,
                IsSellerApproved = user.IsSellerApproved,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
