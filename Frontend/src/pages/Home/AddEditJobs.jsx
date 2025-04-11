// import React, { useState } from "react";
// import TagInput from "../../components/Input/TagInput";
// import { MdClose } from "react-icons/md";
// import axiosInstance from "../../utils/axiosInstance";
// const AddEditNotes = ({noteData, type,getAllNotes, onClose}) =>{
//     const [title,setTitle] = useState("");
//     const [content,setContent] = useState("");
//     const [tags,setTags] = useState([]);

//     const [error,setError] = useState("");

//     const addNewNote = async() =>{
//         try {
//             const response = await axiosInstance.post("/add-note",{
//                 title,
//                 content,
//                 tags,
//             });

//             if(response.data && response.data.note){
//                getAllNotes()
//                onClose();
//             }
//         }catch(error){
//             if(
//                 error.response &&
//                 error.response.data &&
//                 error.response.data.message
//             ){
//                 setError(error.response.data.message);
//             }
//         }
//     };

//     const editNote = async() =>{};

//     const handleAddNote = () =>{
//         if(!title) {
//             setError("Please enter the title");
//             return;
//         }

//         if(!content) {
//             setError("Please enter the content");
//             return;
//         }

//         setError("");

//         if(type == 'edit'){
//             editNote()
//         }else{
//             addNewNote();
//         }
//     }
//     return (
//         <div className="relative">
//             <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
//                 <MdClose className="text-xl text-slate-400" />
//             </button>
//             <div className="flex flex-col gap-2">
//                 <label className="input-label">Title</label>
//                 <input
//                 type="text"
//                 className="text-2xl text-slate-950 outline-none"
//                 placeholder="Go To Gym At 5"
//                 value={title}
//                 onChange={({ target }) => setTitle(target.value)}
//                 />
//             </div>

//             <div className="flex flex-col gap-2 mt-4">
//                 <label className="input-label">Content</label>
//                 <textarea
//                  type = "text"
//                  className="text-sm text-slate-950 outline-none bg-slate-20 p-2 rounded"
//                  placeholder="Content"
//                  rows={10}
//                  value={content}
//                  onChange={({target}) => setContent(target.value)}
//                 />
//             </div>

//             <div className="mt-3">
//                 <label className="input-label">TAGS</label>
//                 <TagInput tags={tags} setTags={setTags}/>
//             </div>

//             {error && <p className="text-red-500 text-xs pt-4">{error}</p> }
//             <button className="btn-primary font-medium mt-5 p-3" onClick={()=>{handleAddNote}}>
//                 Add
//             </button>
//         </div>
//     );
// };

// export default AddEditNotes;

import { useState } from "react"
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditJobs = ({
  type,
  jobData,
  onClose,
  getAllJobs,
  ShowToastMessage,
}) => {
  const [company, setCompany] = useState(jobData?.company || "");
  const [role, setRole] = useState(jobData?.role || "");
  const [deadline, setDeadline] = useState(jobData?.deadline || "");
  const [applicationLink, setApplicationLink] = useState(jobData?.applicationLink || "");
  const [status, setStatus] = useState(jobData?.status || "");
  const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setStatus(e.target.value);
//   };

  const addNewJob = async () => {
    try {
      const response = await axiosInstance.post("/add-job", {
        company,
        role,
        status,
        deadline,
        applicationLink
      });

      if (response.data && response.data.job) {
        ShowToastMessage("Job added Succesfully", "add");
        getAllJobs();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const editJob = async () => {
    // Your edit note logic here
    const noteId = jobData._id;
    try {
      const response = await axiosInstance.put(`/edit-job/${noteId}`, {
        company,
        role,
        status,
        deadline,
        applicationLink
        // jobData?.isPinned
      });

      if (response.data && response.data.job) {
        ShowToastMessage("Job update Succesfully", "add");
        getAllJobs();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddJobApplication = () => {
    if (!company) {
      setError("Please enter the company");
      return;
    }

    if (!role) {
      setError("Please enter the role");
      return;
    }

    if (!status) {
      setError("Please enter the status");
      return;
    }

    if (!deadline) {
      setError("Please enter the deadline");
      return;
    }

    if(!applicationLink){
      setError("Please enter the applicationLink");
      return;
    }

    setError("");

    if (type === "edit") {
      editJob();
    } else {
      addNewJob();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Company</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Name of Company"
          value={company}
          onChange={({ target }) => setCompany(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Role</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Role"
          value={role}
          onChange={({ target }) => setRole(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
        //   onChange={handleChange}
        onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white text-gray-700"
        >
          <option value="Select">Select</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-3">
        <label className="input-label" htmlFor="deadline">
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-700"
        />
      </div>

      <div className="mt-3">
        <label className="input-label" htmlFor="applicationLink">
          Application Link
        </label>
        <input
          type="url"
          id="applicationLink"
          name="applicationLink"
          placeholder="https://example.com"
          value={applicationLink}
          onChange={(e) => setApplicationLink(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-700"
        />
        {applicationLink && (
          <a
            href={applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm mt-1 inline-block underline"
          >
            View Application Link
          </a>
        )}
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddJobApplication} // Corrected this line
      >
        {type == "edit" ? "update Application" : "Add Job Application"}
      </button>
    </div>
  );
};

export default AddEditJobs;
