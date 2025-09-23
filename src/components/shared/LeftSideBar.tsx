import { navLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAlert } from "@/context/AlertContext";
import { useSignOutUserAccMutation } from "@/lib/react-query/queryandmutation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

function LeftSideBar() {
    const { user } = useUserContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { showSuccess, showLoading } = useAlert();
    const { mutateAsync: signOut, isSuccess } = useSignOutUserAccMutation();

    useEffect(() => {
        if (isSuccess) {
            showSuccess("Sign out successful! Redirecting...");
            const timer = setTimeout(() => {
                navigate(0); // reload after showing message
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, showSuccess]);

    const handleSignOut = async () => {
        showLoading();
        await signOut();
    };

    const userCategory = user.category;
    return (
        <nav className="leftsidebar gap-4 h-full bg-gray-900">
            {/* logo image */}
            <div className="flex gap-2">
                <Link to="/">
                    <img
                        src="../../../public/assets/dark-mode-logo.png"
                        alt="logo"
                        className="w-full h-8"
                    />
                </Link>
                <div className={`md:w-8 md:h-8 flex flex-center text-dark-4 p-1 px-3 rounded-full ${userCategory === 'recruiter' ? 'bg-green-1' : 'bg-sky-600'}`}>
                </div>
            </div>
            {/* user info */}
            <div className="w-full flex flex-start flex-center gap-2 mt-4">
                <div>
                    <img src={`${user.avatarURL}`}
                        alt="user image"
                        className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex flex-col">
                    <h1 className="capitalize text-[18px] font-bold">{user.username}</h1>
                    <p className="text-[12px] text-light-3">{user.email}</p>
                </div>
            </div>
            {/* navigation links */}
            <div>
                <ul className="flex flex-col gap-2 mt-4">
                    {navLinks.map(({ path, label, icon: Icon }) => {
                        const isActive = pathname === path;

                        return (
                            <li
                                key={label}
                                className={`leftsidebar-link p-4 ${isActive ? "bg-blue-500 text-white" : ""
                                    }`}
                            >
                                <NavLink
                                    to={path}
                                    className="flex gap-2 items-center justify-start"
                                >
                                    <Icon className="w-4 h-4" />
                                    <p className="capitalize text-[14px]">{label}</p>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* signout button  */}
            <div className="mt-auto w-full flex justify-center">
                <Button
                    variant="ghost"
                    onClick={() => handleSignOut()}
                    className="flex-center bg-blue-500 w-full h-auto p-4 hover:bg-primary-600">
                    <LogOut className="w-8 h-8" />
                    <p className="capitalize text-[14px]">log out</p>
                </Button>
            </div>
        </nav>
    )
}

export default LeftSideBar
