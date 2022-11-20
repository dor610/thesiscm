import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn } from "../../common/utils";
import { setAccount, setIsLoggedIn } from "../../features/userSlice";


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
          if(!data.status){
            router.push("/login");
          }else {
            dispatch(setAccount(data.account));
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