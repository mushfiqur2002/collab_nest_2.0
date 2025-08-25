function Candidate({ applicant }: any) {
    return (
        <div>
            {applicant && Array.isArray(applicant) && applicant.length > 0 ? (
                <div className="flex -space-x-4 md:-space-x-3">
                    {
                        applicant.slice(0, applicant.length > 4 ? 3 : 4).map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className={`relative w-10 h-10 rounded-full border-[3px] border-dark-4`}>
                                {item.user?.avatarURL ? (
                                    <img
                                        src={item.user.avatarURL}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-400"></div>
                                )}
                            </div>
                        ))
                    }
                    {applicant.length > 4 && (
                        <div className="w-10 h-10 rounded-full bg-white text-black text-md flex flex-center border-[3px] border-dark-4 relative">
                            +{applicant.length - 3}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-gray-500 text-sm">No applicants</div>
            )}
        </div>

    );
}

export default Candidate
