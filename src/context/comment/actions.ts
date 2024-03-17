import { Dispatch } from "react";
import { API_ENDPOINT } from "../../config/constants";
import { CommentAvailableAction, CommentActions } from "./types";
import { CommentPayload } from "./types";

// Action to fetch comments for a specific task
// Action to fetch comments for a specific task and sort them in reverse chronological order
export const fetchComments = async (
  dispatch: Dispatch<CommentActions>,
  projectID: string,
  taskID: string
) => {
  const token = localStorage.getItem("authToken") ?? "";
  try {
    dispatch({ type: CommentAvailableAction.FETCH_COMMENTS_REQUEST });
    const response = await fetch(
      `${API_ENDPOINT}/projects/${projectID}/tasks/${taskID}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const data = await response.json();
    console.log(data);
    dispatch({
      type: CommentAvailableAction.FETCH_COMMENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Operation failed:", error);
    dispatch({
      type: CommentAvailableAction.FETCH_COMMENTS_FAILURE,
      payload: "Unable to load comments",
    });
  }
};

// Action to create a new comment for a specific task
export const createComment = async (
  dispatch: Dispatch<CommentActions>,
  projectID: string,
  taskID: string,
  comment: CommentPayload
) => {
  const token = localStorage.getItem("authToken") ?? "";
  try {
    dispatch({ type: CommentAvailableAction.CREATE_COMMENT_REQUEST });
    const response = await fetch(
      `${API_ENDPOINT}/projects/${projectID}/tasks/${taskID}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    const data2 = await response.json();
    
    dispatch({ type: CommentAvailableAction.CREATE_COMMENT_SUCCESS, payload: data2 });
    // You may choose to refresh comments after creating a new one
    console.log("comment created");
    fetchComments(dispatch, projectID, taskID);
  } catch (error) {
    console.error("Operation failed:", error);
    dispatch({
      type: CommentAvailableAction.CREATE_COMMENT_FAILURE,
      payload: "Unable to create comment",
    });
  }
};
