using Supabase;
using Photo_Share_Platform.Interfaces;

namespace Photo_Share_Platform.Services
{
    public class SupabaseStorageService : IStorageService
    {
        private readonly Client _supabase;

        private const string BucketName = "photos";

        public SupabaseStorageService(IConfiguration configuration)
        {
            var url = configuration["Supabase:Url"];
            var secretKey = configuration["Supabase:SecretKey"];

            if (string.IsNullOrWhiteSpace(url))
                throw new InvalidOperationException(
                    "Supabase URL is not configured.");

            if (string.IsNullOrWhiteSpace(secretKey))
                throw new InvalidOperationException(
                    "Supabase secret key is not configured.");

            _supabase = new Client(url, secretKey);
        }

        private async Task InitializeAsync()
        {
            await _supabase.InitializeAsync();
        }

        public async Task<string> UploadAsync(
            Stream fileStream,
            string fileName,
            string contentType)
        {
            await InitializeAsync();

            var temporaryFile = Path.Combine(
                Path.GetTempPath(),
                Guid.NewGuid() + Path.GetExtension(fileName));

            try
            {
                await using (var output = new FileStream(
                    temporaryFile,
                    FileMode.Create,
                    FileAccess.Write))
                {
                    await fileStream.CopyToAsync(output);
                }

                await _supabase.Storage
                    .From(BucketName)
                    .Upload(temporaryFile, fileName);

                return fileName;
            }
            finally
            {
                if (File.Exists(temporaryFile))
                    File.Delete(temporaryFile);
            }
        }

        public async Task DeleteAsync(string fileName)
        {
            await InitializeAsync();

            await _supabase.Storage
                .From(BucketName)
                .Remove(fileName);
        }

        public async Task<string> GetPublicUrlAsync(string fileName)
        {
            await InitializeAsync();

            return _supabase.Storage
                .From(BucketName)
                .GetPublicUrl(fileName);
        }
    }
}