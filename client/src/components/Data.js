import Layout from "./Layout";
import React from "react";
import { Link, TextField, useScrollTrigger } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Button, Typography } from "@mui/material";
import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useState } from "react";
import { TableFooter, TablePagination } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditButton from "./EditButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddDataButton from "./AddDataButton";

const Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [openDialogs, setOpenDialogs] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://form-application-using-api.onrender.com/data?page=${page}&pageSize=${rowsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Network Response was nto OK");
      }
      const { data: jsonData, totalItems: total } = await response.json();
      setData(jsonData);
      setTotalItems(total);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const handleDelete = async (id) => {

    fetch(`http://localhost:4000/data/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response for desired id was not okay");
        }
        return response.json();
      })
      .then(async () => {
        handleCloseDialog(id);
        await fetchData();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleButtonClick = () => {
    navigate("/form");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialog = (rowId) => {
    setOpenDialogs({ ...openDialogs, [rowId]: false });
  };

  const handleOpenDialog = (rowId) => {
    setOpenDialogs({ ...openDialogs, [rowId]: true });
  };

  const handleRowSelect = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter((rowId) => rowId !== id);
    }

    setSelectedRows(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedRows = data.map((entry) => entry._id);
      setSelectedRows(newSelectedRows);
      return;
    }
    setSelectedRows([]);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const handleSendClick = () => {

    if (selectedRows.length === 0) {
      alert('Please select at least one row to send email.');
      return;
    }

    const selectedData = data.filter((entry) =>
      selectedRows.includes(entry._id)
    );

    const emailBody = selectedData.map((entry) => {
      return `Name: ${entry.name}, Email: ${entry.email}, Number: ${entry.number}, Hobbies: ${entry.hobbies.join(', ')}`;
    }).join('\n\n');
  
    const recipient = 'info@redpositive.in';
    const subject = 'Selected Data';
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  
    window.location.href = mailtoLink;
  };

  return (
    <Layout>
      <Stack
        spacing={3}
        sx={{
          margin: "4%",
        }}
      >
        {loading ? (
          <Typography variant="h4" align="center" marginTop={4}>
            Loading...
          </Typography>
        ) : (
          <Stack>
            <Typography variant="h4" textAlign="center" marginTop={4}>
              User Data
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < data.length
                        }
                        checked={selectedRows.length === data.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell align="center">INDEX</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Number</TableCell>
                    <TableCell align="center">Hobbies</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((entry, index) => (
                    <TableRow
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f0f0f0" : "",
                      }}
                      key={entry._id}
                    >
                      <TableCell align="center">
                        <Checkbox
                          checked={isSelected(entry._id)}
                          onChange={(event) =>
                            handleRowSelect(event, entry._id)
                          }
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.number}</TableCell>
                      <TableCell>
                        {entry.hobbies ? entry.hobbies.join(", ") : ""}
                      </TableCell>

                      <TableCell align="center">
                        <EditButton rowId={entry._id} />

                        <IconButton onClick={() => handleOpenDialog(entry._id)}>
                          <DeleteIcon />
                        </IconButton>

                        <Dialog open={openDialogs[entry._id] || false} onClose={() => handleCloseDialog(entry._id)}>
                          <DialogTitle>Confirm Delete User</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Permanently deletes user information.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                          <Button onClick={() => handleCloseDialog(entry._id)}>Cancel</Button>
      <Button onClick={() => handleDelete(entry._id)} autoFocus>
        Delete
      </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Stack>
        )}
        <Stack
          direction="row"
          display="flex"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <AddDataButton />
          <Button variant="contained" onClick={handleSendClick}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Data;
