import {
    ClipboardList,
    Clock,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

function WorkerProjectView() {
    return (
        <div className="w-full">

            <div className="header">
                <h2 className="text-xl font-semibold py-2">My Tasks</h2>
            </div>
            {/* cards  */}
            <div className="task-card py-2 flex flex-wrap gap-4">
                {/* Total Tasks */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Total Tasks</p>
                        <p className="text-2xl font-bold">12</p>
                    </div>
                </div>

                {/* In Progress */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">In Progress</p>
                        <p className="text-2xl font-bold">4</p>
                    </div>
                </div>

                {/* Completed */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Completed</p>
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

            {/* list of tasks */}
            <div className="w-full">
                <div className="header">
                    <h2 className="text-xl font-semibold py-2">Task List</h2>
                </div>
                <div className="task-card py-2 flex flex-wrap gap-4">

                </div>
            </div>
        </div>
    )
};

export default WorkerProjectView
