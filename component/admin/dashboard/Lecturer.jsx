import { Delete, FilterAlt, RotateLeft } from "@mui/icons-material";
import { Button, Divider, Unstable_Grid2 as Grid, MenuItem, TextField, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { sendAuthGetRequest } from "../../../common/utils";


export const options = {
  chart: {
    title: "Tỉ lệ đạt/không đạt của sinh viên",
  },
};
export const options1 = {
  chart: {
    title: "Số lượng sinh viên xin điểm I trong học kỳ hiện tại",
  },
};
export const options2 = {
  legend: 'bottom',
  pointSize: 10,
};

const Lecturer = () => {
    const [semesters, setSemesters] = useState([{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [allSemester, setAllSemester] = useState([]);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [lecturer, setLecturer] = useState("");


    const [data1, setData1] = useState([["", "Đạt", "Không đạt"],
                                        ["HK I, 2020-2021", 0, 0],]);
    const [data2, setData2] = useState([["Loại ", "Số lượng sinh viên"],
                                        ["Điểm I", 0],
                                        ["Không có điểm I", 0],]);
    const [data3, setData3] = useState([
                                        ["Điểm","Số sinh viên",],
                                        ["A", 0],
                                        ["B+", 0],
                                        ["B", 0],
                                        ["C+", 0],
                                        ["C", 0],
                                        ["D+", 0],
                                        ["D", 0],
                                        ["F", 0],]);

    useEffect(() => {
        getSchoolYears();
        getLecturers();
        getCurrentSemester();
        getAllSemester();
      }, []);

      useEffect(() => {
        if(selectedSemester && lecturer){
          getPointData();
          getImarkData();
        }
      }, [selectedSemester, lecturer]);
  
      useEffect(() => {
        if(reports) {
          processData();
        }
      }, [reports]);

      useEffect(() => {
        if(lecturers && lecturers.length > 0){
          setLecturer(lecturers[0].account);
        }
      }, [lecturers])

      useEffect(() =>{
        if(currentSemester){
          setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
          setSemesterName(currentSemester.semesterCode);
        }
      },[currentSemester]);
  
      useEffect(() => {
        getCurrentSemester();
      }, []);

      useEffect(() => {
        if(schoolYear && allSemester){
          getSemesters();
        }
      }, [schoolYear, allSemester])

      const getPointData = async () => {
        setOnProcess(true);
        let res = await sendAuthGetRequest("/api/report/user?account="+lecturer+"&semester="+selectedSemester);
        if(res.status == 200) {
          setOnProcess(false);
          setReports(res.data);
        }else {
          setOnProcess(false);
        }
      }

      const getImarkData = async () => {
        setOnProcess(true);
        let res = await sendAuthGetRequest("/api/course/imark/user-semester?account="+lecturer+"&semester="+selectedSemester);
        if(res.status == 200){
          setOnProcess(false);
          let point2 = [...data2];
          point2[1][1] = res.data[0];
          point2[2][1] = res.data[1];
          setData2(point2);
        } else {
          setOnProcess(false);
        }
      }
  
      const processData = () => {
        let point3 = [...data3];
        point3[1][1] = reports["A"];
        point3[2][1] = reports["B+"];
        point3[3][1] = reports["B"];
        point3[4][1] = reports["C+"];
        point3[5][1] = reports["C"];
        point3[6][1] = reports["D+"];
        point3[7][1] = reports["D"];
        point3[8][1] = reports["F"];
        setData3(point3);
        let point1 = [...data1];
        point1[1][1] = point3[7][1] + point3[6][1] + point3[5][1] + point3[4][1] + point3[3][1] + point3[2][1] + point3[1][1];
        point1[1][2] = point3[8][1];
        setData1(point1);
      }

    const getSchoolYears = async () => {
      let result = await sendAuthGetRequest("/api/semester/school-year");
      console.log(result);
      if(result.status === 200) {
        setSchoolYears(result.data);
      }
    }

    const getAllSemester = async () => {
      let res = await sendAuthGetRequest("/api/semester/all");
      console.log(res);
      if(res.status == 200){
        setAllSemester(res.data);
      }
    }

    const getCurrentSemester = async () =>{
      let result = await sendAuthGetRequest("/api/semester/current");
      if(result.status === 200) {
          setCurrentSemester(result.data);
          setSelectedSemester(result.data.id);
      }
    }

    const getLecturers = async () => {
      let res = await sendAuthGetRequest("/api/user/get-by-role?role=1");
      if(res.status == 200) {
        setLecturers(res.data);
        setLecturer(res.data[0].account);
      }
    }

    const getSemesters = () =>{
      let arr = schoolYear.split(" ");
      let startYear = arr[0];
      let endYear = arr[2];
      let arr1 = allSemester.filter(s => s.startYear === startYear && s.endYear === endYear);
      console.log(arr1);
      setSemesters(arr1.map(data=> ({
        value: data.semesterCode,
        label: data.semesterName,
      })));
    }

    const reset = () =>{
      setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
      setSemesterName(currentSemester.semesterCode);
      setSelectedSemester(currentSemester.id);
    }

    const doFilter = () => {
      let arr = schoolYear.split(" ");
      let startYear = arr[0];
      let endYear = arr[2];
      let semester = allSemester.filter(s => s.startYear === startYear && s.endYear === endYear && s.semesterCode == semesterName);
      setSelectedSemester(semester[0].id);
    }

    return (
        <Stack direction="column" sx={{width: `100%`}} spacing={1}>
        <Typography variant="h5">Giảng viên</Typography>
        <Divider />
        <Grid container sx={{gap: `20px`}}>
          <Grid xs={12} md={2.5}>
          <TextField variant="standard" fullWidth color="secondary" select={schoolYears.length > 0} required value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                    {schoolYears.length > 0 ? schoolYears.map((option) => (
                        <MenuItem  key={option.label} value={option.label}>
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
           <Grid xs={12} md={3}>
           <TextField variant="standard" fullWidth color="secondary" select={lecturers.length > 0} required value={lecturer} onChange={(e) => {setLecturer(e.target.value)}} label="Giảng viên">
                    {lecturers.length > 0 ?lecturers.map(l => (
                        <MenuItem  key={l.id} value={l.account}>
                        {l.title + ". " + l.name}
                        </MenuItem >
                    )): <></>}
                    </TextField>
            </Grid>  
            <Grid xs={12} md={1.5}>
            <Button fullWidth onClick={() => doFilter()} variant="contained" size="medium" startIcon={<FilterAlt />}>
              Lọc
            </Button> 
            </Grid>      
            <Grid xs={12} md={1.5}>
            <Button fullWidth onClick={() => reset()} variant="contained" size="medium" startIcon={<RotateLeft />}>
              Đặt lại
            </Button> 
            </Grid>           
          </Grid>
          <Grid container gap={2} sx={{width: `100%`, paddingTop: `20px`}}>
                <Grid xs={12} md={5.8}>
                    <Chart
                        chartType="Bar"
                        width="100%"
                        height="310px"
                        data={data1}
                        options={options}
                        />
                </Grid>
                <Grid xs={12} md={5.8}>
                <Chart
                    chartType="Bar"
                    width="100%"
                    height="310px"
                    data={data2}
                    options={options1}
                    />
                </Grid>
                <Grid xs={12}>
                    <Stack direction="column">
                      <Typography sx={{fontSize: `16px`, color: `rgb(117, 117, 117)`}}>Điểm của sinh viên trong học kỳ hiện tại</Typography>
                      <Chart
                        chartType="LineChart"
                        width="100%"
                        height="310px"
                        data={data3}
                        options={options2}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default Lecturer;