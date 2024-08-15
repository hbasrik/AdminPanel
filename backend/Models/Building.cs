using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Models
{
    public class Building
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("BuildingType")]
        public string? BuildingType { get; set; }

        [BsonElement("BuildingCost")]
        public decimal BuildingCost { get; set; }

        [BsonElement("ConstructionTime")]
        public int ConstructionTime { get; set; }
        public int UserId { get; set; }
    }
}