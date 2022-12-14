import { FilterAlt, RotateLeft } from "@mui/icons-material";
import { Unstable_Grid2 as Grid, Stack, Typography, Button, Box, Tab, Divider, TextField, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useDispatch } from "react-redux";
import { sendAuthGetRequest } from "../../common/utils";
import Lecturer from "../../component/admin/dashboard/Lecturer";
import AdminLayout from "../../component/layout/AdminLayout";
import { setCurrentPage } from "../../features/pathSlice";

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

const Admin = () => {

    const [semesters, setSemesters] = useState([{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [currentSemester, setCurrentSemester] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [allSemester, setAllSemester] = useState([]);

    const [data1, setData1] = useState([["", "Đạt", "Không đạt"],
                                        ["HK I, 2020-2021", 0, 0],]);
    const [data2, setData2] = useState([["Loại ", "Số lượng sinh viên"],
                                        ["Điểm I", 0],
                                        ["Không có điểm I", 0],]);

    const [count, setCount] = useState({student: 0, course: 0});

    const dispatch = useDispatch();
    const router = useRouter();
    
    useEffect(() => {
        dispatch(setCurrentPage("dashboard"));
    })

      useEffect(() =>{
        if(currentSemester){
          setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
          setSemesterName(currentSemester.semesterCode);
        }
      },[currentSemester]);

      useEffect(() => {
        if(selectedSemester){
          getCount();
          getPoint();
          getImark();
        }
      }, [selectedSemester]);

      useEffect(() => {
        if(schoolYear && allSemester){
          getSemesters();
        }
      }, [schoolYear, allSemester])

      useEffect(() => {
        getCurrentSemester();
        getSchoolYears();
        getAllSemester();
      }, []);

      const getCurrentSemester = async () =>{
        let result = await sendAuthGetRequest("/api/semester/current");
        if(result.status === 200) {
            setCurrentSemester(result.data);
            setSelectedSemester(result.data.id);
        }
      }

      const getAllSemester = async () => {
        let res = await sendAuthGetRequest("/api/semester/all");
        console.log(res);
        if(res.status == 200){
          setAllSemester(res.data);
        }
      }

    const getSchoolYears = async () => {
        let result = await sendAuthGetRequest("/api/semester/school-year");
        console.log(result);
        if(result.status === 200) {
          setSchoolYears(result.data);
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

    const getCount = async () => {
      let res = await sendAuthGetRequest("/api/course/count?semester="+selectedSemester);
      console.log(res);
      if(res.status == 200) {
        setCount(res.data);
      }
    }

    const getPoint = async () => {
      setOnProcess(true);
      let res = await sendAuthGetRequest("/api/report/semester?semester="+selectedSemester);
      console.log(res);
      let data = res.data;
      let point1 = [...data1];
      point1[1][1] = data["A"] + data["B+"] + data["B"] + data["C+"] + data["C"] + data["D+"] + data["D"];
      point1[1][2] = data["F"];
      setData1(point1);
    }

    const getImark = async () => {
      setOnProcess(true);
      let res = await sendAuthGetRequest("/api/course/imark/count/semester?semester="+selectedSemester);
      if(res.status == 200) {
        setOnProcess(false);
        let point2 = [...data2];
        point2[1][1] = res.data[0];
        point2[2][1] = res.data[1];
        setData2(point2);
      }else {
        setOnProcess(false);
      }
    }
  
    const doFilter = () => {
      let arr = schoolYear.split(" ");
      let startYear = arr[0];
      let endYear = arr[2];
      let semester = allSemester.filter(s => s.startYear === startYear && s.endYear === endYear && s.semesterCode == semesterName);
      setSelectedSemester(semester[0].id);
    }
  
    const clearFilter = () => {
      setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
      setSemesterName(currentSemester.semesterCode);
      setSelectedSemester(currentSemester.id);
    }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`,
            overflow: `auto`
        }}>
         <Typography variant="h5">Thống kê</Typography>
        <Divider />
        <Grid container alignItems={"center"} gap={2}>
            <Grid xs={12} md={4.3}>
            <TextField fullWidth color="secondary" variant="standard" select={schoolYears.length > 0} value={schoolYear} onChange={(e) => {setSchoolYear(e.target.value)}} label="Niên khoá">
                    {schoolYears.length > 0 ? schoolYears.map((option) => (
                        <MenuItem  key={option.label} value={option.label}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
            </Grid>
            <Grid xs={12} md={4.3}>
            <TextField fullWidth color="secondary" variant="standard" select={semesters.length > 0} value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
                    {semesters.length > 0 ? semesters.map((option) => (
                        <MenuItem  key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem >
                    )): <></>}
                    </TextField>
            </Grid>
            <Grid xs={12} md={1.2}>
                <Button fullWidth onClick={() => doFilter()} variant="contained" size="large" startIcon={<FilterAlt />}>
                  Lọc
                  </Button> 
              </Grid>
              <Grid xs={12} md={1.2}>
                <Button fullWidth onClick={() => clearFilter()} variant="contained" size="large" startIcon={<RotateLeft />}>
                  Đặt lại
                  </Button> 
              </Grid>
        </Grid>
        <Grid container sx={{width: `100%`}} spacing={1}>
            <Grid xs={12}> <Typography variant="h5">Luận văn tốt nghiệp ngành Kỹ thuật phần mềm - CT594</Typography></Grid>
            <Grid xs={12} md={5.8}><span style={{fontWeight: `bold`}}>Số nhóm học phần: </span> {count.course}</Grid>
            <Grid xs={12} md={5.8}><span style={{fontWeight: `bold`}}>Tổng số sinh viên: </span> {count.student}</Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} sx={{width: `100%`}}>
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
            </Grid>
            <Lecturer />
        </Stack>
    )
}

Admin.Layout = AdminLayout;

export default Admin;