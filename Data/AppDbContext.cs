using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Models;

namespace Photo_Share_Platform.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<EventMember> EventMembers { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Gallery> Galleries { get; set; }

        public DbSet<GalleryPhoto> GalleryPhotos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User → Events created by the user
            modelBuilder.Entity<Event>()
                .HasOne(e => e.CreatedByUser)
                .WithMany(u => u.CreatedEvents)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Event → EventMembers
            modelBuilder.Entity<EventMember>()
                .HasOne(em => em.Event)
                .WithMany(e => e.EventMembers)
                .HasForeignKey(em => em.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // User → EventMembers
            modelBuilder.Entity<EventMember>()
                .HasOne(em => em.User)
                .WithMany(u => u.EventMembers)
                .HasForeignKey(em => em.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Event → Photos
            modelBuilder.Entity<Photo>()
                .HasOne(p => p.Event)
                .WithMany(e => e.Photos)
                .HasForeignKey(p => p.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // User → Photos
            modelBuilder.Entity<Photo>()
                .HasOne(p => p.UploadedByUser)
                .WithMany(u => u.UploadedPhotos)
                .HasForeignKey(p => p.UploadedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Event → Galleries
            modelBuilder.Entity<Gallery>()
                .HasOne(g => g.Event)
                .WithMany(e => e.Galleries)
                .HasForeignKey(g => g.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Gallery → GalleryPhotos
            modelBuilder.Entity<GalleryPhoto>()
                .HasOne(gp => gp.Gallery)
                .WithMany(g => g.GalleryPhotos)
                .HasForeignKey(gp => gp.GalleryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Photo → GalleryPhotos
            modelBuilder.Entity<GalleryPhoto>()
                .HasOne(gp => gp.Photo)
                .WithMany(p => p.GalleryPhotos)
                .HasForeignKey(gp => gp.PhotoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate event membership
            modelBuilder.Entity<EventMember>()
                .HasIndex(em => new { em.EventId, em.UserId })
                .IsUnique();

            // Gallery token must be unique
            modelBuilder.Entity<Gallery>()
                .HasIndex(g => g.Token)
                .IsUnique();
        }
    }
}