import { ID, Query } from "appwrite";
import { account, appWriteConfig, avartars, databases, storage } from "./config";
import type { IApplicationPost, IDBCollectionNewUser, ILogUser, INewPost, INewProject, INewUser } from "@/types";
import Project from "@/_root/pages/Project";


// function to create users account
export async function createUserAccount(user: INewUser) {
    try {
        // Create a new user account in Appwrite [part of authentication]
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username,
        )

        // Check account creation
        if (!newAccount) {
            throw new Error('Failed to create user account');
        }

        const avatarUrl = avartars.getInitials(user.username);

        // Save user data to the database
        const newUser = await saveToDB({
            accountID: newAccount.$id,
            email: user.email,
            username: user.username,
            category: user.category,
            avatarURL: avatarUrl,
        })
        return newUser;

    } catch (error) {
        console.log(error);
        return error;

    }
}

// function to save data in the database 
export async function saveToDB(user: IDBCollectionNewUser) {
    try {
        const newUser = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.usersCollectionID,
            ID.unique(),
            user
        )

        return newUser;

    } catch (error) {
        console.log('Error saving user to DB:', error);
        throw error;
    }
}

// funxtion to sign in user account
export async function signInAccount(user: ILogUser) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    }
    catch (error) {
        console.log('Error signing in user:', error);
        throw error
    }
}

// function to search current user
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) console.log('No current account found');

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseID,
            appWriteConfig.usersCollectionID,
            [Query.equal('accountID', currentAccount.$id)]
        )

        if (!currentUser) console.log('No user found in the database');
        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

// function to sign out user account
export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log('Error signing out user:', error);
    }
}

// Create post
export async function createPost(post: INewPost) {
    try {
        let fileUrl: string | undefined = undefined;

        if (post.file && post.file.length > 0) {
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw new Error("File upload failed");

            fileUrl = await getFileView(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Failed to get file URL");
            }
        }

        const tags = post.tags?.split(",") || [];

        const newPost = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.postsCollectionID,
            ID.unique(),
            {
                userID: post.userID,
                caption: post.caption,
                file: fileUrl, // will be undefined if no file
                category: post.category,
                conditions: post.conditions,
                tags: tags,
            }
        );

        return newPost;
    } catch (error) {
        console.log("Error in createPost:", error);
        return undefined;
    }
}

// Create project
export async function createProject(project: INewProject) {
    try {
        const newProject = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.projectsCollectionID,
            ID.unique(),
            {
                elderID: project.elderID,
                projectName: project.projectName,
                projectDiscription: project.projectDiscription,
                privacy: project.privacy,
                members: project.members
            }
        )
        return newProject
    } catch (error) {
        console.log("Error in createPost:", error);
        return undefined;
    }
}


// Upload file
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appWriteConfig.storageBucketID,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log("Error uploading file:", error);
        return undefined;
    }
}

// Get file preview URL
export async function getFileView(fileID: string): Promise<string | undefined> {
    try {
        const fileUrl = storage.getFileView(
            appWriteConfig.storageBucketID, // ✅ Add this
            fileID,
        ).toString();

        return fileUrl;
    } catch (error) {
        console.log("Error getting file preview:", error);
        return undefined;
    }
}

// Optional: Delete file
export async function deleteFile(fileID: string) {
    try {
        await storage.deleteFile(appWriteConfig.storageBucketID, fileID);
    } catch (error) {
        console.log("Error deleting file:", error);
    }
}

// Get post 
export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.postsCollectionID,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if (!posts) {
        throw Error;
    }
    return posts;
}


// create application 
export async function createApplication(post: IApplicationPost & { userID: string }) {
    try {
        let fileUrl: string | undefined = undefined;
        let fileID: string | undefined = undefined;

        // Handle file upload (if any)
        if (post.file && post.file.length > 0) {
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw new Error("File upload failed");

            fileID = uploadedFile.$id;
            fileUrl = await getFileView(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Failed to get file URL");
            }
        }

        // Create new application document
        const newApplication = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.applicationsCollectionID,
            ID.unique(),
            {
                userID: post.userID,
                postID: post.postID,
                file: fileUrl || null,
                fileID: fileID || null,
                status: 'pending'
            }
        );

        return newApplication;
    } catch (error) {
        console.error("Error creating application:", error);
        throw error;
    }
}

// get users 
export async function getUsers() {
    const users = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.usersCollectionID
    )
    if (!users) {
        throw Error
    }
    return users;
}

// get applications 
export async function getApplications() {
    const applications = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.applicationsCollectionID
    )
    if (!applications) {
        throw Error;
    }
    return applications;
}

// create members
export async function createMembers(candidate: any, elderID: string) {
    try {
        const member = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.membersCollectionID,
            ID.unique(),
            {
                applicantUserID: candidate.userID,
                elderID: elderID,
            }
        )
        return member;
    } catch (error) {
        console.error("Error creating member:", error);
        throw error;
    }
}

// get members
export async function getMembers() {
    const members = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.membersCollectionID
    )
    if (!members) {
        throw Error
    }
    return members;
}

// Update Application
export async function updateApplicationStatus(applicationID: string, status: 'accepted' | 'rejected') {
    try {
        const update = await databases.updateDocument(
            appWriteConfig.databaseID,
            appWriteConfig.applicationsCollectionID,
            applicationID,
            { status }
        )
        return update;
    } catch (error) {
        console.log('error from api', error)
    }
}











