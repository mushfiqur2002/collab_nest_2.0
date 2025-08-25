import { bottomBarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

function BottomBar() {
    const {pathname} = useLocation();
    return (
        <section className="bottom-bar">
            <ul className="flex justify-between list-none p-0 m-0 w-full">
                {bottomBarLinks.map(({ path, label, icon: Icon }) => {
                    const isActive = pathname === path;

                    return (
                        <li
                            key={label}
                            className={`px-6 py-4 ${isActive ? "bg-blue-500 text-white flex-center" : ""
                                }`}
                        >
                            <Link
                                to={path}
                                className="flex flex-col flex-center"
                            >
                                <Icon className="w-6 h-6" />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    )
}

export default BottomBar
