import { useUserContext } from "@/context/AuthContext";
import { getMembers, getUsers } from "@/lib/appwrite/api"
import type { Models } from "appwrite";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react"

function People() {
  const [members, setMembers] = useState<Models.Document[]>([]);
  const [users, setUsers] = useState<Models.Document[]>([]);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await getMembers();
        setMembers(members.documents);
        if (!members) {
          console.log('error from people.tsx');

        }
        return members
      } catch (error) {
        console.log(error);

      }
    }
    fetchMembers();
  }, []);

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

  const myApplicants = members
    .filter(m => m.elderID === user.accountID)   // only this elder's members
    .map(m => m.applicantUserID)                     // get applicant IDs
    .filter((value, index, self) => self.indexOf(value) === index); // remove duplicates

  const myApplicantsUserInfo = users.filter(u => myApplicants.includes(u.accountID));
  console.log(myApplicantsUserInfo);


  console.log(users);
  return (
    <div className="py-6 px-4 flex flex-col gap-3 w-full">
      {
        myApplicantsUserInfo.map((mm) => {
          return (
            <div className="bg-dark-4 rounded flex items-center justify-between w-full p-4 cursor-pointer">

              {/* Left side: Avatar + Info */}
              <div className="flex items-start gap-4 w-full">
                <img
                  className="w-9 h-9 rounded object-cover group-hover:ring-indigo-400 transition-all"
                  src={mm.avatarURL}
                  alt={mm.username}
                />
                <div className="flex flex-col item-start md:flex-row md:justify-between w-full">
                  <div className="">
                    <h1 className="text-[14px] capitalize font-bold text-gray-100 leading-none group-hover:text-indigo-600">
                      {mm.username}
                    </h1>
                    <p className="text-xs text-gray-500 pt-[2.5px]">{mm.email}</p>
                  </div>
                  <div className="w-full md:justify-end flex">
                    <p onClick={() => navigator.clipboard.writeText(mm.accountID)}
                      className="text-[10px] flex items-center text-primary-600 cursore-pointer hover:underline">
                      {mm.accountID}
                      <span className="pl-2"><Copy className="size-[10px]" /></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );


        })
      }
    </div>
  )
}

export default People
