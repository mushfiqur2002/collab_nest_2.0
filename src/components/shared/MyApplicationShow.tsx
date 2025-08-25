
function MyApplicationShow({ myappliedpost, application }: any) {
    console.log('my applied post id: ', myappliedpost.$id)
    return (
        <div className="post-card p-4 shadow flex flex-col gap-4 relative">
            <div className="">
                <h1 className="text-gray-500 pb-2">{myappliedpost.$id}</h1>
                <p className="base-regular">{myappliedpost.caption}</p>
                <div className="flex flex-1 flex-col text-light-3 text-sm capitalize py-2">
                    <p>category: {myappliedpost?.category}</p>
                    <p>condition: {myappliedpost?.conditions}</p>
                </div>
                <div className="">
                    <p className="flex text-sm text-primary-600 gap-1 capitalize">
                        tags:
                        {myappliedpost?.tags.map((tag: any) => {
                            return (
                                <span>{tag},</span>
                            )
                        })}
                    </p>
                </div>
                <div>
                    {
                        myappliedpost.file && (
                            <div className="">
                                <img
                                    src={myappliedpost.file}
                                    alt="Post attachment"
                                    className="post-card_img" />
                            </div>
                        )
                    }
                </div>
            </div>
            <div>
                {application.map((a: any) =>
                    a.postID === myappliedpost.$id ? (
                        <p key={a.$id} className={`text-sm 
                            ${a.status === "accepted" ? "shad-button_accept" : ""}
                            ${a.status === "rejected" ? "shad-button_reject" : ""}`}>
                            {a.status}
                        </p>
                    ) : null
                )}
            </div>
        </div>
    )
}

export default MyApplicationShow
