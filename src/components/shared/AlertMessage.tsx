import { useEffect, useState } from "react";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Loader from "./Loader";
import { useAlert } from "@/context/AlertContext";

function AlertMessage({ duration = 3000 }: { duration?: number }) {
    const { successMsg, errorMsg, loading } = useAlert();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (successMsg) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), duration);
            return () => clearTimeout(timer);
        }
    }, [successMsg, duration]);

    useEffect(() => {
        if (errorMsg) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), duration);
            return () => clearTimeout(timer);
        }
    }, [errorMsg, duration]);

    return (
        <div>
            { loading && (
                <div className="w-full bg-gray-800 rounded-full border-2 border-gray-700 flex items-center justify-center gap-4 accordion-up p-4 mt-4">
                    <Loader />
                </div>
            )}
            {showSuccess && successMsg && (
                <Alert className="w-full max-w-[400px] bg-green-900 text-green-200 border-2 border-green-700 flex items-center justify-start gap-4 accordion-up mt-4">
                    <div>
                        <BadgeCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMsg}</AlertDescription>
                    </div>
                </Alert>
            )}

            {showError && errorMsg && (
                <Alert className="w-full max-w-[400px] bg-red-900 text-red-200 border-2 border-red-700 flex items-center justify-start gap-4 accordion-up mt-4">
                    <div>
                        <BadgeAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMsg}</AlertDescription>
                    </div>
                </Alert>
            )}
        </div>
    );
}

export default AlertMessage;
