import { useEffect, useState } from "react";
import type { Models } from "appwrite";
import { Link } from "react-router-dom";
import DisplayDate from "@/constants/DisplayDate";
import { useUserContext } from "@/context/AuthContext";
import AppllicationForms from "../forms/AppllicationForms";
import { getApplications, getUsers } from "@/lib/appwrite/api";
import Candidate from "@/constants/Candidate";
import { FileCheck, FileCheck2, FileClock, FileX, FileX2 } from "lucide-react";

type PostCardProps = {
    post: Models.Document;
};

function PostCard({ post }: PostCardProps) {
    const [users, setUsers] = useState<Models.Document[]>([]);
    const [applications, setApplications] = useState<Models.Document[]>([]);
    const [applicant, setApplicant] = useState<
        { applicant: Models.Document | undefined; user: Models.Document | undefined }[]>([]);
    const { user } = useUserContext();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, applicationRes] = await Promise.all([
                    getUsers(),
                    getApplications()
                ]);

                setUsers(userRes.documents);
                setApplications(applicationRes.documents);

                // ✅ use fresh data here, not state
                const filtered = applicationRes.documents.filter((a) => a.postID === post.$id);
                const joined = filtered.map((applicant) => {
                    const user = userRes.documents.find((u) => u.accountID === applicant.userID);
                    return { applicant, user };
                });

                setApplicant(joined);
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };

        fetchData();
    }, [post.$id]); // ✅ also add post.$id as dependency

    const author = users.find((user) => user.accountID === post.userID);
    const isAuthor = user.accountID === post?.userID;
    const alreadyApplied = applications.find(
        (application) => application.postID === post.$id && application.userID === user.accountID
    )

    return (
        <div className="post-card p-4 shadow flex flex-col gap-4 relative">
            {/* author info */}
            <div className="flex justify-between items-center">
                <div className="flex flex-center gap-2">
                    <Link to={`/profile/${author?.accountID}`}>
                        <img
                            src={author?.avatarURL || "/default-avatar.png"}
                            alt={author?.username || "User"}
                            className="rounded-full w-9 h-9 object-cover"
                        />
                    </Link>
                    <div>
                        <p className="font-semibold capitalize">{author?.username || "Unknown User"}</p>
                        <p className="text-[10px] text-gray-500 w-24 md:w-48 overflow-hidden">{author?.accountID}</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    <DisplayDate date={post.$createdAt}></DisplayDate>
                </div>
            </div>

            {/* Post Content */}
            <div className="">
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
                    post.file ? (
                        <div>
                            <img
                                src={post.file}
                                alt="Post attachment"
                                className="post-card_img" />
                        </div>
                    ) : (
                        <div></div>
                    )}
            </div>

            {/* footer div  */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 w-1/2 justify-start">
                    {
                        isAuthor ? (
                            <div className="shad-button_primary rounded-md p-[11.75px] font-light text-sm">
                                <FileX2 size={16} /><p>Can't apply own post</p>
                            </div>
                        ) : (
                            alreadyApplied ? (
                                <div className={`rounded-md p-[11.75px] font-light text-sm flex items-center gap-2
                                        ${alreadyApplied.status === "pending" ? "shad-button_pending" : ""}
                                        ${alreadyApplied.status === "accepted" ? "shad-button_accept" : ""}
                                        ${alreadyApplied.status === "rejected" ? "shad-button_reject" : ""}
                                    `}>
                                    {alreadyApplied.status === "pending" && (
                                        <>
                                            <FileClock size={16} />
                                            <p>Pending</p>
                                        </>
                                    )}

                                    {alreadyApplied.status === "accepted" && (
                                        <>
                                            <FileCheck2 size={16} />
                                            <p>Accepted</p>
                                        </>
                                    )}

                                    {alreadyApplied.status === "rejected" && (
                                        <>
                                            <FileX2 size={16} />
                                            <p>Rejected</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <AppllicationForms post={post}></AppllicationForms>
                            )
                        )
                    }
                </div>
                <div className="flex justify-end w-1/2">
                    <Candidate applicant={applicant}></Candidate>
                </div>
            </div>
        </div >
    );
}

export default PostCard;