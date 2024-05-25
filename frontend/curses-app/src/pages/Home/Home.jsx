import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CurseCard from "../../components/Cards/CurseCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditCurses from "./AddEditCurses";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AddCursesImg from "../../assets/images/add-curses.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const [allCurses, setAllCurses] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const handleEdit = (curseDetails) => {
    setOpenAddEditModal({ isShown: true, data: curseDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get all Curses
  const getAllCurses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-curses");

      if (response.data && response.data.curses) {
        setAllCurses(response.data.curses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete Curse
  const deleteCurse = async (data) => {
    const curseId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-curse/" + curseId);

      if (response.data && !response.data.error) {
        showToastMessage("Curse Deleted Successfully", "delete");
        getAllCurses();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Search for a Curse
  const onSearchCurse = async (query) => {
    try {
      const response = await axiosInstance.get("/search-curses", {
        params: { query },
      });

      if (response.data && response.data.curses) {
        setIsSearch(true);
        setAllCurses(response.data.curses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const updateIsPinned = async (curseData) => {
    const curseId = curseData._id;

    try {
      const response = await axiosInstance.put(
        "/update-curse-pinned/" + curseId,
        {
          isPinned: !curseData.isPinned,
        }
      );

      if (response.data && response.data.curse) {
        showToastMessage("Curse Updated Successfully", "update");
        getAllCurses();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllCurses();
  };

  useEffect(() => {
    getAllCurses();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCurse={onSearchCurse}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {isSearch && (
          <h3 className="text-lg font-medium mt-5">Search Results</h3>
        )}

        {allCurses.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allCurses.map((item) => {
              return (
                <CurseCard
                  key={item._id}
                  title={item.title}
                  content={item.content}
                  category={item.category}
                  subCategory={item.subCategory}
                  dateStart={item.dateStart}
                  dateEnd={item.dateEnd}
                  capacity={item.capacity}
                  members={item.members}
                  status={item.status}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteCurse(item)}
                  onPinCurse={() => updateIsPinned(item)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddCursesImg}
            message={
              isSearch
                ? `Oops! No curses found matching your search.`
                : `Start creating your first curse! Click the 'Add' button to jot down your
          thoughts, ideas, and reminders. Let's get started!`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Example Modal"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditCurses
          type={openAddEditModal.type}
          curseData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          showToastMessage={showToastMessage}
          getAllCurses={getAllCurses}
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
};

export default Home;
