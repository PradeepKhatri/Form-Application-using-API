const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3030;

const User = require("./models/dataModel");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello World");
});

app.post("/data", async (req, res) => {
  try {
    const UserDetails = await User.create(req.body);
    res.status(200).json(UserDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/data", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const searchQuery = req.query.searchQuery;

    const sortKey = req.query.sortKey;
    const sortDirection = req.query.sortDirection;

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const searchCriteria = {
      $or: [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { email: { $regex: new RegExp(searchQuery, "i") } }
      ],
    };

    const numericValue = parseInt(searchQuery);
    if (!isNaN(numericValue)) {
      searchCriteria.$or.push({ number: numericValue });
    }

    const sortConf = {};
    if(sortKey && sortDirection) {
      sortConf[sortKey] = sortDirection === 'ascending' ? 1 : -1;
    }

    const paginatedData = await User.find(searchCriteria)
    .sort(sortConf)
      .skip(startIndex)
      .limit(pageSize);

    const totalItems = await User.countDocuments(searchCriteria);
    res.status(200).json({ data: paginatedData, totalItems: totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const UserDetail = await User.findById(id);
    res.status(200).json(UserDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const formData = await User.findByIdAndDelete(id);
    res.status(200).json({ message: `deleted succesfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const UserDetails = await User.findByIdAndUpdate(id, req.body);
    res.status(200).json(UserDetails);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

mongoose
  .connect("mongodb://localhost:27017/form")
  .then(() => console.log("DB Connected"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
