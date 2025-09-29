export type INewUser = {
    email: string;
    password: string;
    category: string;
    username: string;
}

export type IDBCollectionNewUser = {
    accountID: string;
    email: string;
    username: string;
    category: string;
    avatarURL: URL | string;
}

export type ILogUser = {
    email: string;
    password: string;
}

export type IUser = {
    accountID: string;
    email: string;
    username: string;
    avatarURL: URL | string;
    category: string
}

export type INavLink = {

}


export type INewPost = {
    userID: string;
    caption: string;
    file?: File[];
    category?: string;
    conditions?: string;
    tags?: string;
};

export type INewProject = {
    elderID: string;
    projectName: string;
    projectDescription: string;
    privacy: string;
    members: string[];
};

export type IApplicationPost = {
    userID: string;
    postID: string;
    file: File[];
    fileID?: string;
    status?: string;
}