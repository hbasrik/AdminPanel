using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        // public DbSet<Building> BuildingConfigurations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.Username, u.Email })
                .IsUnique();

            // modelBuilder.Entity<Building>()
            //     .HasIndex(b => b.BuildingType)
            //     .IsUnique();
        }
    }
}
