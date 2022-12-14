import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../component/layout/UserLayout";
import { setCurrentPage } from "../../features/pathSlice";

import { Chart } from "react-google-charts";
import { Breadcrumbs, Divider, Unstable_Grid2 as Grid, Stack, Typography, Button, MenuItem, TextField, LinearProgress } from "@mui/material";
import Link from "next/link";
import { sendAuthGetRequest } from "../../common/utils";
import { Delete, Filter, FilterAlt, RotateLeft, SendOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";

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

const Dashboard = () =>{

    const dispatch = useDispatch();
    const router = useRouter();
    const account = useSelector(state => state.user.account);
    const userRole = useSelector(state => state.user.role);
    const [semesters, setSemesters] = useState([{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);
    const [allSemester, setAllSemester] = useState([]);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");

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
        dispatch(setCurrentPage("dashboard"));
    })

    useEffect(() => {
      if(!userRole.includes("1")){
        router.push("/user/schedule");
      }
    })

    useEffect(() =>{
      if(currentSemester){
        setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
        setSemesterName(currentSemester.semesterCode);
      }
    },[currentSemester, account]);

    useEffect(() => {
      if(selectedSemester && account){
        getPointData();
        getImarkData();
      }
    }, [selectedSemester, account]);

    useEffect(() => {
      if(reports) {
        processData();
      }
    }, [reports]);

    useEffect(() => {
      if(schoolYear && allSemester){
        getSemesters();
      }
    }, [schoolYear, allSemester])

    useEffect(() => {
      getCurrentSemester();
      getAllSemester();
      getSchoolYears();
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
      if(result.status === 200) {
        setSchoolYears(result.data);
      }
    }

    const getPointData = async () => {
      setOnProcess(true);
      let res = await sendAuthGetRequest("/api/report/user?account="+account+"&semester="+selectedSemester);
      console.log(res);
      if(res.status == 200) {
        setOnProcess(false);
        setReports(res.data);
      }else {
        setOnProcess(false);
      }
    }

    const getImarkData = async () => {
      setOnProcess(true);
      let res = await sendAuthGetRequest("/api/course/imark/user-semester?account="+account+"&semester="+selectedSemester);
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
      console.log(point3);
      point1[1][1] = point3[7][1] + point3[6][1] + point3[5][1] + point3[4][1] + point3[3][1] + point3[2][1] + point3[1][1];
      point1[1][2] = point3[8][1];
      setData1(point1);
    }

    const doFilter = () => {
      let arr = schoolYear.split(" ");
      let startYear = arr[0];
      let endYear = arr[2];
      let semester = allSemester.filter(s => s.startYear === startYear && s.endYear === endYear && s.semesterCode == semesterName);
      setSelectedSemester(semester[0].id);
    }

    const clearFilter = () => {
      setSelectedSemester(currentSemester.id);
      setSchoolYear(currentSemester.startYear + " - " + currentSemester.endYear);
      setSemesterName(currentSemester.semesterCode);
    }

    const changeSchoolYear = (e) => {
      setSchoolYear(e.target.value);
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

    return (
        <Stack direction={"column"} spacing={2} sx={{
            width: `100%`,
            height: `100%`,
            overflow: `auto`,
            '&::-webkit-scrollbar': {
                display: `none`,
            } }}>
            <Grid container width={"100%"} alignItems="center">
                <Grid md={9} lg={10} xl={10.5}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography>
                        Tổng quan
                        </Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid md={3} lg={2} xl={1.5}>
                </Grid>
            </Grid>
            <Typography variant="h5">Tổng quan</Typography>
            <Divider />
            {onProcess? <LinearProgress />: <></>}
            <Grid container spacing={2}>
              <Grid xs={12} md={4.3}>
                <TextField variant="standard" fullWidth color="secondary" select={schoolYears.length > 0} required value={schoolYear} onChange={(e) => {changeSchoolYear(e)}} label="Niên khoá">
                          {schoolYears.length > 0 ? schoolYears.map((option) => (
                              <MenuItem  key={option.label} value={option.label}>
                              {option.label}
                              </MenuItem >
                          )): <></>}
                          </TextField>
                </Grid>
              <Grid xs={12} md={4.3}>
              <TextField variant="standard" fullWidth color="secondary" select={semesters.length > 0}  required value={semesterName} onChange={(e) => {setSemesterName(e.target.value)}} label="Học kỳ">
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
              <Grid xs={12} md={1.8}>
                <Button fullWidth onClick={() => clearFilter()} variant="contained" size="large" startIcon={<RotateLeft />}>
                  Đặt lại
                  </Button> 
              </Grid>
            </Grid>
            <Grid container gap={2} sx={{width: `100%`}}>
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
                      {onProcess? <LinearProgress />:
                      <Chart
                      chartType="LineChart"
                      width="100%"
                      height="310px"
                      data={data3}
                      options={options2}
                      />}
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}

Dashboard.Layout = UserLayout;

export default Dashboard;