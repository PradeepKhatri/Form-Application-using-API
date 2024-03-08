import { Stack } from "@mui/material";
import Navbar from './Nav'

const Layout = ({children}) => {
    return (
        <Stack>
            <Navbar />
            {children}
        </Stack>
    )
}

export default Layout;