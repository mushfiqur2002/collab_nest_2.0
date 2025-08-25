import Applicant from "@/components/shared/Applicant";
import MyApplicationShow from "@/components/shared/MyApplicationShow";
import { useUserContext } from "@/context/AuthContext";
import { getApplications, getRecentPosts } from "@/lib/appwrite/api"
import { useGetRecentPosts } from "@/lib/react-query/queryandmutation";
import type { Models } from "appwrite";
import { File, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

  const myApplication = applicant.filter((a) => a.userID === user.accountID);
  const appliedPosts = useMemo(() => {
    if (!posts || !applicant.length) return [];

    return posts.documents.filter((p: Models.Document) =>
      applicant.some(
        (a) => a.userID === user.accountID && a.postID === p.$id
      )
    );
  }, [posts, applicant, user.accountID]);


  const myPost = posts?.documents.filter((p) => p.userID === user.accountID)

  return (
    <div className="w-full py-2 px-4 md:px-6 md:py-6 flex flex-col gap-4">

      {/* applicant in my post */}
      <div className="">
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

      {/* .... */}
      <div className="w-full h-[1.15px] bg-gray-700"></div>
      {/* .... */}

      {/* my applicaiton section  */}
      <div>
        <div className="flex flex-1 gap-2 flex-start py-2">
          <File />
          <p className="capitalize text-xl">my application update</p>
        </div>
        <div>
          <ul className="flex flex-col flex-1 gap-4 w-full relative snap-x">
            {
              appliedPosts?.map((myappliedpost) => (
                <li className="snap-center">
                  <MyApplicationShow myappliedpost={myappliedpost} application={myApplication} ></MyApplicationShow>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Applications
