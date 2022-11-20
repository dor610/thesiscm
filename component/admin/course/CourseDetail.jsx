import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import InfoButton from "./InfoButton";
import { Stack } from "@mui/system";
import { Grid, LinearProgress, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { miliSecToDateOnly } from "../../../common/utils";

  const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1 },
    { field: 'name', headerName: 'Họ và tên', width: 150, flex: 2 },
    { field: 'date', headerName: 'Ngày sinh', width: 150, flex: 1},
    { field: 'classCode', headerName: 'Mã lớp', width: 150, flex: 1}
  ];

const CourseDetail = ({filter = false, students = null}) =>{
  
    return (
        <DataGrid autoPageSize pagination
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                      Pagination: CustomPagination,
                    }}
                    rows={students==null? []: students.map((data, index) => ({"no":index + 1, date: miliSecToDateOnly(data.dateOfBirth), ...data}))} 
                    columns={columns} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
            />
    )
}

export default CourseDetail;