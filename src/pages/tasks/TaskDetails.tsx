/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, Transition, Listbox } from "@headlessui/react";
import  { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTasksDispatch, useTasksState } from "../../context/task/context";
import { updateTask } from "../../context/task/actions";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import { useProjectsState } from "../../context/projects/context";
import { TaskDetailsPayload } from "../../context/task/types";
import { useUsersState } from "../../context/members/context";
import { useTranslation } from "react-i18next";

import {
  fetchComments, // Add the fetchComments function
  createComment, // Add the createComment function
} from "../../context/comment/actions"; // Import comment-related actions
import {
  useCommentState,
  useCommentDispatch,
} from "../../context/comment/context"; // Import comment-related context

type TaskFormUpdatePayload = TaskDetailsPayload & {
  selectedPerson: string;
  commentText: string; // Added commentText to store comment input
};

// Helper function to format the date to YYYY-MM-DD format
const formatDateForPicker = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  // Format the date as per the required format for the date picker (YYYY-MM-DD)
  return `${year}-${month}-${day}`;
};

const TaskDetails = () => {
  let [isOpen, setIsOpen] = useState(true);

  let { projectID, taskID } = useParams();
  let navigate = useNavigate();

  // Extract project and task details.
  const projectState = useProjectsState();
  const taskListState = useTasksState();
  const taskDispatch = useTasksDispatch();

  const selectedProject = projectState?.projects.filter(
    (project) => `${project.id}` === projectID
  )[0];

  const selectedTask = taskListState.projectData.tasks[taskID ?? ""];
  // Use react-form-hook to manage the form. Initialize with data from selectedTask.
  const memberState = useUsersState();

  // Access the comment dispatch and state
  const commentsDispatch = useCommentDispatch();
  const commentsState = useCommentState();
  useEffect(() => {
    if (projectID && taskID) fetchComments(commentsDispatch, projectID, taskID);
  }, [commentsDispatch, projectID, taskID]);

  const getDate = (date: Date): string => {
    const newDate = new Date(date);
    return `${newDate.toLocaleDateString("en-In")} ${newDate.toLocaleTimeString(
      "en-In",
    )}`;
  };

  const getuser = (owner: number) => {
    const user = memberState?.users.filter((member) => member.id === owner)[0];
    return user?.name;
  };

  const [selectedPerson, setSelectedPerson] = useState(
    selectedTask.assignedUserName ?? ""
  );

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<TaskFormUpdatePayload>({
    defaultValues: {
      title: selectedTask.title,
      description: selectedTask.description,
      selectedPerson: selectedTask.assignedUserName,
      dueDate: formatDateForPicker(selectedTask.dueDate),
    },
  });

  if (!selectedProject) {
    return <>No such Project!</>;
  }

  function closeModal() {
    setIsOpen(false);
    navigate("../../");
  }

  const onSubmit: SubmitHandler<TaskFormUpdatePayload> = async (data) => {
    const assignee = memberState?.users?.filter(
      (user) => user.name === selectedPerson
    )?.[0];
    updateTask(taskDispatch, projectID ?? "", {
      ...selectedTask,
      ...data,
      assignee: assignee?.id,
    });
    closeModal();
  };

  // Function to create a new comment
  const handleCreateComment = (commentText: string) => {
        const comment = {
          description: commentText,
          // task_id: parseInt(taskID, 10),
          // owner: userObject.id, // Replace with the actual user ID or authentication logic
          // userName: name, // Replace with the actual user's name or authentication logic
          // timestamp: new Date().toISOString(), // Current timestamp
        };
        console.log(comment);
      if(projectID && taskID)
      createComment(commentsDispatch, projectID, taskID, comment);
  };
  const {t} = useTranslation();

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {t('taskDetailsModalHeader')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type="text"
                        required
                        placeholder={t('newTaskTitlePlaceHolder')}
                        id="title"
                        {...register("title", { required: true })}
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="text"
                        required
                        placeholder={t('newTitleDescriptionPlaceHolder')}
                        id="description"
                        {...register("description", { required: true })}
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="date"
                        required
                        placeholder="Enter due date"
                        id="dueDate"
                        {...register("dueDate", { required: true })}
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <h3>
                        <strong>{t('assigneeText')}</strong>
                      </h3>
                      <Listbox
                        value={selectedPerson}
                        onChange={setSelectedPerson}
                      >
                        <Listbox.Button className="w-full border rounded-md py-2 px-3 my-2 text-gray-700 text-base text-left">
                          {selectedPerson}
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 max-h-60 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {memberState?.users?.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-100 text-blue-900"
                                    : "text-gray-900"
                                }`
                              }
                              value={person.name}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {person.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>


                      <div className="mt-4">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {t('commentText')}
                      </h3>
                      <div>
                        {/* Render comments from commentsState as needed */}
                        {commentsState.isLoading ? (
                          <p>Loading comments...</p>
                        ) : commentsState.isError ? (
                          <p>Error: {commentsState.errorMessage}</p>
                        ) : (
                          <div className="mt-2 space-y-4">
                            {commentsState.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="comment bg-gray-100 p-3 rounded-lg shadow-md"
                              >
                                <div className="text-gray-600">
                                  <p className="m-2">{comment.description}</p>
                                  <p className="m-2">{getDate(comment.createdAt)}</p>
                                  <p className="m-2">{getuser(comment.owner)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <input
                          type="text"
                          id="commentBox"
                          placeholder={t('addCommentBtnText')}
                          className="w-full border rounded-md py-2 px-3 my-2 text-gray-700 text-base focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                        />
                        <button
                          id="addCommentBtn"
                          type="button"
                          onClick={() => {
                            const commentBox = document.getElementById("commentBox") as HTMLInputElement | null;
                            const commentText = commentBox?.value;
                            if (commentText) {
                              handleCreateComment(commentText);
                            }
                          }}
                          className="mb-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          {t('addCommentBtnText')}
                        </button>
                      </div>
                    </div>


                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 mr-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {t('updateButtonText')}
                      </button>
                      <button
                        type="submit"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {t('cancelButtonText')}
                      </button>
                    </form>
                   
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TaskDetails;
