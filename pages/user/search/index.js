import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../../../features/pathSlice";
import UserLayout from "../../../component/layout/UserLayout";
import { Breadcrumbs, Unstable_Grid2 as Grid, Typography, Divider, TextField, MenuItem, Button, LinearProgress } from "@mui/material";
import Link from "next/link";
import { Box, Stack } from "@mui/system";
import { Clear, SearchOutlined } from "@mui/icons-material";
import { sendAuthGetRequest, sendGetRequest } from "../../../common/utils";
import Topic from "../../../component/user/search/topic";
import Student from "../../../component/user/search/Student";

const Search = () =>{

    const dispatch = useDispatch();
    const [keyWord, setKeyWord] = useState("");
    const [type, setType] = useState("1");
    const [allTopic, setAllTopic] = useState([]);
    const [topic, setTopic] = useState([]);
    const [students, setStudent] = useState([]);

    const typeLst = [{value: "1", label: "Đề tài luận văn"}, {value: "2", label: "Sinh viên"}];
    const [onProcess, setOnProcess] = useState(false);
    const semesters = [{value: "1", label: "Học kỳ I"}, {value: "2", label: "Học kỳ II"}];
    const [schoolYears, setSchoolYears] = useState([]);
    const [semesterName, setSemesterName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [message, setMessage] = useState("Vui lòng nhập từ khoá để tìm kiếm");

    useEffect(() =>{
        dispatch(setCurrentPage("search"));   
    })

    useEffect(() => {
        console.log(topic);
    }, [topic]);

    useEffect(() => {
        getSchoolYears();
      }, []);
  
      useEffect(() => {
          doFilter();
      }, [schoolYear, semesterName, allTopic]);

    const search = async () => {
      setMessage("Đang tìm kiếm")
        if(keyWord == "") {
            setStudent([]);
            setTopic([]);
            setAllTopic([]);
            setMessage("Vui lòng nhập từ khoá để tìm kiếm");
        } else {
            setOnProcess(true);
            let url = type == "1"? "/api/topic/search?keyWord=" + keyWord : "/api/student/search?keyWord=" + keyWord;
            let result = await sendAuthGetRequest(url);
            console.log(result);
            if(result.status == 200){
                if(result.data.length == 0) {
                    setMessage("Không tìm được kết quả phù hợp");
                }
                else if(type == "2") {
                    setStudent(result.data.map((obj, index) => ({no: index + 1, ...obj})));
                } else {
                    let arr = result.data.map((obj, index) => ({
                      no: index + 1,
                      semesterName: obj.semester.semesterCode == "1"? "I": "II",
                      schoolYear: obj.semester.startYear + " - " + obj.semester.endYear,
                      ...obj,
                    }));
                    setTopic(arr);
                    setAllTopic(arr);
                }
                setOnProcess(false);
            } else {
                setOnProcess(false);
            }
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
            arr = allTopic.filter(row => {
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
            arr = allTopic.filter(row => {
              return row.semester.startYear == startYear && row.semester.endYear == endYear;
            });
        } else if(semesterName != "") {
          arr = allTopic.filter(row => {
            return row.semester.semesterCode == semesterName;
          })
        } else {
          arr = allTopic;
        }
        if(arr.length == 0 && allTopic.length > 0) {
          setMessage("Không có kết quả");
        } else {
          setMessage("Nhập từ khoá để tìm kiếm");
        }
        setTopic(arr);
      }
  
      const clearFilter = () => {
        setSchoolYear("");
        setSemesterName("");
      }

    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`,
            overflow: `auto`,
            '&::-webkit-scrollbar': {
                display: `none`,
            } }}>
            <Grid container width={"100%"} alignItems="center">
                <Grid md={9} lg={10} xl={10.5}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/user">
                        Trang chủ
                        </Link>
                        <Typography color="text.primary">Tìm kiếm</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid md={3} lg={2} xl={1.5}>
                </Grid>
            </Grid>
            <Typography variant="h5">Tìm kiếm</Typography>
            <Divider />
            <Box sx={{width: `100%`, py: `20px`}}>
            <Stack direction={{xs: "column", md: "row"}}  gap={1}>
                <TextField select value={type} onChange={e => setType(e.target.value)} label={"Loại tìm kiếm"} variant={"outlined"} sx={{width: {xs: `100%`, md: `250px`}}} >
                    {typeLst.map(obj => (
                        <MenuItem key={Math.random()} value={obj.value}>
                            {obj.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField fullWidth type="search" onKeyUp={e => {(e.key === 'Enter' || e.keyCode === 13)? search(): ""}} label={type == "1"? "Nhập tên tiếng Việt hoặc tiếng Anh của đề tài luận văn": "Nhập tên hoặc mã số của sinh viên"} value={keyWord} onChange={e => setKeyWord(e.target.value)}/>
                <Button sx={{width: {xs: `50%`, md: `200px`}}} onClick={e => search()} size={"large"} variant="contained" startIcon={<SearchOutlined />}>Tìm</Button>
            </Stack>
            </Box>
            {onProcess? <LinearProgress />: <></>}
            {type == "1" && allTopic.length > 0? <Grid container alignItems={"center"} gap={2}>
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
            </Grid>: <></>}
            {type == "1"? topic.length > 0? <Topic data={topic}/>: <Box sx={{py: `100px`}}><Typography sx={{textAlign: `center`}} variant="h5">{message}</Typography></Box>: students.length > 0 ? <Student data={students} />: <Box sx={{py: `100px`}}><Typography sx={{textAlign: `center`}} variant="h5">{message}</Typography></Box>}
        </Stack>
    )
}

Search.Layout = UserLayout;

export default Search;