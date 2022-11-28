import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify, successNotify } from "../../../../common/toastify";
import { miliSecToDateOnly, sendAuthGetRequest, sendPostRequest } from "../../../../common/utils";
import { setConfirmImarkId, setOpenConfirmPending } from "../../../../features/commonSlice";
import CustomPagination from "../../../common/CustomPagination";
import NoRowOverlay from "../../../common/NoRowOverlay";
import ConfirmButton from "./ConfirmButton";
import InfoButton from "./InfoButton";


const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1 },
    { field: 'studentName', headerName: 'Tên sinh viên', width: 150, flex: 3},
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 1},
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1},
    { field: 'endDate', headerName: 'Ngày kết thúc', width: 150, flex: 1},
    { field: 'sss', headerName: "Xác nhận", with: 150, flex: 1, renderCell: ConfirmButton},
    { field: 'id', headerName: "Thông tin", with: 150, flex: 1, renderCell: InfoButton}
  ];

const Pending = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id);
  const [onProcess, setOnProcess] = useState(false);
  const open = useSelector(state => state.common.openConfirmPending);
  const imarkId  = useSelector(state => state.common.confirmImarkId);

  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if(reload)
     getData();
  }, [reload])

  useEffect(() => {
    if(imarkId != ""){
      setCurrentData(data.filter(i => {return i.id === imarkId}));
    }
  }, [imarkId])
  
  const confirm = async () => {
    setOnProcess(true);
    dispatch(setOpenConfirmPending(false));
    let formData = new FormData();
    formData.append("id", imarkId);
    console.log(imarkId);
    let res = await sendPostRequest("/api/course/imark/confirm", formData);
    if(res.status == 200) {
      successNotify("Xác nhận tiếp tục thực hiện đề tài luận văn thành công");
      setOnProcess(false);
      setReload(true);
      dispatch(setConfirmImarkId(""));
    }else{
      errorNotify("Có lỗi xảy ra");
      dispatch(setConfirmImarkId(""));
      setOnProcess(false);
    }
  }

  const getData = async () => {
    let res = await sendAuthGetRequest("/api/course/imark/confirm/status?lecturer="+userId);
    console.log(res);
    if(res.status == 200) {
      setData(res.data.map((i, index) => ({
        no: index + 1,
        studentCode: i.student.studentCode,
        studentName: i.student.name,
        semesterName: i.semester.semesterCode == "1"? "I": "II",
        schoolYear: i.semester.startYear + " - " + i.semester.endYear,
        endDate: miliSecToDateOnly(i.expirationDate),
        ...i,
      })))
      setOnProcess(false);
      setReload(false);
    } else {
      setOnProcess(false);
      setReload(false);
    }
  }

  const handleClose = () => {
    dispatch(setOpenConfirmPending(false));
  }

    return (
        <>
        {open? <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận tiếp tục thực hiện luận văn"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Xác nhận rằng sinh viên {currentData && currentData.length > 0? currentData[0].studentName: ""} sẽ tiếp tục thực hiện đề tài luận văn trong học kỳ hiện tại.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={e => dispatch(setOpenConfirmPending(false))}>Huỷ</Button>
          <Button onClick={() => confirm()} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>: <></>}
        {onProcess? <LinearProgress />: <></>}
        <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={data} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
        </>
    )
}

export default Pending;