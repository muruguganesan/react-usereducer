import "./App.css";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import notes from "../public/assets/notes.png";
import { useReducer, useState } from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

import { Formik, Field, Form } from "formik";

import type { FieldProps } from "formik";


type TodoInitialValuesType = {
  id: number;
  title: string;
  description: string;
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

// todoItemsJson = [];

const todoReducer = (
  state: TodoInitialValuesType[],
  action: TodoActionType
): TodoInitialValuesType[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    default:
      return state;
  }
};

function App() {
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddTodo = () => setOpenAddModal(true);
  const closeAddModal = () => setOpenAddModal(false);

  const [currentState, dispatch] = useReducer(todoReducer, todoInitialValues);

  const addTodo = () => {
    dispatch({
      type: "ADD",
      payload: {
        id: Date.now(),
        title: "dd",
        description: "dddd",
      },
    });
    closeAddModal();
  };
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
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Formik
            initialValues={{ title: "", description: "" }}

            onSubmit={(values) => {
              console.log("values", values);
              dispatch({
                type: "ADD",
                payload: {id: Date.now(), ...values},
              });
              closeAddModal();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="add_todo_title">
                  <Typography variant="h6">Add New Note</Typography>
                  <IconButton aria-label="close" onClick={closeAddModal}>
                    <CloseIcon />
                  </IconButton>
                </div>

                <Field component={Title} name="title" value="title" />
                <Field component={Description} name="description" />

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
  return (
    <TextField
      {...field}

      label="Description"
      type="text"
      multiline
      rows={4}
      sx={{ mt: 3, width: "100%" }}
      name="description"
    />
  )}