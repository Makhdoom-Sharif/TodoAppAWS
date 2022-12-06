import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { TodoCard } from "../component/TodoCard";
import { createTodo, deleteTodo, updateTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";

function Home() {
  const [btntext, setBtntext] = useState("Add");
  const [indexNew, setindexNew] = useState();
  const [resetBit, setResetBit] = useState(false);
  const [dataInput, setDataInput] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [deleteLoading, setDeleteLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [snackbarData, setSnackbarData] = useState({
    severity: "",
    message: "",
  });
  const handleChange = (key, value) => {
    setDataInput({
      ...dataInput,
      [key]: value,
    });
  };

  const submitHandler = (e) => {
    setLoading(true);
    dataInput?.name?.trim()
      ? btntext === "Add"
        ? addTodo()
        : updateItem()
      : error();
    e.preventDefault();
  };
  const error = () => {
    setSnackbarData({
      severity: "error",
      message: "Title must be filled",
    });

    setOpenSnackBar(true);
    setLoading(false);
  };

  const deleteItem = async (id, index) => {
    // setDeleteLoading(true);
    try {
      const todoData = await API.graphql(
        graphqlOperation(deleteTodo, { input: { id } })
      );
      const tempList = [...data];
      tempList.splice(index, 1);

      setSnackbarData({
        severity: "success",
        message: "Item deleted successfully",
      });
      setOpenSnackBar(true);
      //   setDeleteLoading(false);
      setData(tempList);
    } catch (e) {
      //   setDeleteLoading(false);
      setSnackbarData({
        severity: "error",
        message: "Unable to perform task",
      });
      setOpenSnackBar(true);
    }
  };
  const resetItem = () => {
    // setDisable(false);
    setResetBit(false);
    setDataInput({ name: "", description: "" });
    setBtntext("Add");
  };
  const updatebtn = (card, index) => {
    setResetBit(true);
    setDataInput(card);
    setBtntext("Update");
    setindexNew(index);
  };
  const updateItem = async () => {
    try {
      const { completed, description, id, name } = dataInput;
      const todoData = await API.graphql(
        graphqlOperation(updateTodo, {
          input: { completed, description, id, name },
        })
      );

      data[indexNew] = todoData.data.updateTodo;
      setData([...data]);
      setSnackbarData({
        severity: "success",
        message: "Item updated successfully",
      });
      setOpenSnackBar(true);
      setResetBit(false);
      setLoading(false);
      setBtntext("Add");
      setDataInput({ name: "", description: "" });
    } catch (e) {
      setSnackbarData({
        severity: "error",
        message: "Unable to perform task",
      });
      setOpenSnackBar(true);
    }
  };

  const fetchList = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setData(todos);
      setFetchData(false);
    } catch (err) {
      setFetchData(false);
      setSnackbarData({
        severity: "error",
        message: err,
      });
      setOpenSnackBar(true);
    }
  };
  const addTodo = async () => {
    try {
      const todoData = await API.graphql(
        graphqlOperation(createTodo, { input: dataInput })
      );
      setDataInput({ name: "", description: "" });

      setLoading(false);

      setData([...data, todoData.data.createTodo]);
      setSnackbarData({
        severity: "success",
        message: "Item added successfully",
      });
      setOpenSnackBar(true);
    } catch (e) {
      setLoading(false);
      setSnackbarData({
        severity: "error",
        message: "Unable to perform task",
      });
      setOpenSnackBar(true);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  const handleCloseSnackbar = () => {
    setOpenSnackBar(!openSnackBar);
  };
  return (
    <>
      <div className="container">
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSnackBar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarData?.severity}
              sx={{ width: "100%" }}
            >
              {snackbarData?.message}
            </Alert>
          </Snackbar>
        </div>

        <form onSubmit={(e) => submitHandler(e)}>
          <div id="newtask">
            <input
              style={{ marginBottom: 30 }}
              multiple
              placeholder="Enter Title"
              value={dataInput?.["name"]}
              name="name"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            ></input>
            <input
              multiple
              placeholder="Enter Description"
              value={dataInput?.["description"]}
              style={{ marginBottom: 30 }}
              name="description"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            ></input>
            {loading ? (
              <CircularProgress disableShrink />
            ) : (
              <LoadingButton style={{ marginLeft: "5px" }} type="submit">
                {btntext}
              </LoadingButton>
            )}
            {resetBit && (
              <LoadingButton
                style={{ marginLeft: "5px", marginTop: 30 }}
                onClick={() => resetItem()}
              >
                Reset
              </LoadingButton>
            )}
          </div>
        </form>
      </div>
      <div className="main">
        <TodoCard
          data={data}
          deleteItem={deleteItem}
          updatebtn={updatebtn}
          //   deleteLoading={deleteLoading}
          fetchData={fetchData}
        />
      </div>
    </>
  );
}
export default Home;
