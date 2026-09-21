import Sidebar from '../components/Sidebar'
function AdminLayout({children})
{
    return(
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1">
                <header className="h-16 bg-white border-b flex items-center px-6">
                    <h1 className="text-lg font-semibold">
                        Admin Panel
                    </h1>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
export default AdminLayout