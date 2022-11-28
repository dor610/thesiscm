import { Box, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { miliSecToDateOnly } from "../../../common/utils";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import StudentInfoButton from "./StudentInfoButton";


const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'studentCode', headerName: 'Mã SV', width: 150, flex: 1},
    { field: 'name', headerName: 'Họ và tên', width: 150, flex: 2},
    { field: 'dob', headerName: 'Ngày sinh', width: 150, flex: 1},
    { field: 'classCode', headerName: 'Mã lớp', width: 150, flex: 1},
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: StudentInfoButton}
  ];

const Students = ({classCode = "", students = []}) => {

    useEffect(() => {
        if(classCode != "") {
            getData();
        }
    }, [classCode]);

    const getData = async () => {
        setOnProcess(true);
        let result = await sendAuthGetRequest("");
        if(result.status === 200) {
            setOnProcess(false);
        } else {
            setOnProcess(false);
        }

    }

    return (
        <Box sx={{
            width: `100%`,
            height: `100%`
        }}>
          <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={students.map((s, i) => ({no: i + 1, dob: miliSecToDateOnly(s.dateOfBirth), ...s}))} 
                      columns={columns}
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
        </Box>
    )
}

export default Students;