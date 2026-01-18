import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchingProps {
    onSearch?: (query: string) => void;
    searchValue?: string;
}

const Searching = ({ onSearch, searchValue }: SearchingProps) => {
    const [query, setQuery] = useState(searchValue || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="flex w-full flex-center sticky top-0 py-0 md:py-6">
            <form onSubmit={handleSearch} className="relative w-full">
                <Input
                    type="text"
                    id="searchInput"
                    placeholder="Search for people, posts, applications..."
                    className="w-full shad-input rounded-full pr-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button
                    type="submit"
                    className="bg-dark-4 shad-input rounded-full flex flex-center absolute right-0 top-0 h-full px-4"
                    id="searchInputBtn"
                >
                    <Search className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default Searching;