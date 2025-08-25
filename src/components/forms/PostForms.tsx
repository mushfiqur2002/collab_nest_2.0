import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import type { Models } from "appwrite";
import { useCreatePost } from "@/lib/react-query/queryandmutation";
import { useUserContext } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
    post?: Models.Document;
};

function PostForms({ post }: PostFormProps) {
    const { mutateAsync: createPost, isPending: isLoading } = useCreatePost();
    const { user } = useUserContext();
    const { showError, showSuccess } = useAlert();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            userID:user.accountID,
            caption: post?.caption || '',
            file: [],
            category: post?.category || '',
            conditions: post?.conditions || '', // ✅ Fixed typo here
            tags: post?.tags?.join(',') || ''
        },
    });

    async function onSubmit(values: z.infer<typeof PostValidation>) {
        try {
            const createpost = await createPost({
                ...values,
                userID: user.accountID,
                file: values.file as File[] | undefined,
            });
            if(!createpost){
                console.log('user', user);
                showError('please try again');
                return
            }
            console.log('postforms.tsx',createpost, 'values', values, 'user', user);
            showSuccess('Created successfully. Redirecting...');
            navigate('/');
        } catch (error) {
            showError('Please try again.');
            return;
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col pb-6">
                    
                    {/* Caption Field */}
                    <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="shad-textarea"
                                        placeholder="Write a caption for your post [under 80 characters]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* File Upload */}
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Add File</FormLabel>
                                <FormControl>
                                    <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category & Conditions */}
                    <div className="w-full grid grid-cols-2 gap-3">
                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base of project</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input"
                                            placeholder="Content, Research, Informatic"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Conditions */}
                        <FormField
                            control={form.control}
                            name="conditions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conditions</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input"
                                            placeholder="Paid, Unpaid, Credit"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Tags */}
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Add Tags (separated by comma ",")</FormLabel>
                                <FormControl>
                                    <Input
                                        className="shad-input"
                                        placeholder="Example - Cat, Dog, Ant"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

export default PostForms;
