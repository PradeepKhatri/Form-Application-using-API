import React, { useEffect, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Stack,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

const EditButton = ({ rowId }) => {
  const [open, setOpen] = useState(false);
  const [idData, setIdData] = useState({
    name: "",
    email: "",
    number: "",
    hobbies: [],
  });

  const handleOpenClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async (rowId) => {
    try {
      const response = await fetch(`http://localhost:4000/data/${rowId}`);
      const jsonData = await response.json();
      setIdData(jsonData);
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  const handleEditClick = () => {
    fetchData(rowId);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:4000/data/${rowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idData),
      });
      const jsonData = await response.json();
      handleClose();
      await fetchData(rowId);
      window.location.reload();
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setIdData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber) && phoneNumber.length === 10;
  };

  return (
    <>
      <IconButton
        onClick={async () => {
          await handleOpenClick();
          handleEditClick(rowId);
        }}
      >
        <EditNoteIcon fontSize="large" />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit User Details</DialogTitle>

        <DialogContent>
          <Stack display="flex" spacing={3} marginTop={2}>
            <TextField
              name="name"
              label="User Name"
              value={idData.name}
              onChange={handleTextChange}
              autoComplete="off"
              error={idData.name.trim() === ""}
              helperText={
                idData.name.trim() === "" ? "User Name is required" : ""
              }
            />
            <TextField
              name="email"
              label="Email"
              value={idData.email}
              onChange={handleTextChange}
              autoComplete="off"
              error={!isValidEmail(idData.email)}
              helperText={
                !isValidEmail(idData.email) ? "Invalid email format" : ""
              }
            />
            <TextField
              name="number"
              label="Mobile Number"
              value={idData.number}
              onChange={handleTextChange}
              autoComplete="off"
              error={!isValidPhoneNumber(idData.number)}
              helperText={
                !isValidPhoneNumber(idData.number)
                  ? "Mobile Number is either invalid or is less than 10 digits"
                  : ""
              }
            />
            <TextField
              name="hobbies"
              label="Hobbies"
              value={idData.hobbies}
              onChange={handleTextChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleSaveChanges(rowId);
            }}
          >
            Save Changes
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditButton;
