import { LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../../../common/utils";
import { setReloadImark } from "../../../../features/commonSlice";
import CustomPagination from "../../../common/CustomPagination";
import NoRowOverlay from "../../../common/NoRowOverlay";
import InfoButton from "./InfoButton";


const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1 },
    { field: 'studentName', headerName: 'Tên sinh viên', width: 150, flex: 3},
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 1},
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1},
    { field: 'endDate', headerName: 'Ngày kết thúc', width: 150, flex: 1},
    { field: 'id', headerName: "Thông tin", with: 150, flex: 1, renderCell: InfoButton}
  ];

const Current = () => {

  const userId = useSelector(state => state.user.id);
  const reload = useSelector(state => state.common.reloadImark);
  const dispatch = useDispatch();
  const [onProcess, setOnProcess] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, [])
  
  useEffect(() => {
    if(reload){
      getData();
    }
  }, [reload])

  const getData = async () => {
    setOnProcess(true);
    let res = await sendAuthGetRequest("/api/course/imark/confirm?lecturer="+userId);
    if(res.status == 200) {
      setData(res.data.map((i, index) => ({
        no: index + 1,
        studentCode: i.student.studentCode,
        studentName: i.student.name,
        semesterName: i.semester.semesterCode == "1"? "I": "II",
        schoolYear: i.semester.startYear + " - " + i.semester.endYear,
        endDate: miliSecToDateOnly(i.expirationDate),
        ...i,
      })));
      setOnProcess(false);
      dispatch(setReloadImark(false));
    } else {
      dispatch(setReloadImark(false));
      setOnProcess(false);
    }
  }

    return (
        <>
        {onProcess? <LinearProgress />:<></>}
        <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={data} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
        </>
    )
}

export default Current;