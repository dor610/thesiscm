import { DataGrid } from "@mui/x-data-grid"
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../../common/utils";

const columns = [
  { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1},
  { field: 'semesterName', headerName: 'Tên học kỳ', width: 150, flex: 2},
  { field: 'startDateStr', headerName: 'Ngày bắt đầu', width: 150, flex: 1.5 },
  { field: 'endDateStr', headerName: 'Ngày kết thúc', width: 150, flex: 1.5 },
  { field: 'numberOfWeek', headerName: 'Số tuần', width: 150, flex: 1 },
];

const PassSemester = ({load, setLoad}) =>{

  const [rows, setRows] = useState([]);
  const [onProcess, setOnProcess] = useState(false);
  useEffect(() => {
    if(rows.length === 0) {
      getData();
    }
    if(load) {
      getData();
    }
  });

  const getData = async () => {
    setOnProcess(true);
    let result = await sendAuthGetRequest("/api/semester/passed");
    console.log(result);
    if(result.status === 200) {
      setRows(result.data.map((data, index) => ({schoolYear: `${data.startYear} - ${data.endYear}`,
                                        startDateStr: miliSecToDateOnly(data.startDate),
                                        endDateStr: miliSecToDateOnly(data.endDate),
                                        no: index + 1,
                                      ...data})));
      setOnProcess(false);
      setLoad(false);
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
                    rows={rows} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
                    columns={columns} 
            />
        </>
    )
}

export default PassSemester;