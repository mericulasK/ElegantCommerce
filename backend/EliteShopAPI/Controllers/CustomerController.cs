using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EliteShopAPI.Services;
using EliteShopAPI.DTOs;

namespace EliteShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<CustomerProfileDto>> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var profile = await _customerService.GetProfileAsync(userId);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPut("profile")]
        public async Task<ActionResult<CustomerProfileDto>> UpdateProfile([FromBody] UpdateCustomerProfileDto updateProfileDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var profile = await _customerService.UpdateProfileAsync(userId, updateProfileDto);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<CustomerDashboardDto>> GetDashboard()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var dashboard = await _customerService.GetDashboardAsync(userId);
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpGet("orders")]
        public async Task<ActionResult<List<CustomerOrderDto>>> GetOrders()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var orders = await _customerService.GetOrdersAsync(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpGet("orders/{orderId}")]
        public async Task<ActionResult<CustomerOrderDto>> GetOrder(int orderId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var order = await _customerService.GetOrderAsync(userId, orderId);
                return Ok(order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpGet("addresses")]
        public async Task<ActionResult<List<AddressDto>>> GetAddresses()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var addresses = await _customerService.GetAddressesAsync(userId);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPost("addresses")]
        public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressDto createAddressDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var address = await _customerService.CreateAddressAsync(userId, createAddressDto);
                return CreatedAtAction(nameof(GetAddresses), new { }, address);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPut("addresses/{addressId}")]
        public async Task<ActionResult<AddressDto>> UpdateAddress(int addressId, [FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var address = await _customerService.UpdateAddressAsync(userId, addressId, updateAddressDto);
                return Ok(address);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpDelete("addresses/{addressId}")]
        public async Task<ActionResult> DeleteAddress(int addressId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                await _customerService.DeleteAddressAsync(userId, addressId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPost("reviews")]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var review = await _customerService.CreateReviewAsync(userId, createReviewDto);
                return CreatedAtAction(nameof(GetProfile), new { }, review);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPost("returns")]
        public async Task<ActionResult<ReturnRequestDto>> CreateReturnRequest([FromBody] CreateReturnRequestDto createReturnDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var returnRequest = await _customerService.CreateReturnRequestAsync(userId, createReturnDto);
                return CreatedAtAction(nameof(GetProfile), new { }, returnRequest);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpGet("returns")]
        public async Task<ActionResult<List<ReturnRequestDto>>> GetReturnRequests()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var returns = await _customerService.GetReturnRequestsAsync(userId);
                return Ok(returns);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }
    }
}
