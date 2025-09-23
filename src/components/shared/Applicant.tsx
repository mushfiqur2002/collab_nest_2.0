
import { createMembers, getUsers, updateApplicationStatus } from "@/lib/appwrite/api"
import type { Models } from "appwrite";
import { useEffect, useState } from "react"
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";


function Applicant({ post, applicant }: any) {
    const { user } = useUserContext();
    const [users, setUsers] = useState<Models.Document[]>([]);
    const { showError, showSuccess, showLoading } = useAlert();
    const postCandidates = applicant.filter(
        (candidate: any) => candidate.postID === post.$id
    )

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = await getUsers();
                setUsers(user.documents);
            } catch (error) {

            }
        };
        fetchUsers();
    }, [])

    // handle accepted members
    const handleAcceptMembers = async (candidate: any) => {
        try {
            const acceptMember = await createMembers(candidate, user.accountID);
            await updateApplicationStatus(candidate.$id, 'accepted');
            if (!acceptMember) showError('something error');
            showLoading();
            showSuccess(`accept member ${candidate.userID}`)
        } catch (error) {
            console.error("Failed to accept member:", error);
        }
    };

    // handle rejected members
    const handleRejectMembers = async (candidate: any) => {
        try {
            await updateApplicationStatus(candidate.$id, 'rejected');
            showLoading();
            showSuccess(`reject member ${candidate.userID}`)
        } catch (error) {
            console.error('Failed to reject member: ', error);
        }

    }
    return (
        <div className="post-card p-4 shadow flex flex-col gap-4 relative">
            {/* Post Content */}
            <div className="">
                <h1 className="text-gray-500 pb-2">{post.$id}</h1>
                <p className="base-regular">{post.caption}</p>
                <div className="flex flex-1 flex-col text-light-3 text-sm capitalize py-2">
                    <p>category: {post?.category}</p>
                    <p>condition: {post?.conditions}</p>
                </div>
                <div className="">
                    <p className="flex text-sm text-primary-600 gap-1 capitalize">
                        tags:
                        {post?.tags.map((tag: any) => {
                            return (
                                <span>{tag},</span>
                            )
                        })}
                    </p>
                </div>
            </div>

            {/* // */}
            <div>
                {
                    post.file && (
                        <div>
                            <img
                                src={post.file}
                                alt="Post attachment"
                                className="post-card_img" />
                        </div>
                    )
                }
            </div>

            <div>
                <ul className="flex flex-col gap-2">
                    {
                        postCandidates.length > 0 ? (
                            postCandidates.map((candidate: any) => {
                                const user = users.find((u: any) => u.accountID === candidate.userID);
                                return (
                                    <li className="flex items-center justify-start gap-2">
                                        <img
                                            src={user?.avatarURL}
                                            className="w-9 h-9 rounded"
                                        />
                                        {
                                            candidate.status === 'pending' ? (
                                                <>
                                                    <div className="">
                                                        <Button className="shad-button_primary">
                                                            <a
                                                                href={candidate.file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:text-white capitalize"
                                                            >
                                                                show CV
                                                            </a>
                                                        </Button>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="shad-button_accept"
                                                            onClick={() => handleAcceptMembers(candidate)}>
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            className="shad-button_reject"
                                                            onClick={() => handleRejectMembers(candidate)}>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className={`w-full rounded-md p-[8px] font-light text-sm flex items-center gap-2
                                                    ${candidate.status === 'accepted' && 'shad-button_accept'}
                                                    ${candidate.status === 'rejected' && 'shad-button_reject'}`}>
                                                    {candidate.status}
                                                </div>
                                            )
                                        }
                                    </li>
                                )
                            })
                        ) : (
                            <li className="text-gray-400">No applicants yet</li>
                        )
                    }
                </ul>
            </div>
        </div >
    )
}

export default Applicant
