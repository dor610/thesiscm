import { DataGrid } from "@mui/x-data-grid";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";

const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: "courseNumber", headerName: 'Mã nhóm', width: 150, flex: 1},
    { field: 'lecturerName', headerName: 'Giáo viên hướng dẫn', width: 150, flex: 2 },
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 1 },
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1 },
  ];

const Course = ({data}) => {

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
    );
}

export default Course;