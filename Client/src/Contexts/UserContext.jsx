import { createContext, useState, useEffect } from 'react';


const UserContext = createContext({});

export const UserProvider = ({ children }) => {
 
  const [focusPlaylist, setFocusPlaylist] = useState();


  // useEffect(() => {
  //   const getUser = async () => {
  //     await axios.get(`/api/user?email=${email}`).then(res => {
  //       console.log(res.data)
  //       const { first_name, id, surname,} = res.data
  //       setUserId(id);
  //       setFirst_name(first_name);
  //       setSurname(surname);
  //       socket.auth = { id };
  //       socket.connect();
        
  //     }).catch(e => console.log(e))
  //   }

  //   if (email !== undefined && (userId == 0 || !userId)) {   
  //       getUser();
  //   }

  // }, [email])


  // useEffect(() => {
  //   if (userId == 0 || !userId) {
  //     setFirst_name();
  //     setSurname();
  //   } else {
  //     setUpdateStamps(true)
  //   }
  // }, [userId])

  // useEffect(() => {
  //   const getUserStamps = async () => {
  //     if (userId > 0) {
  //       await axios.get(`/api/stamps?customer_id=${userId}`).then(res => {
  //         setLP(res.data)
  //       })
  //     }
  //   }

  //   if (updateStamps) {
  //     getUserStamps()
  //     setUpdateStamps(false)
  //   }

  // }, [updateStamps])


  


  return (
    <UserContext.Provider
      value={{
        
        focusPlaylist, setFocusPlaylist
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;