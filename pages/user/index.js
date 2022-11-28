import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UserLayout from "../../component/layout/UserLayout";
import { setCurrentPage } from "../../features/pathSlice";

import { Chart } from "react-google-charts";
import { Breadcrumbs, Divider, Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const data = [
  [
    "Điểm",
    "Số sinh viên",
  ],
  ["A", 1],
  ["B+", 2],
  ["B", 5],
  ["C+", 0],
  ["C", 4],
  ["D+", 2],
  ["D", 1],
  ["F", 0],
];

export const columnData = [
    ["Loại ", "Số lượng sinh viên"],
    ["Điểm I", 3],
    ["Không có điểm I", 15],
  ];

  export const columnData1 = [
    ["Học kỳ và niên khoá", "Đạt", "Không đạt"],
    ["HK I, 2020-2021", 4, 2],
    ["HK II, 2021-2022", 8, 1],
    ["HK II, 2021-2022", 6, 0],
    ["HK I, 2022-2023", 0, 0],
  ];
  
  export const options = {
    chart: {
      title: "Tỉ lệ đạt/không đạt của sinh viên",
      subtitle: "Số liệu từ 4 học kỳ gần nhất",
    },
  };

export const options1 = {
  chart: {
    title: "Điểm của sinh viên trong học kỳ hiện tại",
    subtitle: "Bao gồm tất cả sinh viên trong nhóm học phần",
  },
};
export const options2 = {
    chart: {
      title: "Số lượng sinh viên xin điểm I trong học kỳ hiện tại",
      subtitle: "",
    },
  };

const Dashboard = () =>{

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage("dashboard"));
    })


    return (
        <Stack direction={"column"} spacing={1} sx={{
            width: `100%`,
            height: `100%`,
            overflow: `auto`,
            '&::-webkit-scrollbar': {
                display: `none`,
            } }}>
            <Grid container width={"100%"} alignItems="center">
                <Grid md={9} lg={10} xl={10.5}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography>
                        Tổng quan
                        </Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid md={3} lg={2} xl={1.5}>
                </Grid>
            </Grid>
            <Typography variant="h5">Tổng quan</Typography>
            <Divider />
            
            <Grid container gap={2} sx={{width: `100%`}}>
                <Grid xs={12} md={5.8}>
                    <Chart
                        chartType="Line"
                        width="100%"
                        height="400px"
                        data={data}
                        options={options1}
                        />
                </Grid>
                <Grid xs={12} md={5.8}>
                <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={columnData}
                    options={options2}
                    />
                </Grid>
                <Grid xs={12}>
                    <Chart
                        chartType="Bar"
                        width="100%"
                        height="400px"
                        data={columnData1}
                        options={options}
                        />
                </Grid>
            </Grid>
        </Stack>
    )
}

Dashboard.Layout = UserLayout;

export default Dashboard;