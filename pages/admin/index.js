import { Clear } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Unstable_Grid2 as Grid, Stack, Typography, Breadcrumbs, Button, Box, Tab, Divider, TextField, MenuItem } from "@mui/material"
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useDispatch } from "react-redux";
import { sendAuthGetRequest } from "../../common/utils";
import CreateSemester from "../../component/admin/semester/CreateSemester";
import EditSemester from "../../component/admin/semester/EditSemester";
import AdminLayout from "../../component/layout/AdminLayout";
import { setCurrentPage } from "../../features/pathSlice";

export const data = [
    [
      "Điểm",
      "Số sinh viên",
    ],
    ["A", 4],
    ["B+", 2],
    ["B", 8],
    ["C+", 5],
    ["C", 10],
    ["D+", 2],
    ["D", 3],
    ["F", 0],
  ];
  
  export const columnData = [
      ["Loại ", "Số lượng sinh viên"],
      ["Điểm I", 3],
      ["Không có điểm I", 15],
    ];
  
    export const columnData1 = [
      ["Học kỳ và niên khoá", "Đạt", "Không đạt"],
      ["HK I, 2020-2021", 4, 2],
      ["HK II, 2021-2022", 8, 1],
      ["HK II, 2021-2022", 6, 0],
      ["HK I, 2022-2023", 0, 0],
    ];
    
    export const options = {
      chart: {
        title: "Tỉ lệ đạt/không đạt của sinh viên",
        subtitle: "Số liệu từ 4 học kỳ gần nhất",
      },
    };
  
  export const options1 = {
    chart: {
      title: "Điểm của sinh viên trong học kỳ hiện tại",
      subtitle: "Không bao gồm sinh viên có điểm I",
    },
  };
  export const options2 = {
      chart: {
        title: "Số lượng sinh viên xin điểm I trong học kỳ hiện tại",
        subtitle: "",
      },
    };
  

const Admin = () => {

    const semesters = [{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}];
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();
    
    useEffect(() => {
        dispatch(setCurrentPage("dashboard"));
    })

    useEffect(() => {
        getSchoolYears();
      }, []);

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
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`
        }}>
         <Typography variant="h5">Thống kê</Typography>
        <Divider />
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
        <Grid container sx={{width: `100%`}} spacing={1}>
            <Grid xs={12}> <Typography variant="h5">Luận văn tốt nghiệp ngành Kỹ thuật phần mềm - CT594</Typography></Grid>
            <Grid xs={12} md={5.8}><span style={{fontWeight: `bold`}}>Số nhóm học phần: </span> 5</Grid>
            <Grid xs={12} md={5.8}><span style={{fontWeight: `bold`}}>Tổng số sinh viên: </span> 30</Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} sx={{width: `100%`}}>
                <Grid xs={12} md={5.8}>
                    <Chart
                        chartType="Line"
                        width="100%"
                        height="400px"
                        data={data}
                        options={options1}
                        />
                </Grid>
                <Grid xs={12} md={5.8}>
                <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={columnData}
                    options={options2}
                    />
                </Grid>
                <Grid xs={12}>
                    <Typography>Xem thống kê điểm theo giảng viên</Typography>
                </Grid>
            </Grid>
        </Stack>
    )
}

Admin.Layout = AdminLayout;

export default Admin;