import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  signInAccount,
  signOutAccount,
  createPost,
  getRecentPosts,
  createApplication,
  createProject,
} from "../appwrite/api";
import type {
  IApplicationPost,
  ILogUser,
  INewPost,
  INewProject,
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

export const useApplication = () => {
  return useMutation({
    mutationFn: (post: IApplicationPost) => createApplication(post),
  });
};
