import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appWriteConfig = {
    projectID: import.meta.env.VITE_APPWRITE_ID,
    endpoint: import.meta.env.VITE_APPWRITE_URL,
    databaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageBucketID: import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID,
    usersCollectionID: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    applicationsCollectionID: import.meta.env.VITE_APPWRITE_APPLICATIONS_COLLECTION_ID,
    postsCollectionID: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    membersCollectionID: import.meta.env.VITE_APPWRITE_MEMBERS_COLLECTION_ID,
    projectsCollectionID: import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID
}

export const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint)
    .setProject(appWriteConfig.projectID)


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avartars = new Avatars(client);