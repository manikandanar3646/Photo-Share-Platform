function EventCard({name, date, location, photos})
{
    return(
        <div className="bg-white border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900">
                {name}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
                {date}
            </p>
            <p className="text-sm text-gray-500">
                {location}
            </p>
            <div className="mt-4">
                <span className="text-sm font-medium">
                    {photos} photos
                </span>
            </div>
        </div>
    )
}
export default EventCard