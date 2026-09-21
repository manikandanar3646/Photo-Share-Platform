function StatCard({title, value, description})
{
    return(
        <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
                {title}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {value}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                {description}
            </p>
        </div>
    )
}
export default StatCard