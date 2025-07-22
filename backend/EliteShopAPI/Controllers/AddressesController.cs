using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EliteShopAPI.DTOs;
using EliteShopAPI.Services;

namespace EliteShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressesController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public AddressesController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddresses()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var addresses = await _orderService.GetUserAddressesAsync(userId);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressDto createAddressDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var address = await _orderService.CreateAddressAsync(userId, createAddressDto);
                return CreatedAtAction(nameof(GetAddresses), null, address);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AddressDto>> UpdateAddress(int id, [FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var address = await _orderService.UpdateAddressAsync(userId, id, updateAddressDto);
                return Ok(address);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAddress(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var result = await _orderService.DeleteAddressAsync(userId, id);
                if (!result)
                {
                    return NotFound(new { message = "Address not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }

        [HttpPost("{id}/set-default")]
        public async Task<ActionResult<AddressDto>> SetDefaultAddress(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var address = await _orderService.SetDefaultAddressAsync(userId, id);
                return Ok(address);
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
    }
}
