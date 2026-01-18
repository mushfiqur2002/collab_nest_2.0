import { useState, useEffect } from 'react';
import PostCard from '@/components/shared/PostCard';
import Searching from '@/components/shared/Searching';
import { useGetRecentPosts } from '@/lib/react-query/queryandmutation';
import type { Models } from 'appwrite';
import { Loader } from 'lucide-react';

const Home = () => {
    const { data: posts, isLoading: isPostLoading } = useGetRecentPosts()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Models.Document[]>([]);

    // Filter posts based on search query
    useEffect(() => {
        if (!posts?.documents) {
            setFilteredPosts([]);
            return;
        }

        if (!searchQuery.trim()) {
            setFilteredPosts(posts.documents);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = posts.documents.filter((post: Models.Document) => {
            // Search in post caption
            if (post.caption?.toLowerCase().includes(query)) {
                return true;
            }

            // Search in post tags
            if (post.tags && Array.isArray(post.tags)) {
                return post.tags.some((tag: string) =>
                    tag.toLowerCase().includes(query)
                );
            }

            // Search in location
            if (post.location?.toLowerCase().includes(query)) {
                return true;
            }

            // Search in user's name (if user data is populated)
            if (post.creator?.name?.toLowerCase().includes(query)) {
                return true;
            }

            // Search in user's username
            if (post.creator?.username?.toLowerCase().includes(query)) {
                return true;
            }

            return false;
        });

        setFilteredPosts(filtered);
    }, [posts, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Clear search when component mounts (optional)
    useEffect(() => {
        return () => {
            setSearchQuery('');
        };
    }, []);

    return (
        <div className="flex flex-1 px-4 md:px-2">
            <div className="home-container">
                <div className="home-posts">
                    <div className="sticky top-0 bg-dark-1 z-10 w-full md:w-[200px]">
                        <Searching
                            onSearch={handleSearch}
                            searchValue={searchQuery}
                        />
                    </div>

                    <div className="flex flex-1 relative h-full">
                        <div className="home-container">
                            <div className="home-posts relative pb-6">
                                {/* Search results info */}
                                {searchQuery && (
                                    <div className="mb-4 p-3 bg-dark-2 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-100">
                                                    Search Results for "{searchQuery}"
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="px-3 py-1 text-sm bg-dark-4 text-gray-300 hover:text-white rounded-lg transition-colors"
                                                >
                                                    Clear Search
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isPostLoading && !posts ? (
                                    <Loader />
                                ) : filteredPosts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="text-center">
                                            {searchQuery ? (
                                                <>
                                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                                        No posts found
                                                    </h3>
                                                    <p className="text-gray-400 mb-4">
                                                        No posts match your search for "{searchQuery}"
                                                    </p>
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Clear Search
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                                        No posts available
                                                    </h3>
                                                    <p className="text-gray-400">
                                                        Create your first post to get started!
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <ul className="flex flex-col flex-1 gap-4 w-full relative snap-x custom-scrollbar">
                                        {filteredPosts.map((post: Models.Document) => (
                                            <li key={post.$id} className="snap-center">
                                                <PostCard post={post} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;