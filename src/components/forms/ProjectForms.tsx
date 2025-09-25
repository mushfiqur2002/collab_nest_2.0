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
import { useCreatePost } from "@/lib/react-query/queryandmutation";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { getMembers, getUsers } from "@/lib/appwrite/api";
import { useEffect, useState } from "react";

type ProjectFormProps = {
    post?: Models.Document;
};
export default function ProjectForms() {
    const { mutateAsync: createPost, isPending: isLoading } = useCreatePost();
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

    console.log(users);



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

    const findOwnMember = members.filter(ele => ele.elderID === user.accountID);
    console.log('members', typeof members);

    console.log(findOwnMember);

    const findOwnMembersInfo = users.filter(u =>
        findOwnMember.some(m => m.applicantUserID === u.accountID)
    );
    console.log(findOwnMembersInfo);



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
                                        <div className="space-y-2">
                                            <Command className="bg-dark-4 border rounded-lg">
                                                <CommandInput placeholder="Search members..." />
                                                <CommandList>
                                                    <CommandEmpty>No members found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {findOwnMembersInfo.map((m) => (
                                                            <CommandItem
                                                                key={m.accountID}
                                                                onSelect={() => {
                                                                    // toggle selection
                                                                    if (field.value?.includes(m.accountID)) {
                                                                        field.onChange(
                                                                            field.value.filter((id:any) => id !== m.accountID)
                                                                        );
                                                                    } else {
                                                                        field.onChange([...(field.value || []), m.accountID]);
                                                                    }
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value?.includes(m.accountID)}
                                                                    readOnly
                                                                />
                                                                {m.username} ({m.email})
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
                                                            className="flex items-center gap-1 px-3 py-1 bg-dark-2 text-white rounded-full text-sm"
                                                        >
                                                            {user?.username}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    field.onChange(field.value.filter((x: string) => x !== id))
                                                                }
                                                            >
                                                                ✕
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
