import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, LinearProgress, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers";
import { sendAuthGetRequest, sendAuthPostResquest, weeksBetweenDates } from "../../../common/utils";
import { useDispatch, useSelector } from "react-redux";
import { setSemesterOnEdit } from "../../../features/semesterSlice";

const EditSemester = ({upcomingReload, passReload}) =>{
    const dispatch = useDispatch();
    const semesters = [{label: "Học kỳ 1", value: "1"}, {label: "Học kỳ 2", value: "2"}];
    const open = useSelector(state => state.semester.onEdit);
    const editId = useSelector(state => state.semester.editId);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());    
    const [semesterCode, setSemesterCode] = useState("1");
    const [numberOfWeek, setNumberOfWeek] = useState(0);
    const [onProcess, setOnProcess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() =>{
      setNumberOfWeek(weeksBetweenDates(startDate, endDate));
    }, [startDate, endDate])

    useEffect(() =>{
        getData();
    }, [editId]);

    const onClose = () =>{
        reset();
        setOpen(false);
    }

    const setOpen = (value) =>{
        dispatch(setSemesterOnEdit(value));
    }

    const getData = async () =>{
        let result = await sendAuthGetRequest("/api/semester?id="+editId);
        if(result.status === 200){
          let data = result.data;
          console.log(data);
          setStartDate(dayjs(parseInt(data.startDate)));
          setEndDate(dayjs(parseInt(data.endDate)));
          setNumberOfWeek(parseInt(data.numberOfWeek));
          setSemesterCode(data.semesterCode);
        }
    }

    const onSubmit = () =>{
      if(endDate.get("year") - startDate.get("year") == 1){
        if(startDate.isValid() && endDate.isValid()) {
          setOnProcess(true);
          setIsError(false);
          setIsSuccess(false);
          submit();
        } else {
          setIsError(true);
          setIsSuccess(false);
          setErrorMessage("Giá trị ngày không hợp lệ");
        }
      } else {
        setIsError(true);
          setIsSuccess(false);
          setErrorMessage("Năm học không hợp lệ");
      }
    }

    const handleStartDateChange = (newValue) => {
      setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) =>{
      setEndDate(newValue);
    }

    const submit = async () =>{
      let data = new FormData();
      data.append("startDate", startDate.valueOf());
      data.append("endDate", endDate.valueOf());
      data.append("numberOfWeek", numberOfWeek);
      data.append("code", semesterCode);
      let result = await sendAuthPostResquest("/api/semester", data);
      if (result.status === 200) {
        setIsSuccess(true);
        setOnProcess(false);
        setTimeout(() =>{
          reset();
          upcomingReload(true);
          passReload(true);
        }, 1500);
      } else {
        setOnProcess(false);
        setIsError(true);
        setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.")
      }
    }

    const reset = () =>{
      setOnProcess(false);
      setIsError(false);
      setIsSuccess(false);
      setStartDate(dayjs())
      setEndDate(dayjs());
      setOpen(false);
      setNumberOfWeek(0);
      setSemesterCode("1");
    }

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Thêm thông tin học kỳ</DialogTitle>
        <DialogContent>
          <Stack direction={"column"} sx={{gap: '20px'}}>
          <DialogContentText>
            Nhập thông tin để thêm mới một học kỳ
          </DialogContentText>
          {onProcess? <LinearProgress />: <></>}
          {isError? <Alert severity="error">{errorMessage}</Alert>: <></>}
          {isSuccess? <Alert severity="success">{"Thêm học kỳ thành công"}</Alert>: <></>}
           <TextField fullWidth color="secondary" select={semesters.length > 0} required value={semesterCode} onChange={(e) => {setSemesterCode(e.target.value)}} label="Học kỳ">
                    {semesters.length > 0 ? semesters.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
                    
            <Divider textAlign="left">Ngày bắt đầu</Divider>
           <Stack direction={"row"} gap={2} sx={{width: `100%`}}>
            <DatePicker
                  label="Năm"
                  views={['year']}
                  value={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} />}
                />
                <DatePicker
                  label="Tháng"
                  views={['month']}
                  value={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} inputProps={{
                    ...params.inputProps,
                    value: startDate === null ? '' : startDate.get("month") + 1
                 }}/>}
                />
                <DatePicker
                  label="Ngày"
                  views={['day']}
                  value={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} inputProps={{
                    ...params.inputProps,
                    value: startDate === null ? '' : startDate.get("date")
                 }}/>}
                />
            </Stack>
            <Divider textAlign="left">Ngày kết thúc</Divider>
           <Stack direction={"row"} gap={2} sx={{width: `100%`}}>
            <DatePicker
                  label="Năm"
                  views={['year']}
                  value={endDate}
                  minDate={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} />}
                />
                <DatePicker
                  label="Tháng"
                  views={['month']}
                  value={endDate}
                  minDate={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} inputProps={{
                    ...params.inputProps,
                    value: endDate === null ? '' : endDate.get("month") + 1
                 }}/>}
                />
                <DatePicker
                  label="Ngày"
                  views={['day']}
                  value={endDate}
                  minDate={startDate}
                  onError={()=>{console.log("hihhii");}}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField onKeyDown={(e) => e.preventDefault()} {...params} inputProps={{
                    ...params.inputProps,
                    value: endDate === null ? '' : endDate.get("date")
                 }}/>}
                />
            </Stack>
            <TextField fullWidth inputProps={{readOnly: true}}
                  color="secondary" value={numberOfWeek} label="Số tuần học"/>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" variant="outlined" color="secondary" onClick={onClose}>Huỷ</Button>
          <Button size="large" variant="outlined" onClick={onSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
    )
}

export default EditSemester;