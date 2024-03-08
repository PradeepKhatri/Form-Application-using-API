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

import Chip from '@mui/material/Chip';
import EditNoteIcon from "@mui/icons-material/EditNote";

const AddDataButton = () => {

    const [open, setOpen] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [formData, setFormData] = useState({
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

      const handleTextChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };

      const handleHobbyKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
          e.preventDefault();
          setFormData((prevState) => ({
            ...prevState,
            hobbies: [...prevState.hobbies, e.target.value.trim()],
          }));
          e.target.value = '';
        }
      };
    
      const handleRemoveHobby = (index) => {
        setFormData((prevState) => ({
          ...prevState,
          hobbies: prevState.hobbies.filter((_, i) => i !== index),
        }));
      };

      const handleSubmit = async (e) => {
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

        setOpen(false);
        setRefreshPage(true);


      };

      if (refreshPage) {
        window.location.reload();
        setRefreshPage(false); 
      }
    
      return (
        <>
         <Button variant="contained" onClick={async () => {
              await handleOpenClick();
            }}>
            Add New Data
          </Button>
            
    
          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Add User</DialogTitle>
    
            <DialogContent>
              <Stack display="flex" spacing={3} marginTop={2}>
                <TextField
                  name="name"
                  label="User Name"
                  value={formData.name}
                  onChange={handleTextChange}
                />
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleTextChange}
                />
                <TextField
                  name="number"
                  label="Mobile Number"
                  value={formData.number}
                  onChange={handleTextChange}
                />
                
                <TextField
          label="Hobbies"
          name="hobbies"
          onKeyDown={handleHobbyKeyDown}
          autoComplete="off"
        />
        <Stack direction="row" >
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
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </>
      );
    };

export default AddDataButton;