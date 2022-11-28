import { DataGrid } from "@mui/x-data-grid"
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import ToipcInfo from "./TopicInfo";

const columns = [
    { field: "name", headerName: 'Tên đề tài', width: 150, flex: 3},
    { field: 'enName', headerName: 'Tên tiếng Anh', width: 150, flex: 3 },
    { field: 'semesterName', headerName: 'Học kỳ', width: 150, flex: 1},
    { field: 'schoolYear', headerName: 'Niên khoá', width: 150, flex: 1},
    { field: 'id', headerName: "", with: 150, flex: 1, renderCell: ToipcInfo}
  ];

const Topic = ({data}) => {

    return (
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
                      rows={data} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
    )
}

export default Topic;