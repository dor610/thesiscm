import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../common/localStorage";
import { isLoggedIn } from "../../common/utils";
import { setAccount, setIsLoggedIn, setUserData, setUserId } from "../../features/userSlice";


const Authorization = () => {

    const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() =>{
        checkAuthentication()
      });
    
      const checkAuthentication = async () => {
        if(!isUserLoggedIn) {
            let data = await isLoggedIn()
            console.log(data);
            if(!data.status){
              router.push("/login");
              dispatch(setIsLoggedIn(false));
            }else {
              dispatch(setAccount(data.data.account));
              dispatch(setUserId(data.data.id));
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