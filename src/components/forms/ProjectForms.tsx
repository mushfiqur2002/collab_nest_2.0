import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ProjectValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Input } from "../ui/input";
import type { Models } from "appwrite";
import { useCreatePost } from "@/lib/react-query/queryandmutation";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

type ProjectFormProps = {
    post?: Models.Document;
};
export default function ProjectForms() {
    const { mutateAsync: createPost, isPending: isLoading } = useCreatePost();
    const { user } = useUserContext();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof ProjectValidation>>({
        resolver: zodResolver(ProjectValidation),
        defaultValues: {
            userID: user.accountID,
            projectname: '',
            discription: '',
            privacy: '', // ✅ Fixed typo here
            members: ''
        },
    });

    async function onSubmit(values: z.infer<typeof ProjectValidation>) {

    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col pb-6">

                    <div className="w-full grid gap-3">

                        {/* Project Name */}
                        <FormField
                            control={form.control}
                            name="projectname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input"
                                            placeholder="Enter Project Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* discription Field */}
                        <FormField
                            control={form.control}
                            name="discription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discription</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="shad-textarea bg-"
                                            placeholder="Short intro for you project. [under 80 characters]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* privacy */}
                        <FormField
                            control={form.control}
                            name="privacy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Privacy</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full shad-input text-sm">
                                                <SelectValue placeholder="Select privacy" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-dark-4">
                                                <SelectItem value="recruiter">Public</SelectItem>
                                                <SelectItem value="seeker">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* members */}
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Members</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full shad-input text-sm">
                                                <SelectValue placeholder="Select privacy" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-dark-4">
                                                <SelectItem value="recruiter">Public</SelectItem>
                                                <SelectItem value="seeker">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-between gap-2">
                        <Button type="submit" className="w-full bg-primary-600" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
