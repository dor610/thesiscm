import { Button, Unstable_Grid2 as Grid, LinearProgress, MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import InfoButton from "./InfoButton";
import { Clear } from "@mui/icons-material";

const columns = [
    { field: "courseCode", headerName: 'Mã nhóm', width: 150, flex: 1},
    { field: 'quantity', headerName: 'Sĩ số', width: 150, flex: 1 },
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 1},
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1},
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: InfoButton}
  ];

const semesters = [
  {value: "1", label: "Học kỳ I"},
  {value: "2", label: "Học kỳ II"}
]

const AllCourse = () =>{
    const account= useSelector(state => state.user.account);

    const [rows, setRows] = useState([]);
    const [allRows, setAllRows] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);
    
    const [schoolYear, setSchoolYear] = useState("");
    const [semesterName, setSemesterName] = useState("");

    useEffect(() => {
        getSchoolYears();
    }, []);

    useEffect(() => {
      console.log(account);
        if(account != "") {
            getData();
        }
    }, [account]);

    useEffect(() => {
        doFilter();
    }, [schoolYear, semesterName]);

    const getData = async () =>{
        setOnProcess(true);
        let result = await sendAuthGetRequest("/api/course/account?account="+account);
        console.log(result);
        if(result.status === 200) {
            let arr = result.data.map((row, index) => ({
                courseCode: "CT594-"+ (parseInt(row.classCode) > 9 ? row.classCode: "0" + row.classCode),
                no: index + 1,
                user: row.lecturer.title +". " + row.lecturer.name,
                quantity: row.students.length,
                semesterName: row.semester.semesterName,
                schoolYear: row.semester.startYear + " - " + row.semester.endYear, 
                ...row}));
            setRows(arr);
            setAllRows(arr);
            setOnProcess(false);
        } else {
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
        if(schoolYear != "" || semesterName != "") {
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
            </Grid>
            {onProcess? <LinearProgress /> : <></>}
          <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={rows} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
          </Stack>
    )
}

export default AllCourse;