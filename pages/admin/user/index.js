import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../component/layout/AdminLayout";
import { setCurrentPage } from "../../../features/pathSlice";

const User = () =>{

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setCurrentPage("user"));
    })

    return (<>
    </>)

}

User.Layout = AdminLayout;

export default User;