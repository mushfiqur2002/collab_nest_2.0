import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
import { useSignOutUserAccMutation } from "@/lib/react-query/queryandmutation";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

function TopBar() {
    const navigate = useNavigate();
    const { mutateAsync: signOut, isSuccess } = useSignOutUserAccMutation();
    const { showSuccess, showLoading } = useAlert();
    const { user } = useUserContext();
    const handleSignOut = async () => {
        showLoading();
        await signOut();
    };

    useEffect(() => {
        if (isSuccess) {
            showSuccess("Sign out successful! Redirecting...");
            const timer = setTimeout(() => {
                navigate(0); // reload after showing message
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate, showSuccess]);
    //recruiter
    const userCategory = user.category;


    return (
        <section className="topbar flex flex-col justify-between items-center bg-gray-800 text-white px-4 py-0">
            <div className="w-full flex flex-between py-4 px-2">
                <div className="flex gap-2">
                    <Link to="/">
                        <img
                            src="/public/assets/dark-mode-logo.png"
                            alt="logo"
                            className="w-full h-8"
                        />
                    </Link>
                    <div className={`flex flex-center text-dark-4 p-1 px-3 rounded-full ${userCategory === 'recruiter' ? 'bg-green-1' : 'bg-sky-600'}`}>
                        <p className="capitalize">{userCategory}</p>
                    </div>
                </div>

                <div className="flex flex-center gap-2">
                    <Link to={`/profile/${user?.accountID}`}
                    >
                        <img
                            src={`${user.avatarURL}`}
                            alt="user avatar"
                            className="w-9 h-9 rounded-full" />
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={() => handleSignOut()}
                        className="flex-center bg-primary-600 w-9 h-9 rounded-full">
                        <LogOut className="text-white-500" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default TopBar;

