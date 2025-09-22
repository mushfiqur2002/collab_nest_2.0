import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function Searching() {
    return (
        <div className="flex w-full flex flex-center sticky top-0 py-2 md:py-4">
            <Input
                type="text"
                placeholder="Search for people, posts, applications..."
                className="w-full shad-input rounded-full"
            />
            <Button className="bg-dark-4 shad-input rounded-full flex flex-center absolute right-0">
                <Search />
            </Button>

        </div>
    )
}

export default Searching
