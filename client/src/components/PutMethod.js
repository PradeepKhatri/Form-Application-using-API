import Layout from "./Layout";
import { useEffect, useState } from "react";
import { Stack, Typography, TextField, Box, Button } from "@mui/material";
import { json } from "react-router-dom";

const PutMethod = () => {
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    body: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const fetchApi = async() => {
    try {
      const idField = postData.id;
      const response = await fetch(`http://localhost:5000/items/${idField}`);
      if(!response.ok) {
        throw new Error("Network Response was not okay")
      }
      const jsonData = await response.json();

      setPostData({
        title:jsonData.title,
        body: jsonData.body
      });

    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if(postData.id !== ""){
      fetchApi();
    }
  }, [postData.id]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const postId = postData.id;
    const apiURL = `https://jsonplaceholder.typicode.com/posts/${postId}`;

    const requestOPtions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/layers",
      },
      body: JSON.stringify(postData),
    };

    fetch(apiURL, requestOPtions)
      .then((response) => response.json())
      .then((data) => {
        setMessage("Updated Successfully!");
        console.log("Updated Data:", postData);
      })
      .catch((error) => {
        console.log("Error:", error);
        setMessage("Error Updating Data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout>
      <Stack
        spacing={3}
        sx={{
          border: "1px solid #ddd",
          margin: "4%",
          padding: "40px",
          borderRadius: "7px",
        }}
      >
        <Typography variant="h5">Fetch API Put Method</Typography>

        {loading && <Typography variant="h6">Loading...</Typography>}
        {message && <Typography variant="h6">{message}</Typography>}

        <TextField
          label="Index"
          name="id"
          value={postData.id}
          onChange={changeHandler}
        />
        <TextField
          label="Title"
          name="title"
          value={postData.title}
          onChange={changeHandler}
        />
        <TextField
          label="Body"
          name="body"
          value={postData.body}
          onChange={changeHandler}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" onClick={submitHandler}>
            Update
          </Button>
        </Box>
      </Stack>
    </Layout>
  );
};

export default PutMethod;
