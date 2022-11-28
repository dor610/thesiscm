import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material"
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { errorNotify, successNotify } from "../../../../common/toastify";
import { sendAuthPostResquest } from "../../../../common/utils";
import { setReloadImark } from "../../../../features/commonSlice";


const DeleteIMark = ({data, open, setOpen}) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const [onProcess, setOnProcess] = useState(false);

    const deleteImark = async () => {
        setOnProcess(true);
        let formData = new FormData();
        formData.append("id", data.id);
        let result = await sendAuthPostResquest("/api/course/imark/delete", formData);
        if(result.status == 200 && result.data){
            setOnProcess(false);
            successNotify("Xoá đơn điểm I của sinh viên " + data.student.name + " thành công");
            dispatch(setReloadImark(true));
            setTimeout(()=> {
                router.push("/user/course/i");
            }, 3000);
        } else {
            setOnProcess(false);
            errorNotify("Đã có lỗi xảy ra, vui lòng thực hiện lại!");
            setTimeout(()=> {
                setOpen(false);
            }, 3000);
        }
    }

    return (
        <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Xoá đơn điểm I của sinh viên " + (data? data.student.name: "")}
        </DialogTitle>
        <DialogContent>
            {onProcess? <LinearProgress />: <></>}
          <DialogContentText id="alert-dialog-description">
            Hành động sẽ xoá đơn điểm I của sinh viên và phục hồi lại trạng thái trước đó của đè tài luận văn nếu có.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpen(false)} autoFocus>Huỷ</Button>
          <Button color="error" onClick={() => deleteImark()} >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default DeleteIMark;