import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import InfoButton from "./InfoButton";
import { Stack } from "@mui/system";
import { Button, Unstable_Grid2 as Grid, LinearProgress, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { sendAuthGetRequest } from "../../../common/utils";
import { Clear, Delete } from "@mui/icons-material";

  const columns = [
    { field: "name", headerName: 'Tên đề tài', width: 150, flex: 3},
    { field: "enName", headerName: 'Tên tiếng Anh', width: 150, flex: 3},
    { field: 'lecturerName', headerName: 'GVHD', width: 150, flex: 1 },
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 0.5},
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 0.5},
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: InfoButton}
  ];

const ThesisData = ({filter = false}) =>{
    const semesters = [{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}];
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);
    const [lecturers, setLecturers] = useState([]);

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [lecturer, setLecturer] = useState("");

    const[rows, setRows] = useState([]);
    const[allRows, setAllRows] = useState([]);

    useEffect(() => {
      getData();
      getLecturers();
      if(filter) {
        getSchoolYears();
      }
    }, []);

    useEffect(() => {
      doFilter();
    }, [semesterName, schoolYear, lecturer]);

    
    const getData = async () => {
      setOnProcess(true);
      let result = await sendAuthGetRequest(filter? "/api/topic/all" : "/api/topic/currentSemester");
      if(result.status == 200) {
        setOnProcess(false);
        let arr = result.data.map((topic, index) => ({
          no: index + 1,
          semesterName: topic.semester.semesterCode == "1"? "I": "II",
          schoolYear: topic.semester.startYear + " - " + topic.semester.endYear,
          lecturerName: topic.lecturer.title + ". " + topic.lecturer.name,
          ...topic
        }))
        setRows(arr);
        setAllRows(arr);
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

    const getLecturers = async () => {
      let res = await sendAuthGetRequest("/api/user/get-by-role?role=1");
      if(res.status == 200) {
        setLecturers(res.data);
      }
    }

    const doFilter = () => {
      let arr = [...allRows];
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

        if(lecturer != "") {
          arr = arr.filter(row => {
            return row.lecturer.id === lecturer;
          })
        }
      
      setRows(arr);
    }

    const clearFilter = () => {
      setSchoolYear("");
      setSemesterName("");
      setLecturer("");
    }


    return (
        <Stack direction={"column"} gap={1} sx={{
          width: `100%`,
          height: `100%`
        }}>
        {filter?
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
          <TextField variant="standard" fullWidth color="secondary" select={schoolYears.length > 0} required value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                    {schoolYears.length > 0 ? schoolYears.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
          </Grid>
           <Grid xs={12} md={2.5}>
           <TextField variant="standard" fullWidth color="secondary" select={semesters.length > 0}  required value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
                    {semesters.length > 0 ? semesters.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
           </Grid>
           <Grid xs={12} md={3.5}>
           <TextField variant="standard" fullWidth color="secondary" select={Object.keys(lecturers).length > 0} required value={lecturer} onChange={(e) => {setLecturer(e.target.value)}} label="Giảng viên">
                  {lecturers.length > 0 ?lecturers.map(l => (
                        <MenuItem  key={l.id} value={l.id}>
                        {l.title + ". " + l.name}
                        </MenuItem >
                    )): <></>}
                    </TextField>
            </Grid>    
            <Grid xs={12} md={1.5}>
            <Button fullWidth onClick={() => clearFilter()} variant="contained" size="large" startIcon={<Delete />}>
              Xoá bộ lọc
              </Button> 
            </Grid>           
          </Grid>: <Grid container spacing={2}>
            <Grid xs={12} md={10}>
           <TextField variant="standard" fullWidth color="secondary" select={Object.keys(lecturers).length > 0} required value={lecturer} onChange={(e) => {setLecturer(e.target.value)}} label="Giảng viên">
           {lecturers.length > 0 ?lecturers.map(l => (
                        <MenuItem  key={l.id} value={l.id}>
                        {l.title + ". " + l.name}
                        </MenuItem >
                    )): <></>}
                    </TextField>
            </Grid>    
            <Grid xs={12} md={1.5}>
            <Button fullWidth onClick={() => clearFilter()} variant="contained" size="large" startIcon={<Delete />}>
              Xoá bộ lọc
              </Button> 
            </Grid>
            </Grid>}
          {onProcess? <LinearProgress /> : <></>}
        <DataGrid autoPageSize
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

export default ThesisData;