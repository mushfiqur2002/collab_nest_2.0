import { Outlet, Navigate } from "react-router-dom";
function PrivateLayout({ isAuntenticated }: { isAuntenticated: Boolean }) {
    return isAuntenticated ? (
        <Navigate to='/' />
    ) : (
        <>
            <section className="private flex flex-col items-center justify-start w-full">
                <Outlet />
            </section>
        </>
    )

}

export default PrivateLayout
