import { React } from "react";
import { Stack, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Navigate, useNavigate,Link } from "react-router-dom";

const Nav = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/form');
    }

    return (
        <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }} mr={3}>Lorem Ipsum</Typography>
                    <Stack direction='row' spacing={2}>
                        <Button color="inherit" component={Link} to='/ '>Home</Button> 
                        <Button color="inherit" onClick={handleClick}>Form</Button>
                        <Button color="inherit" component={Link} to='/data'>Data</Button>
                        {/* <Button color="inherit" component={Link} to='/get'>Get</Button> */}
                        {/* <Button color="inherit" component={Link} to='/post'>Post</Button> */}
                        {/* <Button color="inherit" component={Link} to='/put'>Put</Button> */}
                        {/* <Button color="inherit" component={Link} to='/delete'>Delete</Button> */}
                    </Stack>        
                </Toolbar>
            </AppBar>
    )
}

export default Nav;