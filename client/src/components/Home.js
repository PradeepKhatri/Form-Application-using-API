import { Stack,Typography } from "@mui/material";
import Layout from "./Layout";

const Home = () => {
  return (
    <Layout>
      <Stack
        spacing={3}
        sx={{
        //   border: "1px solid #ddd",
          margin: "4%",
          padding: "40px",
        //   borderRadius: "7px",  
        }}
      >
        <Typography variant="h2" textAlign='center '>HOME PAGE</Typography>
      </Stack>
    </Layout>
  );
};

export default Home;
