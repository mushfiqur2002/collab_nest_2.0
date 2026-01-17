import {
    ClipboardList,
    CheckCircle,
    AlertTriangle,
    List,
    SquareChartGantt
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
function AdminProjectView() {
    return (
        <div className='flex flex-col gap-3'>
            <div className="task-card py-2 flex flex-wrap gap-4">
                {/* Total Tasks */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Total Projects</p>
                        <p className="text-2xl font-bold">12</p>
                    </div>
                </div>

                {/* In Progress */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <List className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Total Tasks</p>
                        <p className="text-2xl font-bold">4</p>
                    </div>
                </div>

                {/* Completed */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Submited</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                </div>

                {/* Overdue */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Overdue</p>
                        <p className="text-2xl font-bold">2</p>
                    </div>
                </div>
            </div>
            <div className='project-table'>
                <div className='header'>
                    <span className="text-xl font-semibold py-2 flex flex-start gap-1">
                        <SquareChartGantt />
                        <p className="text-2xl capitalize">project table</p>
                    </span>
                </div>
                <div className='table'>
                    <Table className='bg-dark-3 w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Project Name</TableHead>
                                <TableHead>Tasks</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className='tasks-table'>
                <div className='header'>
                    <span className="text-xl font-semibold py-2 flex flex-start gap-1">
                        <SquareChartGantt />
                        <p className="text-2xl capitalize">tasks table</p>
                    </span>
                </div>
                <div className='table'>
                    <Table className='bg-dark-3 w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Task Name</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>File</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminProjectView
