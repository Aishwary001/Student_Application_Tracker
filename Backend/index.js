require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const User = require("./models/user.model");
const Job = require("./models/job.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// app.use(
//         cors({
//             origin: "http://localhost:5173",
//         })
//     );

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful"
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        })

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        })
    }
})

app.get("/get-user",authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({_id:user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:{fullName:isUser.fullName,email:isUser.email,"_id": isUser._id,createdOn : isUser.createdOn},
        message:"",
    });
});

app.post("/add-job",authenticateToken, async(req, res) => {
    const { company, role, status, deadline, applicationLink } = req.body;
    const { user } = req.user;

    if (!company) {
        return res.status(400).json({error: true, message: "Company name is required"})
    }

    if (!role) {
        return res.status(400).json({ error: true, message: "role is required" })
    }

    if (!status) {
        return res.status(400).json({ error: true, message: "status is required" })
    }

    if (!deadline) {
        return res.status(400).json({ error: true, message: "deadline is required" })
    }

    if (!applicationLink) {
        return res.status(400).json({ error: true, message: "applicationLink is required" })
    }

    try {
        const job = new Job({ company,role,status,userId: user._id,createdOn : deadline, applicationLink : applicationLink });
        await job.save();
        return res.json({
            error: false,
            job,
            message: "Job added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
});

app.put("/edit-job/:jobId",authenticateToken , async (req, res) => {
    const jobId = req.params.jobId;
    const { company, status, role, deadline, applicationLink } = req.body;
    const { user } = req.user;

    if (!company && !status && !role && !deadline, !applicationLink) {
        return res
            .status(400)
            .json({ error: true, message: "No change provided" })
    }

    try {
        const job = await Job.findOne({ _id: jobId, userId: user._id });

        if (!job) {
            return res.status(404).json({ error: true, message: "job not found" });
        }

        if (company) job.company = company;
        if (status) job.status = status;
        if (role) job.role = role;
        if (deadline) job.createdOn = deadline;
        if (applicationLink) job.applicationLink = applicationLink
        // if (isPinned !== undefined) job.isPinned = isPinned;

        await job.save();

        return res.json({
            error: false,
            job,
            message: "Job updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.get("/get-all-jobs",authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const jobs = await Job.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            jobs,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.delete("/delete-note/:jobId",authenticateToken, async (req, res) => {
    const jobId = req.params.jobId;
    const { user} = req.user;

    try{
        const job = await Job.findOne({ _id : jobId, userId : user._id });

        if(!job){
            return  res.status(404).json({error:true,message:"Job not found"});
        }
        
        await Job.deleteOne({_id:jobId,userId:user._id});

        return res.json({
            error:false,
            message : "Job deleted successfully",
        });
    }catch(error){
        return res.status(500).json({
            error : true,
            message : "Internal Server Error",
        })
    }
});

app.put("/update-job-pinned/:jobId",authenticateToken, async (req, res) => {
    const jobId = req.params.jobId;
    const { isPinned } = req.body;
    const { user } = req.user;

    if (isPinned === undefined) {
        return res
            .status(400)
            .json({ error: true, message: "isPinned value is required" });
    }

    try {
        const job = await Job.findOne({ _id: jobId, userId: user._id });

        if (!job) {
            return res.status(404).json({ error: true, message: "Job not found" });
        }

        job.isPinned = isPinned;

        await job.save();

        return res.json({
            error: false,
            job,
            message: "Job updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.get("/search-jobs",authenticateToken, async (req,res) => {
    const { query } = req.query;
    const { user } = req.user;

    if(!query){
        return res.status(404).json({message: "Search query is required",error : false});
    }

    try {
        const matchingNotes = await Job.find({
            userId : user._id,
            $or : [
                {company : { $regex : new RegExp(query, "i")}},
                {role : { $regex : new RegExp(query, "i")}},
            ]
        })

        return res.json({
            error : false,
            jobs : matchingNotes,
            message : "Job matching the search query retried succefully!",
        })
    }catch(error){
        return res.status(404).json({message: "Internal Server Error",error : true});
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
