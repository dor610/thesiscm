import { Clear } from "@mui/icons-material"
import { Box, Button, LinearProgress, MenuItem, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material"
import { Stack } from "@mui/system"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { miliSecToTimeOnly, sendAuthGetRequest } from "../../../common/utils"
import CustomPagination from "../../common/CustomPagination"
import NoRowOverlay from "../../common/NoRowOverlay"
import UserLayout from "../../layout/UserLayout"
import Mark from "./Mark"
import ThesisCommitteeMember from "./ThesisCommitteeMember"

const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.3},
    { field: "studentCode", headerName: 'MSSV', width: 150, flex: 0.7},
    { field: "studentName", headerName: 'Sinh viên', width: 150, flex: 1.5},
    { field: "topicName", headerName: 'Tên đề tài', width: 150, flex: 2},
    { field: 'time', headerName: 'Thời gian', width: 150, flex: 1},
    { field: 'members', headerName: 'Thành viên hội đồng', width: 150, flex: 1.5, renderCell: ThesisCommitteeMember},
    { field: 'id', headerName: "", with: 150, flex: 0.8, renderCell: Mark},
  ];

const ScheduleList = ({filter = false}) => {

    const account = useSelector(state => state.user.account);

    const semesters = [{value: "1", label: "I"}, {value: "2", label: "II"}];
    const [schoolYears, setSchoolYears] = useState([]);
    const [dates, setDates] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    const [allRows, setAllRows] = useState([]);
    const [rowsArr, setRowsArr] = useState([]);
    const [rows, setRows] = useState({});

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
      getData();
      getSchoolYears();
    }, []);

    useEffect(() => {
        doFilter();
    }, [schoolYear, semesterName, date]);

    useEffect(() => {
      processData(rowsArr);
    }, [rowsArr]);

    const getData = async () =>{
      setOnProcess(true);
      let result = await sendAuthGetRequest(filter? "/api/presentation/account?account=" + account: "/api/presentation/account/current?account="+ account);
      if(result.status === 200) {
        let arr = result.data.map((data, index) => {
            return ({
              semesterValue: data.semester.semesterName,
              schoolYear: data.semester.startYear + " - " + data.semester.endYear,
              topicName: data.topic.name,
              studentName: data.student.name,
              studentCode: data.student.studentCode,
              members: `1. ${data.president.title}. ${data.president.name}\n 2. ${data.secretary.title}. ${data.secretary.name}\n ${data.member.title}. ${data.member.name}`,
              ... data
            });
          });
          setAllRows(arr);
          setRowsArr(arr);
          setOnProcess(false);
      } else{
        setOnProcess(false);
      }
    }

    
    const getSchoolYears = async () => {
        let result = await sendAuthGetRequest("/api/semester/school-year");
        if(result.status === 200) {
          setSchoolYears(result.data);
        }
      }

    const doFilter = () => {
        let arr = allRows;
        if(schoolYear != "") {
          let startYear = schoolYears[parseInt(schoolYear)].startYear;
            let endYear = schoolYears[schoolYear].endYear;
            arr = allRows.filter(row => {
              return row.semester.startYear == startYear && row.semester.endYear == endYear;
            });
        }

        if(semesterName != "") {
          arr = arr.filter(row => {
            return row.semester.semesterCode == semesterName;
          })
        }
        
        if(date != "") {
          arr = arr.filter(row => {
            return row.date == date;
          })
        }

        setRowsArr(arr);
      }
  
      const processData = (dataArr) =>{
        let pData =  {};
        let dateArr = [];
        dataArr.forEach(element => {
          if(!pData[element.date]){
            dateArr.push(element.date);
            pData[element.date] = {"1": [], "2": []};
          }
          if(element.daySessionCode == 1) {
            pData[element.date]["1"].push({no: pData[element.date]["1"].length + 1 , ...element});
          } else  {
            pData[element.date]["2"].push({no: pData[element.date]["2"].length + 1 , ...element});
          }
        });
        setDates(dateArr);
        setRows(pData);
      } 

      const clearFilter = () => {
        setSchoolYear("");
        setSemesterName("");
        setDate("");
      }

    return (
        <Stack direction={"column"} gap={1} sx={{
            width: `100%`,
            mịHeight: `100%`
          }}>
            <Grid container alignItems={"center"} gap={2}>
              {filter? <Grid xs={12} md={3}>
              <TextField variant="standard" fullWidth color="secondary" select={schoolYears.length > 0} value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                        {schoolYears.length > 0 ? schoolYears.map((option) => (
                            <MenuItem  key={option.value + Math.random()} value={option.value}>
                            {option.label}
                            </MenuItem >
                        )): <></>}
                        </TextField>
              </Grid>: <></>}
              {filter? <Grid xs={12} md={3}>
               <TextField variant="standard" fullWidth color="secondary" select={semesters.length > 0} value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
                        {semesters.length > 0 ? semesters.map((option) => (
                            <MenuItem  key={option.value + Math.random()} value={option.value}>
                            {option.label}
                            </MenuItem >
                        )): <></>}
                        </TextField>
               </Grid>:<></>}
               <Grid xs={12} md = {filter? 3 : 8}>
               <TextField variant="standard" fullWidth color="secondary" select={dates.length > 0} value={date} onChange={(e) => {setDate(e.target.value)}} label="Ngày">
                        {dates.length > 0 ? dates.map((option) => (
                            <MenuItem  key={option + Math.random()} value={option}>
                            {option}
                            </MenuItem >
                        )): <></>}
                        </TextField>
               </Grid>
              <Grid xs={12} md={2.5}>
                <Button startIcon={<Clear/>} size="large" disabled={schoolYear == "" && semesterName == "" && date == ""} onClick={clearFilter} variant={"contained"}>Xoá bộ lọc</Button>
              </Grid>
            </Grid>
            {onProcess? <LinearProgress /> : <></>}
            {Object.keys(rows).length > 0 ? Object.keys(rows).map(key => {
              return (
                <Box key={key + "_" + Math.random()}>
                  {rows[key]["1"].length>0? 
                  <>
                    <Typography variant="h6">Ngày {rows[key]["1"][0].date} (Sáng) - Phòng {rows[key]["1"][0].place}</Typography>
                    <DataGrid
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      getRowHeight={() => 'auto'}
                      hideFooter
                      autoHeight
                      rows={rows[key]["1"]} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
                    />
                  </>:<></>}
                  {rows[key]["2"].length>0? 
                  <>
                    <Typography variant="h6">Ngày {rows[key]["2"][0].date} (Chiều) - Phòng {rows[key]["2"][0].place}</Typography>
                    <DataGrid
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      getRowHeight={() => 'auto'}
                      hideFooter
                      autoHeight
                      rows={rows[key]["2"]} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
                    />
                  </>:<></>}
                </Box>
              )
            }): onProcess? <></>: <Typography sx={{width: `100%`, textAlign:`center`, marginTop: `50px`}} variant="h5">Không có lịch báo cáo</Typography>}
          </Stack>
    )
}


ScheduleList.Layout = UserLayout;

export default ScheduleList;