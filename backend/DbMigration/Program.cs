using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

// First, create a class for the ToDoItem entity if needed
namespace ToDoListApp.Domain.Entities
{
    public class ToDoItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string? UserId { get; set; }
    }
}

// Create a direct implementation of the DbContext
public class ToDoDbContext : DbContext
{
    public DbSet<ToDoListApp.Domain.Entities.ToDoItem> ToDoItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Database=todolistapp;Username=kelly;Password=Kevis1234@");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ToDoListApp.Domain.Entities.ToDoItem>(entity => 
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Creating database and tables...");
        
        using (var context = new ToDoDbContext())
        {
            // Make sure database is created
            context.Database.EnsureCreated();
            
            Console.WriteLine("Database and tables created successfully.");
            
            // Add a sample item to test
            if (!context.ToDoItems.Any())
            {
                context.ToDoItems.Add(new ToDoListApp.Domain.Entities.ToDoItem 
                { 
                    Title = "Sample Todo", 
                    Description = "This is a sample todo item", 
                    CreatedDate = DateTime.UtcNow 
                });
                
                context.SaveChanges();
                Console.WriteLine("Sample item added.");
            }
            else
            {
                Console.WriteLine("Database already has todo items.");
                var count = context.ToDoItems.Count();
                Console.WriteLine($"Current count: {count}");
            }
        }
    }
}