import { DataGrid } from "@mui/x-data-grid";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import TopicStatus from "../../common/TopicStatus";

const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: "name", headerName: 'Tên đề tài', width: 150, flex: 3.5},
    { field: 'lecturerName', headerName: 'Giáo viên hướng dẫn', width: 150, flex: 1.5 },
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 0.5 },
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 0.7 },
    { field: 'status', headerName: 'Trạng thái', width: 150, flex: 1, renderCell: TopicStatus },
  ];

const StudentTopic = ({data}) => {

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

export default StudentTopic;