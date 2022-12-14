import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import InfoButton from "./InfoButton";
import { Stack } from "@mui/system";
import { LinearProgress, MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { sendAuthGetRequest } from "../../../common/utils";
import { useSelector } from "react-redux";
import TopicStatus from "../../common/TopicStatus";

  const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: "name", headerName: 'Tên đề tài', width: 150, flex: 4},
    { field: "status", headerName: 'Trạng thái', width: 150, flex: 1, renderCell: TopicStatus},
    { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1},
    { field: "studentName", headerName: 'Sinh viên', width: 150, flex: 2},
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: InfoButton}
  ];

const CurrentTopic = () =>{
    const account = useSelector(state => state.user.account);

    const [semesters, setSemesters] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    const [rows, setRows] = useState([]);

    const [semesterName, setSemesterName] = useState("1");
    const [schoolYear, setSchoolYear] = useState("2022-2023");

    const [schoolYearValid, setSchoolYearValid] = useState(true);
    const [validSemester, setValidSemester] = useState(true);

    useEffect(() => {
      getData();
    }, []);

    const getData = async () =>{
      setOnProcess(true);
      let result = await sendAuthGetRequest("/api/topic/currentSemesterByAccount?account="+account);
      if(result.status === 200) {
        setOnProcess(false);
        let arr = []
        let count = 0;
        result.data.forEach(element => {
          console.log(element);
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
      } else{
        setOnProcess(false);
      }
    }

    return (
        <Stack direction={"column"} gap={2} sx={{
          width: `100%`,
          height: `100%`
        }}>
        {onProcess? <LinearProgress /> : <></>}
        {rows.length > 0? <Typography variant="h6">Danh sách đề tài đang hướng dẫn trong {rows[0].semesterValue}, Năm học {rows[0].schoolYear}</Typography>: <Skeleton animation="wave" />}
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

export default CurrentTopic;