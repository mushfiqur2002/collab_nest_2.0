import { Outlet, Navigate } from "react-router-dom";
function AuthLayout() {
    const isAuntenticated = false;

    return (
        <>
            {isAuntenticated ? (
                <Navigate to='/' />
            ) : (
                <>
                    <section className="flex flex-col items-center justify-center w-full">
                        <Outlet />
                    </section>
                </>
            )
            }
        </>
    )
}

export default AuthLayout
