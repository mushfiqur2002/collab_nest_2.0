export type INewUser = {
    email: string;
    password: string;
    username: string;
}

export type IDBCollectionNewUser = {
    accountID: string;
    email: string;
    username: string;
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

export type IApplicationPost = {
    userID: string;
    postID: string;
    file: File[];
    fileID?: string;
    status?: string;
}