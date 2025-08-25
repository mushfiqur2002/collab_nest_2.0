import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SigninValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useSignInUserAccMutation } from "@/lib/react-query/queryandmutation";
import { account } from "@/lib/appwrite/config";
import Loader from "@/components/shared/Loader";
import { useAlert } from "@/context/AlertContext";

function SignInForm() {
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { mutateAsync: signInAccount, isPending: isSignIn } = useSignInUserAccMutation();
    const { showError, showSuccess, showLoading } = useAlert();
    
    useEffect(() => {
        if (isSignIn) {
            showLoading();
        }
    },[signInAccount, isSignIn, showLoading]);

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        try {
            // 🔹 Always log out any old session first
            await account.deleteSession("current").catch(() => null);

            // 🔹 Try signing in
            const session = await signInAccount({
                email: values.email,
                password: values.password,
            });

            if (!session) {
                showError("Invalid email or password.");
                return;
            }

            // 🔹 Double-check with server that user data exists
            const isLoggedIn = await checkAuthUser();
            if (!isLoggedIn) {
                // Session exists but user fetch failed — treat as invalid login
                await account.deleteSession("current").catch(() => null);
                showError("Invalid email or password.");
                return;
            }

            // 🔹 Success
            showSuccess("Sign in successful! Redirecting...");
            form.reset();
            setTimeout(() => {
                navigate('/')
            },3000);
        } catch (err) {
            showError("Invalid email or password.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-start w-full gap-5 p-12">
            <div>
                <img
                    src="/public/assets/dark-mode-logo.png"
                    alt="Collab Nest Logo"
                    className="h-12 mb-4 mx-auto"
                />
                <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
                <p className="text-md text-gray-600 text-center mb-6">
                    Welcome to collabnest. Now you can collaborate with others.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 flex flex-col justify-center items-center w-full max-w-[400px]"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="text"
                                        placeholder="Enter your email..." {...field}
                                        className="shad-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password"
                                        placeholder="Enter your password..." {...field}
                                        className="shad-input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="capitalize bg-primary-600 text-white w-full"
                        type="submit"
                        disabled={isSignIn || isUserLoading}
                    >
                        {isSignIn || isUserLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
            </Form>

            <p className="text-sm text-gray-600">
                If you have no account{" "}
                <Link to={"/sign-up"} className="text-primary-600 text-md font-bold">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default SignInForm;
