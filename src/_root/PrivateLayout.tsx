import { Outlet, Navigate } from "react-router-dom";
function PrivateLayout({ isAuntenticated }: { isAuntenticated: Boolean }) {
    return isAuntenticated ? (
        <Navigate to='/' />
    ) : (
        <>
            <section className="flex flex-col items-center justify-center w-full">
                <Outlet />
            </section>
        </>
    )

}

export default PrivateLayout
