import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ProjectValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Input } from "../ui/input";
import type { Models } from "appwrite";
import { useCreateProject } from "@/lib/react-query/queryandmutation";
import { useUserContext } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { getMembers, getUsers } from "@/lib/appwrite/api";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAlert } from "@/context/AlertContext";

type ProjectFormProps = {
    project?: Models.Document;
};

export default function ProjectForms({ project }: ProjectFormProps) {
    const { mutateAsync: createProject, isPending: isLoading } = useCreateProject();
    const { user } = useUserContext();
    const [users, setUsers] = useState<Models.Document[]>([]);
    const [members, setMembers] = useState<Models.Document[]>([]);
    const { showError, showSuccess } = useAlert();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getMembers();
                setMembers(res.documents);
            } catch (error) {
                console.log('error in fetchMembers', error);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.documents);
            } catch (error) {
                console.log('error in fetchUsers', error);
            }
        };
        fetchUsers();
    }, []);

    const findOwnMember = members.filter((m) => m.elderID === user.accountID);

    const findOwnMembersInfo = users.filter((u) =>
        findOwnMember.some((m) => m.applicantUserID === u.accountID)
    );

    const form = useForm<z.infer<typeof ProjectValidation>>({
        resolver: zodResolver(ProjectValidation),
        defaultValues: {
            elderID: user?.accountID,
            projectName: project?.projectname || '',
            projectDescription: project?.description || '',
            privacy: project?.privacy || '',
            members: project?.members || [],
        },
    });

    async function onSubmit(values: z.infer<typeof ProjectValidation>) {
        try {
            const newProject = await createProject({
                ...values,
                elderID: user?.accountID
            });

            if (!newProject) {
                console.log("user", user);
                showError("please try again");
                return;
            }

            showSuccess("Created successfully. Redirecting...");
        } catch (error) {
            console.log("error submitting project", error);
            showError("Please try again.");
        }
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col pb-6">

                    <div className="w-full grid gap-3">

                        {/* Project Name */}
                        <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input-2"
                                            placeholder="Enter Project Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="projectDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="shad-textarea-2"
                                            placeholder="Short intro for your project [under 80 characters]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Privacy */}
                        <FormField
                            control={form.control}
                            name="privacy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Privacy</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full shad-input-2 text-sm">
                                                <SelectValue placeholder="Select privacy" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-dark-3">
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Members */}
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Members</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <Command className="bg-dark-3 border-none rounded-lg">
                                                <CommandInput
                                                    placeholder="Search members..."
                                                    className="border-none outline-none"
                                                />
                                                <CommandList className="h-[100px] custom-scrollbar">
                                                    <CommandEmpty>No members found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {findOwnMembersInfo.map((m) => (
                                                            <CommandItem
                                                                key={m.accountID}
                                                                onSelect={() => {
                                                                    if (field.value?.includes(m.accountID)) {
                                                                        field.onChange(
                                                                            field.value.filter((id: string) => id !== m.accountID)
                                                                        );
                                                                    } else {
                                                                        field.onChange([...(field.value || []), m.accountID]);
                                                                    }
                                                                }}
                                                                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition"
                                                            >
                                                                <img
                                                                    src={m.avatarURL || "/default-avatar.png"}
                                                                    alt={m.username}
                                                                    className="w-8 h-8 rounded-full border border-indigo-400 object-cover"
                                                                />
                                                                <div className="flex flex-col text-sm">
                                                                    <span className="text-[16px] capitalize text-white">{m.username}</span>
                                                                    <span className="text-xs text-gray-400">{m.email}</span>
                                                                </div>
                                                                <div className="ml-auto">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={field.value?.includes(m.accountID)}
                                                                        readOnly
                                                                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                                                                    />
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>

                                            {/* Selected tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {(field.value || []).map((id: string) => {
                                                    const u = findOwnMembersInfo.find((m) => m.accountID === id);
                                                    return (
                                                        <span
                                                            key={id}
                                                            className="flex items-center gap-2 px-2 py-1.5 rounded-full border text-sm shadow-sm hover:shadow-md transition"
                                                        >
                                                            <img
                                                                src={u?.avatarURL || "/default-avatar.png"}
                                                                alt={u?.username}
                                                                className="w-6 h-6 rounded-full border border-indigo-400"
                                                            />
                                                            <span className="text-[16px] capitalize">{u?.username}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    field.onChange(field.value.filter((x: string) => x !== id))
                                                                }
                                                                className="ml-1 rounded-full p-1 hover:bg-indigo-500/30 transition"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
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

