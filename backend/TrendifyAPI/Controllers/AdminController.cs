using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrendifyAPI.Data;
using TrendifyAPI.DTOs;
using TrendifyAPI.Models;

namespace TrendifyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly TrendifyDbContext _context;

        public AdminController(TrendifyDbContext context)
        {
            _context = context;
        }

        // User Management
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var users = await _context.Users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Username = u.Username,
                    Role = u.Role,
                    IsEmailVerified = u.IsEmailVerified,
                    CompanyName = u.CompanyName,
                    IsSellerApproved = u.IsSellerApproved,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(MapToUserDto(user));
        }

        [HttpPut("users/{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] AdminUserManagementDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(updateDto.FirstName))
                user.FirstName = updateDto.FirstName;
            
            if (!string.IsNullOrEmpty(updateDto.LastName))
                user.LastName = updateDto.LastName;
            
            if (!string.IsNullOrEmpty(updateDto.Email))
                user.Email = updateDto.Email;
            
            if (!string.IsNullOrEmpty(updateDto.Role))
                user.Role = updateDto.Role;
            
            if (updateDto.IsEmailVerified.HasValue)
                user.IsEmailVerified = updateDto.IsEmailVerified.Value;

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToUserDto(user));
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            // Don't allow deleting other admins
            if (user.Role == "Admin")
                return BadRequest("Cannot delete admin users");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Seller Approval
        [HttpGet("sellers/pending")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetPendingSellers()
        {
            var pendingSellers = await _context.Users
                .Where(u => u.Role == "Seller" && !u.IsSellerApproved)
                .Select(u => MapToUserDto(u))
                .ToListAsync();

            return Ok(pendingSellers);
        }

        [HttpPost("sellers/approve")]
        public async Task<ActionResult> ApproveSeller([FromBody] SellerApprovalDto approvalDto)
        {
            var seller = await _context.Users.FindAsync(approvalDto.SellerId);
            if (seller == null || seller.Role != "Seller")
                return NotFound("Seller not found");

            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            seller.IsSellerApproved = approvalDto.IsApproved;
            seller.ApprovedByAdminId = adminId;
            seller.SellerApprovedAt = DateTime.UtcNow;
            seller.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log activity
            await LogActivity(adminId, "SellerApproval", "User", seller.Id, 
                $"Seller {(approvalDto.IsApproved ? "approved" : "rejected")}: {seller.CompanyName}");

            return Ok(new { message = $"Seller {(approvalDto.IsApproved ? "approved" : "rejected")} successfully" });
        }

        // Statistics and Reporting
        [HttpGet("statistics")]
        public async Task<ActionResult> GetStatistics()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var totalSellers = await _context.Users.CountAsync(u => u.Role == "Seller");
            var approvedSellers = await _context.Users.CountAsync(u => u.Role == "Seller" && u.IsSellerApproved);
            var pendingSellers = await _context.Users.CountAsync(u => u.Role == "Seller" && !u.IsSellerApproved);
            var totalProducts = await _context.Products.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => o.Total);

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalCustomers = totalCustomers,
                TotalSellers = totalSellers,
                ApprovedSellers = approvedSellers,
                PendingSellers = pendingSellers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue
            });
        }

        // Activity Logs
        [HttpGet("activity-logs")]
        public async Task<ActionResult<IEnumerable<ActivityLog>>> GetActivityLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var logs = await _context.ActivityLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(logs);
        }

        // CMS Page Management
        [HttpGet("cms-pages")]
        public async Task<ActionResult<IEnumerable<CmsPageDto>>> GetCmsPages()
        {
            var pages = await _context.CmsPages
                .Include(p => p.CreatedByAdmin)
                .Select(p => new CmsPageDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Slug = p.Slug,
                    Content = p.Content,
                    MetaDescription = p.MetaDescription,
                    MetaKeywords = p.MetaKeywords,
                    IsPublished = p.IsPublished,
                    CreatedByAdminId = p.CreatedByAdminId,
                    CreatedByAdminName = p.CreatedByAdmin != null ? $"{p.CreatedByAdmin.FirstName} {p.CreatedByAdmin.LastName}" : null,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(pages);
        }

        [HttpGet("cms-pages/{id}")]
        public async Task<ActionResult<CmsPageDto>> GetCmsPage(int id)
        {
            var page = await _context.CmsPages
                .Include(p => p.CreatedByAdmin)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (page == null)
                return NotFound();

            var pageDto = new CmsPageDto
            {
                Id = page.Id,
                Title = page.Title,
                Slug = page.Slug,
                Content = page.Content,
                MetaDescription = page.MetaDescription,
                MetaKeywords = page.MetaKeywords,
                IsPublished = page.IsPublished,
                CreatedByAdminId = page.CreatedByAdminId,
                CreatedByAdminName = page.CreatedByAdmin != null ? $"{page.CreatedByAdmin.FirstName} {page.CreatedByAdmin.LastName}" : null,
                CreatedAt = page.CreatedAt,
                UpdatedAt = page.UpdatedAt
            };

            return Ok(pageDto);
        }

        [HttpPost("cms-pages")]
        public async Task<ActionResult<CmsPageDto>> CreateCmsPage([FromBody] CreateCmsPageDto createDto)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            // Check if slug already exists
            if (await _context.CmsPages.AnyAsync(p => p.Slug == createDto.Slug))
            {
                return BadRequest("A page with this slug already exists");
            }

            var page = new CmsPage
            {
                Title = createDto.Title,
                Slug = createDto.Slug,
                Content = createDto.Content,
                MetaDescription = createDto.MetaDescription,
                MetaKeywords = createDto.MetaKeywords,
                IsPublished = createDto.IsPublished,
                CreatedByAdminId = adminId,
                UpdatedByAdminId = adminId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CmsPages.Add(page);
            await _context.SaveChangesAsync();

            await LogActivity(adminId, "CreateCmsPage", "CmsPage", page.Id, $"Created CMS page: {page.Title}");

            return CreatedAtAction(nameof(GetCmsPage), new { id = page.Id }, MapToCmsPageDto(page));
        }

        [HttpPut("cms-pages/{id}")]
        public async Task<ActionResult<CmsPageDto>> UpdateCmsPage(int id, [FromBody] UpdateCmsPageDto updateDto)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var page = await _context.CmsPages.FindAsync(id);

            if (page == null)
                return NotFound();

            // Check if slug already exists (excluding current page)
            if (!string.IsNullOrEmpty(updateDto.Slug) && updateDto.Slug != page.Slug)
            {
                if (await _context.CmsPages.AnyAsync(p => p.Slug == updateDto.Slug && p.Id != id))
                {
                    return BadRequest("A page with this slug already exists");
                }
            }

            if (!string.IsNullOrEmpty(updateDto.Title))
                page.Title = updateDto.Title;

            if (!string.IsNullOrEmpty(updateDto.Slug))
                page.Slug = updateDto.Slug;

            if (!string.IsNullOrEmpty(updateDto.Content))
                page.Content = updateDto.Content;

            if (updateDto.MetaDescription != null)
                page.MetaDescription = updateDto.MetaDescription;

            if (updateDto.MetaKeywords != null)
                page.MetaKeywords = updateDto.MetaKeywords;

            if (updateDto.IsPublished.HasValue)
                page.IsPublished = updateDto.IsPublished.Value;

            page.UpdatedByAdminId = adminId;
            page.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await LogActivity(adminId, "UpdateCmsPage", "CmsPage", page.Id, $"Updated CMS page: {page.Title}");

            return Ok(MapToCmsPageDto(page));
        }

        [HttpDelete("cms-pages/{id}")]
        public async Task<ActionResult> DeleteCmsPage(int id)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var page = await _context.CmsPages.FindAsync(id);

            if (page == null)
                return NotFound();

            _context.CmsPages.Remove(page);
            await _context.SaveChangesAsync();

            await LogActivity(adminId, "DeleteCmsPage", "CmsPage", page.Id, $"Deleted CMS page: {page.Title}");

            return NoContent();
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

        private CmsPageDto MapToCmsPageDto(CmsPage page)
        {
            return new CmsPageDto
            {
                Id = page.Id,
                Title = page.Title,
                Slug = page.Slug,
                Content = page.Content,
                MetaDescription = page.MetaDescription,
                MetaKeywords = page.MetaKeywords,
                IsPublished = page.IsPublished,
                CreatedByAdminId = page.CreatedByAdminId,
                CreatedAt = page.CreatedAt,
                UpdatedAt = page.UpdatedAt
            };
        }

        private async Task LogActivity(int userId, string action, string? entityType = null, int? entityId = null, string? description = null)
        {
            var log = new ActivityLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Description = description,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
