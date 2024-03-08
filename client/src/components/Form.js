import { Box, Stack, Typography, TextField, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import {
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Location from "./Location";
import Countries from "./Location";

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    hobbies: [],
  });

  const clickHandler = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHobbyKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setFormData((prevState) => ({
        ...prevState,
        hobbies: [...prevState.hobbies, e.target.value.trim()],
      }));
      e.target.value = "";
    }
  };

  const handleRemoveHobby = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      hobbies: prevState.hobbies.filter((_, i) => i !== index),
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber) && phoneNumber.length === 10;
  };

  const submitHandler = async (e) => {
    try {
      const response = await fetch("http://localhost:4000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
    } catch (error) {
      console.error({ "Error:": error.message });
    }

    navigate("/data");
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
        <Typography variant="h3">User Form</Typography>
        <TextField
          label="User Name"
          name="name"
          value={formData.name}
          required
          onChange={clickHandler}
          autoComplete="off"
          error={formData.name.trim() === ""}
          helperText={
            formData.name.trim() === "" ? "User Name is required" : ""
          }
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          required
          onChange={clickHandler}
          autoComplete="off"
          error={formData.email.trim() !== '' || !isValidEmail(formData.email)}
          helperText={
            formData.email.trim() === '' ? "Email is required" :
            !isValidEmail(formData.email) ? "Invalid email format" : ""
          }
        />
        <TextField
          label="Mobile Number"
          name="number"
          value={formData.number}
          required
          onChange={clickHandler}
          autoComplete="off"
          error={!isValidPhoneNumber(formData.number)}
          helperText={
            !isValidPhoneNumber(formData.number)
              ? "Mobile Number is either invalid or is less than 10 digits"
              : ""
          }
        />

        <TextField
          label="Hobbies"
          name="hobbies"
          onKeyDown={handleHobbyKeyDown}
          autoComplete="off"
        />
        <Stack direction="row">
          {formData.hobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              onDelete={() => handleRemoveHobby(index)}
              sx={{ marginRight: 1, marginBottom: 1 }}
              color="primary"
            />
          ))}
        </Stack>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" onClick={submitHandler}>
            Submit
          </Button>
        </Box>
      </Stack>
    </Layout>
  );
}

export default Form;
