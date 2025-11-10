import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import Searching from "@/components/shared/Searching"
import { useGetRecentPosts } from "@/lib/react-query/queryandmutation"
import type { Models } from "appwrite";

function Home() {
    const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
    return (
        <div className="flex flex-col w-full px-4 h-full bg-dark-1">
            <div className="sticky top-0 bg-dark-1 z-10">
                <Searching />
            </div>

            <div className="flex flex-1 relative h-full">
                <div className="home-container">
                    <div className="home-posts relative pb-6">
                        {isPostLoading && !posts ? (
                            <Loader />
                        ) : (
                            <ul className="flex flex-col flex-1 gap-4 w-full relative snap-x custom-scrollbar">
                                {posts?.documents.map((post: Models.Document) => (
                                    <li key={post.userID} className="snap-center">
                                        <PostCard post={post}></PostCard>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
