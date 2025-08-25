import Applicant from "@/components/shared/Applicant";
import { useUserContext } from "@/context/AuthContext";
import { getApplications, getRecentPosts } from "@/lib/appwrite/api"
import { useGetRecentPosts } from "@/lib/react-query/queryandmutation";
import type { Models } from "appwrite";
import { File, Loader } from "lucide-react";
import { useEffect, useState } from "react";

function Applications() {

  const { data: posts, isPending: isPostLoading, isError: isPostError } = useGetRecentPosts();
  const [applicant, setApplicant] = useState<Models.Document[]>([]);
  const { user } = useUserContext();

  // application 
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const applyUser = await getApplications();
        setApplicant(applyUser.documents);
      } catch (error) {
        console.log('error from application.tsx', error);
      }
    }
    fetchApplicant();
  }, [])

  const myPost = posts?.documents.filter((p) => p.userID === user.accountID)
  console.log(myPost);
  return (
    <div className="w-full py-2 px-4 md:px-6 md:py-6">
      <div className="flex flex-1 gap-2 flex-start py-2">
        <File />
        <p className="capitalize text-xl">in my post applicant</p>
      </div>
      <div className="flex flex-1 relative">
        <div className="home-container">
          <div className="home-posts relative">
            {isPostLoading && !posts ? (
              <Loader />
            ) : (
              <ul className="flex flex-col flex-1 gap-4 w-full relative snap-x">
                {
                  myPost?.map((mypost) => (
                    <li className="snap-center">
                      <Applicant post={mypost} applicant={applicant} ></Applicant>
                    </li>
                  ))
                }
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Applications
