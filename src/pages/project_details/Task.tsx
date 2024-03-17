import React, { forwardRef, useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskDetails } from "../../context/task/types";
import "./TaskCard.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTasksDispatch } from "../../context/task/context";
import { deleteTask } from "../../context/task/actions";
import { useTranslation } from "react-i18next";

const Task = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ task: TaskDetails }>
>((props, ref) => {
  const taskDispatch = useTasksDispatch();
  const { projectID } = useParams();
  const { task } = props;
  const {t} = useTranslation();

  // Date Localization
 function FormattedDate({ dateString }) {
    const { i18n } = useTranslation();
    const [formattedDate, setFormattedDate] = useState('');
  
    useEffect(() => {
      if (dateString) {
        const date = new Date(dateString);
        const locale = i18n.language;
        const dateFormatter = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  
        const formattedDate = dateFormatter.format(date);
        setFormattedDate(formattedDate);
      }
    }, [dateString, i18n.language]);
  
    return <span>{formattedDate}</span>;
  }

  // Time Localization
  function FormattedTime() {
    const { i18n } = useTranslation();
    const [formattedTime, setFormattedTime] = useState('');
  
    useEffect(() => {
      const date = new Date();
      const locale = i18n.language; // Get the current language from react-i18next
      const timeFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
  
      const formattedTime = timeFormatter.format(date);
      setFormattedTime(formattedTime);
    }, [i18n.language]); // Re-run effect when language changes
  
    return <span>{formattedTime}</span>;
  }

  return (
    <div ref={ref} {...props} className="m-2 flex">
      <Link
        className="TaskItem w-full shadow-md border border-slate-100 bg-white"
        to={`tasks/${task.id}`}
      >
        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div>
  <h2 className="text-base font-bold my-1">{task.title}</h2>

  {/* Formatted Date */}
  <p className="text-sm text-slate-500">
    <FormattedDate dateString={task.dueDate} />
  </p>
  
  {/* Formatted Time */}
  <p className="text-sm text-slate-500">
    <FormattedTime />
  </p>
 
  <p className="text-sm text-slate-500">{t('desctiptionText')}: {task.description}</p>
  <p className="text-sm text-slate-500">
    {t('assigneeText')}: {task.assignedUserName ?? "-"}
  </p>
</div>
          <button
            className="deleteTaskButton cursor-pointer h-4 w-4 rounded-full my-5 mr-5"
            onClick={(event) => {
              event.preventDefault();
              deleteTask(taskDispatch, projectID ?? "", task);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 fill-red-200 hover:fill-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </button>
        </div>
      </Link>
    </div>
  );
});

const Container = (
    props: React.PropsWithChildren<{
      task: TaskDetails;
      index: number;
    }>
  ) => {
    return (
      <Draggable index={props.index} draggableId={`${props.task.id}`}>
        {(provided) => (
          <Task
            task={props.task}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          />
        )}
      </Draggable>
    );
  };
export default Container;
