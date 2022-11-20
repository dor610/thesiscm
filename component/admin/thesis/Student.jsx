import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";


const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'name', headerName: 'Sinh viên', width: 150, flex: 2 },
    { field: 'studentCode', headerName: 'MSSV', width: 150, flex: 1 },
    { field: 'numberMark', headerName: 'Điểm số', width: 150, flex: 1},
    { field: 'letterMark', headerName: 'Điểm chữ', width: 150, flex: 1},
]



const Student = ({data = []}) =>{

    return (
        <Stack sx={{
            width: `100%`
        }}>
            <DataGrid  hideFooter
                    components={{
                      NoRowsOverlay: NoRowOverlay
                    }}
                    autoHeight
                    rows={data.map((data, index) => ({"no": index + 1, ...data}))} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`}
                    columns={columns} 
            />
        </Stack>
    )
}

export default Student;