import { createContext, useContext, useState } from "react";

type AlertContextType = {
    successMsg: string;
    errorMsg: string;
    loading: boolean;
    showSuccess: (msg: string) => void;
    showError: (msg: string) => void;
    clear: () => void;
    showLoading: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setIsLoading] = useState(false);

    const showSuccess = (msg: string) => {
        setIsLoading(false);
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const showError = (msg: string) => {
        setIsLoading(false);
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 3000);
    };

    const showLoading = () => {
        setIsLoading(true);
        setSuccessMsg("");
        setErrorMsg("");
    }
    const clear = () => {
        setIsLoading(false);
        setSuccessMsg("");
        setErrorMsg("");
    };

    return (
        <AlertContext.Provider
            value={{ successMsg, errorMsg, loading, showSuccess, showError, clear, showLoading }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
    return ctx;
};
