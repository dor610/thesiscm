import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import InfoButton from "./InfoButton";
import { Stack } from "@mui/system";
import { LinearProgress, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { sendAuthGetRequest } from "../../../common/utils";

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

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");

    const [schoolYearValid, setSchoolYearValid] = useState(true);
    const [validSemester, setValidSemester] = useState(true);

    const[rows, setRows] = useState([]);
    const[allRows, setAllRows] = useState([]);

    useEffect(() => {
      getData();
      if(filter) {
        getSchoolYears();
      }
    }, []);

    useEffect(() => {
      doFilter();
    }, [semesterName, schoolYear]);

    
    const getData = async () => {
      setOnProcess(true);
      let result = await sendAuthGetRequest(filter? "/api/topic/all" : "/api/topic/currentSemester");
      console.log(result);
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
        {!filter? <></>:
        <Stack direction={"row"} gap={2}>
          <TextField fullWidth color="secondary" select={schoolYears.length > 0} error={!schoolYearValid} helperText={schoolYearValid? "" : "Niên khoá không hợp lệ"} required value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                    {schoolYears.length > 0 ? schoolYears.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
           <TextField fullWidth color="secondary" select={semesters.length > 0} error={!validSemester} helperText={validSemester? "" : "Học kỳ không hợp lệ"} required value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
                    {semesters.length > 0 ? semesters.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
          </Stack>}
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