import { DataGrid } from "@mui/x-data-grid"
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import StudentInfo from "./StudentInfo";


const columns = [
    { field: "studentCode", headerName: 'MSSV', width: 150, flex: 1},
    { field: 'name', headerName: 'Tên sinh viên', width: 150, flex: 3 },
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: StudentInfo}
  ];

const Student = ({data}) => {

    return (
        <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={data} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
    )
}

export default Student;