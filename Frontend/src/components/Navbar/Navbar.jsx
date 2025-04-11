import { useState } from "react";
import ProfileInfo from '/src/components/Cards/ProfileInfo';
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../components/Input/SearchBar/SearchBar";
function Navbar({ userinfo , onSearchJobs }){
  const [ searchQuery , setSearchQuery ] = useState("");

  const navigate = useNavigate();

  const onLogout = () =>{
    localStorage.clear();
    navigate("/login");
  } 

  const handleSearch = () => {
    if (searchQuery) {
      onSearchJobs(searchQuery); // Adjust if query needs to be an object
    }
  };
  

  const onClearSearch = () => {
    setSearchQuery("");
  };

    return (
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
          <h2 className="text-xl font-medium text-black py-2">Track Your Job</h2>
          {userinfo != null && <SearchBar
          value={searchQuery}
          onChange = {(e) => {
            setSearchQuery(e.target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          />}
          {userinfo == null && 
          <div className="flex gap-3">
            {
              <Link to="/login" className="px-4 py-2 bg-blue-500 rounded-full text-white hover:shadow-xl">Login</Link>
            }
            {
              <Link to="/signup" className="px-4 py-2 bg-blue-500 rounded-full text-white hover:shadow-xl">SignUp</Link>
            }
          </div>
          }
          {userinfo != null && <ProfileInfo userInfo = {userinfo} onLogout={onLogout}/>}
      </div>
    )
}

export default Navbar;