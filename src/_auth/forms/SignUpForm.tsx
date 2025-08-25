import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccMutation, useSignInUserAccMutation } from "@/lib/react-query/queryandmutation"
import { useUserContext } from "@/context/AuthContext"
import { useAlert } from "@/context/AlertContext"
import { useEffect } from "react"


function SignUpForm() {
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { showError, showSuccess, showLoading } = useAlert();
    const navigate = useNavigate();


    // for signup mutation 
    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccMutation();

    // for signin mutation
    const { mutateAsync: signInAccount, isPending: isSignIn } = useSignInUserAccMutation();

    useEffect(() => {
        if (isCreatingUser || isSignIn) {
            showLoading();
        }
    }, [isCreatingUser, isSignIn, showLoading])


    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            email: '',
            password: '',
            username: '',
        },
    })

    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const newUser = await createUserAccount(values);

        if (!newUser || newUser instanceof Error) {
            showError('Sign up failed. Please try again.');
            return;
        }
        showSuccess('Sign up successful! You can now sign in.');
        form.reset();

        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        // check sign in session or not 
        if (!session) {
            showError('Sign in failed. Please try again.');
            setTimeout(() => {
                form.reset();
                navigate('/sign-in');
            }, 3000);
            return
        }

        const isloggedIn = await checkAuthUser();

        if (isloggedIn) {
            form.reset();
            showSuccess("Sign in successful! Redirecting...");
            setTimeout(() => {
                form.reset();
                navigate('/');
            }, 3000);
        } else {
            return showError('Sign up failed. Please try again.')
        }

    }
    return (
        <>
            <div className="flex flex-col items-center justify-start w-full gap-5 p-12">
                <div className="">
                    <img src="/public/assets/dark-mode-logo.png"
                        alt="Collab Nest Logo"
                        className="h-12 mb-4 mx-auto" />
                    <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
                    <p className="text-md text-gray-600 text-center mb-6">Create an account to start collaborating with others.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col justify-center items-center w-full max-w-[400px]">
                        {/* user name */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your user name..." {...field}
                                            className="shad-input" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {/* email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your email..." {...field}
                                            className="shad-input" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password..." {...field}
                                            className="shad-input" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* button */}
                        <Button
                            className="capitalize bg-primary-600 text-white w-full"
                            type="submit"
                            disabled={isUserLoading || isCreatingUser || isSignIn}>{
                                isUserLoading || isCreatingUser || isSignIn ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader /> Loading...
                                    </div>
                                ) : "submit"
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    <p className="text-sm text-gray-600">If you have an account <Link to={'/sign-in'} className="text-primary-600 text-md font-bold">Sign In</Link></p>
                </div>
            </div>
        </>
    )
}

export default SignUpForm
