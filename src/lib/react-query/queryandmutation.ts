import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  signInAccount,
  signOutAccount,
  createPost,
  getRecentPosts,
  createApplication,
  createProject,
  getProjects,
  getMembers,
  getUsers,
  createTask,
} from "../appwrite/api";
import type {
  IApplicationPost,
  ILogUser,
  INewPost,
  INewProject,
  INewTask,
  INewUser,
} from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInUserAccMutation = () => {
  return useMutation({
    mutationFn: (user: ILogUser) => signInAccount(user),
  });
};

export const useSignOutUserAccMutation = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: INewProject) => createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECTS],
    queryFn: getProjects,
  });
};


export const useGetMembers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBERS],
    queryFn: getMembers,
  })
}

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getUsers,
  });
}

export const useApplication = () => {
  return useMutation({
    mutationFn: (post: IApplicationPost) => createApplication(post),
  });
};


export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: INewTask) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASKS],
      });
    },
  });
};