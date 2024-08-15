using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BuildingController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;

    public BuildingController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddBuilding([FromBody] Building building)
    {
        Console.WriteLine($"Attempting to add new building: Type = {building.BuildingType}, Cost = {building.BuildingCost}, Time = {building.ConstructionTime}");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the current user's ID from MySQL
        building.UserId = int.Parse(userId);

        if (string.IsNullOrWhiteSpace(building.BuildingType))
        {
            return BadRequest("BuildingType cannot be null or empty.");
        }

        var existingBuilding = await _mongoDBService.GetBuildingByTypeAndUserIdAsync(building.BuildingType, building.UserId);
        if (existingBuilding != null)
        {
            return BadRequest("BuildingType already exists for this user.");
        }

        if (building.BuildingCost <= 0 || building.ConstructionTime < 30 || building.ConstructionTime > 1800)
        {
            return BadRequest("Invalid building configuration.");
        }

        var addedBuilding = await _mongoDBService.AddBuildingAsync(building);
        return Ok(addedBuilding);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetBuildings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var buildings = await _mongoDBService.GetBuildingsByUserIdAsync(int.Parse(userId));

        return Ok(buildings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBuilding(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return BadRequest("Invalid building ID format.");
        }

        var building = await _mongoDBService.GetBuildingByIdAsync(objectId.ToString());

        if (building == null)
        {
            return NotFound("Building not found.");
        }

        return Ok(building);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateBuilding(string id, [FromBody] Building buildingIn)
    {
        Console.WriteLine($"trying to update building with id: {id}");


        if (!ObjectId.TryParse(id, out var objectId))
        {
            Console.WriteLine("Invalid ObjectId: " + id);
            return BadRequest("Invalid building ID format.");
        }

        // setting the correct objectId on the incoming building object
        buildingIn.Id = objectId.ToString();

        var existingBuilding = await _mongoDBService.GetBuildingByIdAsync(objectId.ToString());
        if (existingBuilding == null)
        {
            Console.WriteLine("Building not found with ObjectId: " + objectId);
            return NotFound("Building not found.");
        }

        if (buildingIn.BuildingCost <= 0 || buildingIn.ConstructionTime < 30 || buildingIn.ConstructionTime > 1800)
        {
            Console.WriteLine("Invalid building configuration: " +
                $"BuildingCost: {buildingIn.BuildingCost}, ConstructionTime: {buildingIn.ConstructionTime}");
            return BadRequest("Invalid building configuration.");
        }


        var updated = await _mongoDBService.UpdateBuildingAsync(objectId.ToString(), buildingIn);
        if (updated)
        {
            Console.WriteLine("Building updated successfully with ObjectId: " + objectId);
            return Ok(buildingIn);
        }

        Console.WriteLine("Failed to update building with ObjectId: " + objectId);
        return BadRequest("Failed to update building.");
    }


    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> RemoveBuilding(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            Console.WriteLine("Invalid ObjectId: " + id);
            return BadRequest("Invalid building ID format.");
        }


        Console.WriteLine($"trying to delete building with id: {id}");
        var existingBuilding = await _mongoDBService.GetBuildingByIdAsync(objectId.ToString());
        if (existingBuilding == null)
        {
            return NotFound("Building not found.");
        }

        var removed = await _mongoDBService.RemoveBuildingAsync(objectId.ToString());
        if (removed)
        {
            return Ok("Building removed successfully.");
        }

        return BadRequest("Failed to remove building.");
    }
}
