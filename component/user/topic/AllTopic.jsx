import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import InfoButton from "./InfoButton";
import { Stack } from "@mui/system";
import { Button, Unstable_Grid2 as Grid, LinearProgress, MenuItem, TextField, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { sendAuthGetRequest } from "../../../common/utils";
import { useSelector } from "react-redux";
import { Clear } from "@mui/icons-material";

const columns = [
  { field: "no", headerName: 'STT', width: 150, flex: 0.4},
  { field: "name", headerName: 'Tên đề tài', width: 150, flex: 4},
  { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1},
  { field: "studentName", headerName: 'Sinh viên', width: 150, flex: 2},
  { field: 'id', headerName: "", with: 150, flex: 1, renderCell: InfoButton}
];

const AllTopic = () =>{
    const account = useSelector(state => state.user.account);

    const semesters = [{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}];
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    const [allRows, setAllRows] = useState([]);
    const [rows, setRows] = useState([]);

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");

    const [schoolYearValid, setSchoolYearValid] = useState(true);
    const [validSemester, setValidSemester] = useState(true);

    useEffect(() => {
      getData();
      getSchoolYears();
    }, []);

    useEffect(() => {
        doFilter();
    }, [schoolYear, semesterName]);

    const getData = async () =>{
      setOnProcess(true);
      let result = await sendAuthGetRequest("/api/topic/getByAccount?account="+account);
      console.log(result);
      if(result.status === 200) {
        setOnProcess(false);
        let arr = []
        let count = 0;
        result.data.forEach(element => {
          element.member.forEach(data => {
            count++;
            arr.push({
              no: count,
              studentName: data.name,
              studentCode: data.studentCode,
              semesterValue: element.semester.semesterName,
              schoolYear: element.semester.startYear + " - " + element.semester.endYear,
              ... element
            })
          })
        });
        setRows(arr);
        setAllRows(arr);
      } else{
        setOnProcess(false);
      }
    }

    
    const getSchoolYears = async () => {
        let result = await sendAuthGetRequest("/api/semester/school-year");
        console.log(result);
        if(result.status === 200) {
          setSchoolYears(result.data);
        }
      }
    
      const doFilter = () => {
        let arr = [];
        if(schoolYear != "" && semesterName != "") {
          if(schoolYear != "") {
            let startYear = schoolYears[parseInt(schoolYear)].startYear;
            let endYear = schoolYears[parseInt(schoolYear)].endYear;
            arr = allRows.filter(row => {
              return row.semester.startYear == startYear && row.semester.endYear == endYear;
            });
          }
    
          if(semesterName != "") {
            arr = arr.filter(row => {
              return row.semester.semesterCode == semesterName;
            })
          }
        } else if (schoolYear != "") {
            let startYear = schoolYears[parseInt(schoolYear)].startYear;
            let endYear = schoolYears[parseInt(schoolYear)].endYear;
            arr = allRows.filter(row => {
              return row.semester.startYear == startYear && row.semester.endYear == endYear;
            });
        } else if(semesterName != "") {
          arr = allRows.filter(row => {
            return row.semester.semesterCode == semesterName;
          })
        } else {
          arr = allRows;
        }
  
        setRows(arr);
      }
  
      const clearFilter = () => {
        setSchoolYear("");
        setSemesterName("");
      }
  

    return (
        <Stack direction={"column"} gap={1} sx={{
          width: `100%`,
          height: `100%`
        }}>
        <Grid container alignItems={"center"} gap={2}>
            <Grid xs={12} md={3} lg={4.5}>
            <TextField fullWidth color="secondary" select={schoolYears.length > 0} value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                      {schoolYears.length > 0 ? schoolYears.map((option) => (
                          <MenuItem  key={option.value} value={option.value}>
                          {option.label}
                          </MenuItem >
                      )): <></>}
                      </TextField>
            </Grid>
             <Grid xs={12} md = {3} lg={4.5}>
             <TextField fullWidth color="secondary" select={semesters.length > 0} value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
                      {semesters.length > 0 ? semesters.map((option) => (
                          <MenuItem  key={option.value} value={option.value}>
                          {option.label}
                          </MenuItem >
                      )): <></>}
                      </TextField>
             </Grid>
            <Grid xs={12} md={4} lg={2.5}>
              <Button startIcon={<Clear/>} size="large" disabled={schoolYear == "" && semesterName == ""} onClick={clearFilter} variant={"contained"}>Xoá bộ lọc</Button>
            </Grid>
            </Grid>{rows.length > 0 && (schoolYear || semesterName)? <Typography variant="h6">Danh sách đề tài hướng dẫn trong 
                                                                        {semesterName? " " + rows[0].semesterValue: ""} 
                                                                        {semesterName && schoolYear ? ", ": ""}
                                                                        {schoolYear? " Năm học " + rows[0].schoolYear: ""}</Typography>: <></>}
          {onProcess? <LinearProgress /> : <></>}
        <DataGrid autoPageSize pagination
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                      Pagination: CustomPagination,
                    }} 
                    sx={{
                      '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                      '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '11px' },
                      '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '12px' },
                    }}
                    getRowHeight={() => 'auto'}
                    rows={rows} 
                    columns={columns} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
            />
        </Stack>
    )
}

export default AllTopic;