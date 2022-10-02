import { toast } from "react-toastify";
import { getData } from "./localStorage";

export const processNotification = (notification) =>{
    //do something here
    console.log("new notification has arrived");
    console.log(notification);
    if(notification.sender !== JSON.parse(getData("user")).account){
        notify(notification.note+": " +notification.message);
    }
}

export const successNotify = (msg, id) =>{
    toast.success(msg, {
        position: "bottom-left",
        toastId: id,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const errorNotify = (msg, id) =>{
    toast.error(msg, {
        position: "bottom-left",
        toastId: id,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const warningNotify = (msg, id) =>{
    toast.warn(msg, {
        position: "bottom-left",
        toastId: id,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const notify = (msg, id) =>{
    toast.info(msg, {
        position: "bottom-left",
        toastId: id,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}