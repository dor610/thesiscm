import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../common/localStorage";
import { isLoggedIn } from "../../common/utils";
import { setAccount, setIsLoggedIn, setUserData, setUserId, setUserName, setUserRole } from "../../features/userSlice";


const Authorization = () => {

    const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() =>{
        checkAuthentication()
      });
    
      const checkAuthentication = async () => {
        if(!isUserLoggedIn) {
            let res = await isLoggedIn()
            if(!res.status){
              router.push("/login");
              dispatch(setIsLoggedIn(false));
            }else {
              dispatch(setAccount(res.data.account));
              dispatch(setUserId(res.data.id));
              dispatch(setUserName(res.data.name));
              dispatch(setUserRole(res.data.role));
              dispatch(setIsLoggedIn(true));
            }
          }
      }

    return (
        <>
        </>
    )
}

export default Authorization;