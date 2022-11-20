import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";

const rows = [
    {id: 1, name: "Nguyễn Văn A", code: "098765", role: "Chủ tịch hội đồng"},
    {id: 2, name: "Nguyễn Văn B", code: "098765", role: "Thư ký hội đồng"},
    {id: 3, name: "Nguyễn Văn C", code: "098765", role: "Thành viên hội đồng"},
];

const columns = [
    { field: "no", headerName: 'STT', width: 150, flex: 0.5},
    { field: 'name', headerName: 'Giảng viên', width: 150, flex: 2 },
    { field: 'code', headerName: 'MSGV', width: 150, flex: 1 },
    { field: 'role', headerName: 'Vai trò', width: 150, flex: 1},
]



const Committee = () =>{

    return (
        <Stack sx={{
            width: `100%`,
        }}>
            <DataGrid hideFooter
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                    }} 
                    autoHeight
                    rows={rows.map((data, index) => ({"no":index + 1, ...data}))} 
                    columns={columns} 
            />
        </Stack>
    )
}

export default Committee;