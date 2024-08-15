namespace backend.Data
{
    public class MongoDbSettings
    {
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? BuildingsCollectionName { get; set; }
    }
}