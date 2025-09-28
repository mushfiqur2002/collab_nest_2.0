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
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { getMembers, getUsers } from "@/lib/appwrite/api";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ProjectFormProps = {
    project?: Models.Document;
};
export default function ProjectForms({ project }: ProjectFormProps) {
    const { mutateAsync: createProject, isPending: isLoading } = useCreateProject();
    const { user } = useUserContext();
    const [users, setUsers] = useState<Models.Document[]>([]);

    const navigate = useNavigate();
    const [members, setMembers] = useState<Models.Document[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const members = await getMembers()
                setMembers(members.documents)
                if (!members) console.log('error in porject.tsx');
                return members
            } catch (error) {
                console.log(error);
            }
        }
        fetchMembers()
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                setUsers(users.documents);
            } catch (error) {
                console.log('error from people.tsx', error);
            }
        }
        fetchUsers();
    }, []);



    const form = useForm<z.infer<typeof ProjectValidation>>({
        resolver: zodResolver(ProjectValidation),
        defaultValues: {
            // userID: user.accountID,
            // projectname: project?.projectname,
            // discription: project?.discription,
            // privacy: project?.privacy,
            // members: project?members

            userID: user.accountID,
            projectname: project?.projectname,
            discription: project?.discription,
            privacy: project?.privacy,
            members: project?members
        },
    });

    const findOwnMember = members.filter(ele => ele.elderID === user.accountID);
    const findOwnMembersInfo = users.filter(u =>
        findOwnMember.some(m => m.applicantUserID === u.accountID)
    );

    async function onSubmit(values: z.infer<typeof ProjectValidation>) {
        console.log('project.tsx: ', values);
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
                                            className="shad-input-2"
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
                                            className="shad-textarea-2"
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
                        {/* members */}
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Members</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <Command className="bg-dark-3 border-none rounded-lg">

                                                <CommandInput placeholder="Search members..." className="border-none outline-none" />
                                                <CommandList className="h-[100px] custom-scrollbar">
                                                    <CommandEmpty>No members found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {findOwnMembersInfo.map((m) => (
                                                            <CommandItem
                                                                key={m.accountID}
                                                                onSelect={() => {
                                                                    if (field.value?.includes(m.accountID)) {
                                                                        field.onChange(
                                                                            field.value.filter((id: any) => id !== m.accountID)
                                                                        );
                                                                    } else {
                                                                        field.onChange([...(field.value || []), m.accountID]);
                                                                    }
                                                                }}
                                                                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition"
                                                            >
                                                                {/* Avatar */}
                                                                <img
                                                                    src={m.avatarURL || "/default-avatar.png"}
                                                                    alt={m.username}
                                                                    className="w-8 h-8 rounded-full border border-indigo-400 object-cover"
                                                                />

                                                                {/* User Info */}
                                                                <div className="flex flex-col text-sm">
                                                                    <span className="text-[16px] capitalize text-white">{m.username}</span>
                                                                    <span className="text-xs text-gray-400">{m.email}</span>
                                                                </div>

                                                                {/* Checkbox */}
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
                                                    const user = findOwnMembersInfo.find((m) => m.accountID === id);
                                                    return (
                                                        <span
                                                            key={id}
                                                            className="flex items-center gap-2 px-2 py-1.5 rounded-full border text-sm shadow-sm hover:shadow-md transition"
                                                        >
                                                            {/* Avatar */}
                                                            <img
                                                                src={user?.avatarURL || "/default-avatar.png"}
                                                                alt={user?.username}
                                                                className="w-6 h-6 rounded-full border border-indigo-400"
                                                            />

                                                            {/* Name */}
                                                            <span className="text-[16px] capitalize">{user?.username}</span>

                                                            {/* Remove Button */}
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
