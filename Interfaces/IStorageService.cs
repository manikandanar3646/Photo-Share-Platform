namespace Photo_Share_Platform.Interfaces
{
    public interface IStorageService
    {
        Task<string> UploadAsync(
            Stream fileStream,
            string fileName,
            string contentType);

        Task DeleteAsync(string fileName);

        Task<string> GetPublicUrlAsync(string fileName);
    }
}