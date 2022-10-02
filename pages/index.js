import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../common/localStorage";
import { isLoggedIn } from "../common/utils";
import { setIsLoggedIn } from "../features/userSlice";

export default function Home() {

  const router = useRouter();
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(() =>{
    if(!isUserLoggedIn) {
      if(!isLoggedIn()){
        router.push("/login");
      }else {
        dispatch(setIsLoggedIn(true));
        redirect();
      }
    } else {
      redirect();
    }
  }, [isUserLoggedIn, router, dispatch]);

  const redirect = () =>{
      let user = JSON.parse(getData("user"));
      //user.role in ['','']
      console.log(user.role);
      if(true) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
  }

  return (
    <>
    </>
  )
}
