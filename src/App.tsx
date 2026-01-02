import "./App.css";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import notes from "../public/assets/notes.png";
import { useReducer, useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

import { Formik, Field, Form } from "formik";

import type { FieldProps } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";

import type { AlertColor } from "@mui/material/Alert";

import { useMediaQuery } from "react-responsive";

import * as Yup from "yup";

type TodoInitialValuesType = {
  id: number;
  title?: string;
  description?: string;
};

type TodoActionType = {
  type: string;
  payload: TodoInitialValuesType;
};

const todoInitialValues = [
  {
    id: 1,
    title: "Learn JavaScript",
    description: "Promise, Callback, Arguments Object",
  },
  {
    id: 2,
    title: "Learn React",
    description: "State, Props, useState, useEffect",
  },
  {
    id: 3,
    title: "Learn Web Development Basics",
    description: "HTML, CSS, SASS",
  },
];

function App() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number>(0);
  const [snackBarText, setSnackBarText] = useState(
    "Todo Deleted Successfully !!!"
  );
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [toastType, setToastType] = useState<AlertColor>("success");
  const [addEditModalTitle, setAddEditModalTitle] = useState("Add New");
  const [formInitialValues, setFormInitialValues] = useState({
    title: "",
    description: "",
  });
  const [formModalType, setFormModalType] = useState("add");
  const [editTodoItem, setEditTodoItem] = useState(0);

  const handleAddTodo = () => {
    setFormInitialValues({
      title: "",
      description: "",
    });
    setFormModalType("add");
    setAddEditModalTitle("Add New");
    setOpenAddModal(true);
  };
  const closeAddModal = () => {
    setOpenAddModal(false);
  };
  const openDeleteModalFn = () => setOpenDeleteModal(true);
  const closeDeleteModalFn = () => setOpenDeleteModal(false);

  const todoReducer = (
    state: TodoInitialValuesType[],
    action: TodoActionType
  ): TodoInitialValuesType[] => {
    switch (action.type) {
      case "ADD":
        return [...state, action.payload];
      case "DELETE":
        return state.filter((ele) => ele.id !== action.payload.id);
      case "UPDATE":
        return state.map((ele) => {
          if (ele.id === action.payload.id) {
            return {
              id: ele.id,
              title: action.payload.title,
              description: action.payload.description,
            };
          }
          return ele;
        });

      default:
        return state;
    }
  };

  const [currentState, dispatch] = useReducer(todoReducer, todoInitialValues);

  const deleteTodoFn = () => {
    setSnackBarText("Notes Deleted Successfully !!!");
    setToastType("error");
    dispatch({ type: "DELETE", payload: { id: deleteTodoId } });
    closeDeleteModalFn();
    setOpenSnackbar(true);
  };
  const closeSnackbar = () => setOpenSnackbar(false);
  const editModalOpen = (id: number) => {
    setEditTodoItem(id);
    setFormModalType("edit");

    const actualItem: any = currentState.filter((ele) => ele.id === id)[0];
    setFormInitialValues(actualItem);

    setAddEditModalTitle("Edit");
    setOpenAddModal(true);
  };
  const isMobilePortrait = useMediaQuery({ query: "(max-width: 400px)" });

  const addFormValidationSchema = Yup.object({
    title: Yup.string().required("Title is Required"),
    description: Yup.string().required("Description is Required"),
  });

  return (
    <div className="wrapper">
      <header>
        <h1 className="app_name">
          <img src={notes} alt="" className="todo_logo" />
          <span>Notely</span>
        </h1>
        <p className="app_tagline">(A Simple Notes App)</p>
        <div className="add_todo_wrap">
          <div className="add_todo_inp">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddCircleIcon />}
              onClick={handleAddTodo}
            >
              Add Note
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="todo_items_wrap">
          {currentState.length > 0 ? (
            <>
              {currentState.map((ele) => (
                <div className="todo_item" key={ele.id}>
                  <div className="icon_wrap">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setDeleteTodoId(ele.id);
                        openDeleteModalFn();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      onClick={() => editModalOpen(ele.id)}
                    >
                      <EditNoteIcon />
                    </IconButton>
                  </div>

                  <h6 className="todo_title">{ele.title}</h6>
                  <p className="todo_desc">{ele.description}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="video_wrap">
              <video autoPlay loop muted className="no_data_video">
                <source
                  src="/public/assets/no_data_found1.webm"
                  type="video/webm"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <Modal open={openAddModal} onClose={closeAddModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobilePortrait ? 300 : 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Formik
            initialValues={formInitialValues}
            validationSchema={addFormValidationSchema}
            onSubmit={(values) => {
              setToastType("success");

              if (formModalType === "add") {
                setSnackBarText("Notes Added Successfully !!!");
                dispatch({
                  type: "ADD",
                  payload: { id: Date.now(), ...values },
                });
              } else {
                setSnackBarText("Notes Updated Successfully !!!");
                dispatch({
                  type: "UPDATE",
                  payload: { id: editTodoItem, ...values },
                });
              }

              closeAddModal();
              setOpenSnackbar(true);
              setFormInitialValues({ title: "", description: "" });
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                <div className="add_todo_title">
                  <Typography variant="h5">{addEditModalTitle} Note</Typography>
                  <IconButton aria-label="close" onClick={closeAddModal}>
                    <CloseIcon />
                  </IconButton>
                </div>

                <Field component={Title} name="title" value="title" />
                <span className="error_wrap">
                {errors.title && <Typography variant="body1" color="error">{errors.title}</Typography>}

                </span>
                <Field component={Description} name="description" />
                <span className="error_wrap">
                {errors.description && <Typography variant="body1" color="error">{errors.description}</Typography>}

                </span>


                <div className="add_todo_btns">
                  <Button
                    variant="outlined"
                    onClick={closeAddModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    // onClick={addTodo}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit Note
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      {/* Delete Modal */}
      <Modal open={openDeleteModal} onClose={closeDeleteModalFn}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobilePortrait ? 300 : 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <div className="add_todo_title">
            <Typography variant="h5">Delete Todo</Typography>
            <IconButton aria-label="close" onClick={closeDeleteModalFn}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="h6" className="delete_todo_tx">
            Are you sure you want to delete?
          </Typography>
          <div className="add_todo_btns">
            <Button variant="outlined" onClick={closeDeleteModalFn}>
              Cancel
            </Button>
            <Button variant="contained" onClick={deleteTodoFn} color="error">
              Delete
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackBar}
        message={snackBarText}
        autoHideDuration={1200}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={toastType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;

const Title = ({ field }: FieldProps) => {
  return (
    <TextField
      {...field}
      label="Title"
      type="text"
      sx={{ mt: 1, width: "100%" }}
      name="title"
    />
  );
};

const Description = ({ field }: FieldProps) => {
  const isMobilePortrait = useMediaQuery({ query: "(max-width: 600px)" });
  return (
    <TextField
      {...field}
      label="Description"
      type="text"
      multiline
      rows={isMobilePortrait ? 2 : 4}
      sx={{ mt: 3, width: "100%" }}
      name="description"
    />
  );
};
