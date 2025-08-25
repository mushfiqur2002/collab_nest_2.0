import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ApplicationValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import type { Models } from "appwrite";
import { useApplication } from "@/lib/react-query/queryandmutation";
import { useUserContext } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import ApplicationUploader from "../shared/ApplicationUploader";
import { FileInput } from "lucide-react";

type ApplicationsFromProps = {
    post?: Models.Document;
};

function AppllicationForms({ post }: ApplicationsFromProps) {
    const { mutateAsync: createApplication, isPending: isLoading } = useApplication();
    const { user } = useUserContext();
    const { showError, showSuccess } = useAlert();

    const form = useForm<z.infer<typeof ApplicationValidation>>({
        resolver: zodResolver(ApplicationValidation),
        defaultValues: {
            userID: user.accountID,
            postID: post?.$id || '',
            file: [],
            fileID: undefined
        }
    });

    async function onSubmit(values: z.infer<typeof ApplicationValidation>) {
        try {
            await createApplication({
                ...values,
                userID: user.accountID,   // get userID here via context
                postID: post?.$id || '',
                file: values.file as File[] || undefined,
            });
            if (!createApplication) {
                console.log('error from application form');
                showError('Error try again');
                return
            }
            console.log('application.tsx', createApplication);
            showSuccess('applied successfully');
        } catch (error) {
            showError('err0r')
            console.log('error application forms tsx :', error);
            return
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-2 flex-center">
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ApplicationUploader
                                        onFileSelect={field.onChange}
                                        inputId={`application-file-${post?.$id ?? ''}`} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-between gap-2">
                        <Button
                            type="submit"
                            className="font-light shad-button_primary ">
                            <FileInput size={14} />
                            {isLoading ? "Applying..." : "Apply"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AppllicationForms
