import { Code, Delete, FolderZip } from "@mui/icons-material";
import { Breadcrumbs, Button, Divider, Unstable_Grid2 as Grid, Stack, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Committee from "../../../component/admin/thesis/Committee";
import Student from "../../../component/admin/thesis/Student";
import AdminLayout from "../../../component/layout/AdminLayout"
import { setCurrentPage } from "../../../features/pathSlice";


const Detail = () =>{

    const router = useRouter();
    const { detail } = router.query;
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        dispatch(setCurrentPage("thesis"));
    })

    return (
    <Stack direction={"column"} gap={1} sx={{
        width: `100%`,
        overflowY: `auto`,
        overflowX: 'hidden',
        height: `100%`,
    }}>
        <Grid container width={"100%"} alignItems="center">
            <Grid md={9} lg={10} xl={10.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/admin">
                    Home
                    </Link>
                    <Link underline="hover" color="inherit" href="/admin/thesis">
                    Thesis
                    </Link>
                    <Typography color="text.primary">Detail</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid md={3} lg={2} xl={1.5}>
                <Button size="medium" variant="contained" onClick={() => {setOpen(true)}} color={"error"} startIcon={<Delete />}>
                    Xoá
                </Button>
            </Grid>
        </Grid>
        <Typography variant="h5">Tên tiếng Việt của đề tài luận văn</Typography>
        <Typography>Tên tiếng Anh của đề tài luận văn</Typography>
        <Divider />
        <Grid container sx={{width: `100%`}}>
            <Grid container xs={12} md={7} spacing={1} sx={{width: `100%`}}>
                <Grid xs={12} >
                    <Typography variant="h6">Thông tin cơ bản</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>Học kỳ I</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>Năm học: 2022 - 2023</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>GVGD: Nguyễn Văn A</Typography>
                </Grid>
                <Grid xs={12} md={5}>
                    <Typography>MSGV: 098765</Typography>
                </Grid>
                <Grid xs={12}>
                    <Stack direction="row" alignItems={"center"} gap={2}><Typography>Trạng thái: </Typography> <Chip label={"Đang thực hiện"} color="success"/></Stack>
                </Grid>
            </Grid>
            <Grid xs={12} md={5} container spacing={1} sx={{width: `100%`}}>
                <Grid>
                    <Typography variant="h6">Lịch báo cáo</Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography>Thời gian: 7h30 - 12/12/2022</Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography>Địa điểm: Phòng 103 - Khoa CNTT & TT</Typography>
                </Grid>
                <Grid></Grid>
            </Grid>
        </Grid>
            <Grid container sx={{width: `100%`}}>
                <Grid container xs={12} md={7} spacing={1} sx={{width: `100%`}}>
                    <Grid xs={12} >
                        <Typography variant="h6">Điểm luận văn</Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                        <Typography>Điểm số: 9</Typography>
                    </Grid>
                    <Grid xs={12} md={5}>
                        <Typography>Điểm chữ: A</Typography>
                    </Grid>
                </Grid>
                <Grid xs={12} md={5} container spacing={1} sx={{width: `100%`}}>
                    <Grid xs={12} >
                        <Typography variant="h6">Tài liệu luận văn</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Stack direction="row" gap={2} sx={{width: `100%`}}>
                            <Tooltip title={"Mã nguồn của đề tại luận văn"} arrow>
                                <IconButton variant=""><Code/></IconButton>
                            </Tooltip>
                            <Tooltip  title={"File báo cáo của đề tại luận văn"} arrow>
                                <IconButton><FolderZip/></IconButton>
                            </Tooltip>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        <Divider />
        <Typography variant="h6">Thành viên hội đồng</Typography>
        <Committee />
        <Typography variant="h6">Sinh viên thực hiện</Typography>
        <Student />
    </Stack>
    )
}

Detail.Layout = AdminLayout;
export default Detail;