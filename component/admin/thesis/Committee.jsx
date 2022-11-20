import { Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
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



const Committee = (data = null) =>{
    const [rows, setRows] = useState([]);

    useEffect(() =>{
        console.log(data);
        if(data) {
            let obj = [];
            obj[0] = {
                id: data.data.president.id,
                no: 1,
                name: data.data.president.title + ", " + data.data.president.name,
                code: data.data.president.account,
                role: "Chủ tịch hội đồng",
            }
            obj[1] = {
                id: data.data.member.id,
                no: 2,
                name: data.data.member.title + ", " + data.data.member.name,
                code: data.data.member.account,
                role: "Uỷ viên",
            }
            obj[2] = {
                id: data.data.secretary.id,
                no: 3,
                name: data.data.secretary.title + ", " + data.data.secretary.name,
                code: data.data.secretary.account,
                role: "Thư ký hội đồng",
            }
            setRows(obj);
        }
    }, [data]);

    return (
        <Stack direction="column" gap={2} sx={{
            width: `100%`,
        }}>
            {data? <>
                <Grid container gap={0.5} sx={{width: `100%`}}>
                <Grid xs={12}>
                    <Typography variant="h6">Lịch báo cáo của sinh viên {data.data.student.name}</Typography>
                </Grid>
                <Grid xs={12} md={5.8}>
                    <Typography><span style={{fontWeight: 'bold'}}>Thời gian:</span> {data? data.data.time + " - " + data.data.date: ""}</Typography>
                </Grid>
                <Grid xs={12} md={6}>
                    <Typography><span style={{fontWeight: 'bold'}}>Địa điểm:</span> Phòng {data? data.data.place: ""} - Trường CNTT & TT</Typography>
                </Grid>
            </Grid>
            <DataGrid hideFooter
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                    }} 
                    autoHeight
                    rows={rows} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`}
                    columns={columns} 
            /></>:<></>}
        </Stack>
    )
}

export default Committee;