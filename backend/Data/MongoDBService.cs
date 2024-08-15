using MongoDB.Driver;
using MongoDB.Bson;
using backend.Models;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class MongoDBService
    {
        private readonly IMongoCollection<Building> _buildings;

        public MongoDBService(IOptions<MongoDbSettings> mongoDbSettings, IMongoClient mongoClient)
        {
            try
            {
                var database = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
                _buildings = database.GetCollection<Building>(mongoDbSettings.Value.BuildingsCollectionName);


                var result = mongoClient.ListDatabaseNames().Any();
                if (result)
                {
                    Console.WriteLine("Connected to MongoDB successfully.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect to MongoDB: {ex.Message}");
                throw;
            }
        }

        public async Task<List<Building>> GetBuildingsAsync()
        {
            return await _buildings.Find(b => true).ToListAsync();
        }

        public async Task<Building> GetBuildingByIdAsync(string id)
        {
            var objectId = new ObjectId(id);
            return await _buildings.Find<Building>(b => b.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Building> AddBuildingAsync(Building building)
        {
            await _buildings.InsertOneAsync(building);
            return building;
        }

        public async Task<Building> GetBuildingByTypeAndUserIdAsync(string buildingType, int userId)
        {
            return await _buildings.Find<Building>(b => b.BuildingType == buildingType && b.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateBuildingAsync(string id, Building buildingIn)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                Console.WriteLine("Invalid ObjectId format.");
                return false;
            }

            buildingIn.Id = objectId.ToString();

            var result = await _buildings.ReplaceOneAsync(b => b.Id == objectId.ToString(), buildingIn);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                Console.WriteLine("Building updated successfully.");
                return true;
            }
            else
            {
                Console.WriteLine("Building update failed or no changes made.");
                return false;
            }
        }

        public async Task<bool> RemoveBuildingAsync(string id)
        {


            var result = await _buildings.DeleteOneAsync(b => b.Id == id);

            if (result.IsAcknowledged && result.DeletedCount > 0)
            {
                Console.WriteLine("Building removed successfully.");
                return true;
            }
            else
            {
                Console.WriteLine("Building removal failed or building not found.");
                return false;
            }
        }

        public async Task<Building> GetBuildingByTypeAsync(string buildingType)
        {
            return await _buildings.Find<Building>(b => b.BuildingType == buildingType).FirstOrDefaultAsync();
        }

        public async Task<List<Building>> GetBuildingsByUserIdAsync(int userId)
        {
            return await _buildings.Find<Building>(b => b.UserId == userId).ToListAsync();
        }
    }
}
