import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import JobCard from "../../components/Cards/JobCard";
import { MdAdd } from "react-icons/md";
import AddEditJobs from "../../pages/Home/AddEditJobs";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteimg from "../../../public/add-note.svg"

function Home() {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allJobsApllication, setAllJobs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const ShowToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllJobs = async () => {
    try {
      const response = await axiosInstance.get("/get-all-jobs");
      if (response.data && response.data.jobs) {
        setAllJobs(response.data.jobs);
      }
    } catch (error) {
      console.log("An unexpected error occured.Please try again.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      if (response.data && !response.data.error) {
        ShowToastMessage("Note Deleted Succesfully", "delete");
        getAllJobs();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occured.Please try again.");
      }
    }
  };

  const onSearchJobs = async (query) => {
    if (!query || !query.search) {
      console.log("Invalid search query.");
      return;
    }
  
    try {
      const response = await axiosInstance.get("/search-jobs", {
        params: {query},
      });
  
      if (response.data && response.data.jobs) {
        setIsSearch(true);
        setAllJobs(response.data.jobs);
      } else {
        setAllJobs([]); // Clear notes if no search results
        console.log("No notes found for the search query.");
      }
    } catch (error) {
      console.error("Error searching notes:", error.response || error.message);
    }
  };

  const updateisPinned = async (item) => {
    const jobId = item._id; 
    try {
        const response = await axiosInstance.put(`/update-job-pinned/${jobId}`, {
            "isPinned" : !item.isPinned
        });

        if (response.data && response.data.note) {
          ShowToastMessage("Note update Succesfully", "add");
          getAllJobs();
        }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getUserInfo();
    getAllJobs();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userinfo={userInfo} onSearchJobs={onSearchJobs}/>
      {/* {console.log("Ye hai home wala",userInfo)} */}
      <div className="container mx-auto w-[90vw]">
       {allJobsApllication.length > 0 ?(
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allJobsApllication.map((item) => (
              <JobCard
                key={item._id}
                company={item.company}
                date={item.createdOn}
                role={item.role}
                // tags={item.tags}
                status={item.status}
                isPinned={item.isPinned}
                onEdit={() => {
                  handleEdit(item);
                }}
                onDelete={() => {
                  deleteNote(item);
                }}  
                onPinNote={() => {updateisPinned(item)}}
                applicationLink = {item.applicationLink}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
            img = {addNoteimg}
            message = {"Click on the 'Add' button to add Jobs, roles and application deadline. Let's get started!"}
          />
        )}
      </div>

      {/* Add Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 ovrflow-scroll"
      >
        <AddEditJobs
          type={openAddEditModel.type}
          jobData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllJobs={getAllJobs}
          ShowToastMessage={ShowToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
