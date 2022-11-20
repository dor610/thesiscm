import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";

const rows = [
    {id: 1, name: "Nguyễn Văn A", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
    {id: 2, name: "Nguyễn Văn B", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
    {id: 3, name: "Nguyễn Văn A", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
    {id: 4, name: "Nguyễn Văn B", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
    {id: 5, name: "Nguyễn Văn A", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
    {id: 6, name: "Nguyễn Văn B", code: "098765", role: "Chưa được chấm", mark: "Chưa được chấm"},
];

const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'name', headerName: 'Sinh viên', width: 150, flex: 2 },
    { field: 'code', headerName: 'MSSV', width: 150, flex: 1 },
    { field: 'role', headerName: 'Điểm số', width: 150, flex: 1},
    { field: 'mark', headerName: 'Điểm chữ', width: 150, flex: 1},
]



const Student = () =>{

    return (
        <Stack sx={{
            width: `100%`
        }}>
            <DataGrid  hideFooter
                    components={{
                      NoRowsOverlay: NoRowOverlay
                    }}
                    autoHeight
                    rows={rows.map((data, index) => ({"no": index + 1, ...data}))} 
                    columns={columns} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
            />
        </Stack>
    )
}

export default Student;