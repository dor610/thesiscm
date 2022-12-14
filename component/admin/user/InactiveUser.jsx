import { DataGrid } from "@mui/x-data-grid"
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import NormalChip from "../../common/NormalChip";
import { useEffect, useState } from "react";
import { sendAuthGetRequest } from "../../../common/utils";
import InfoButton from "./InfoButton";
import { LinearProgress } from "@mui/material";

  const columns = [
    { field: 'account', headerName: 'Tài khoản', width: 150, flex: 1},
    { field: 'name', headerName: 'Giảng viên', width: 150, flex: 2},
    { field: 'email', headerName: 'Email', width: 150, flex: 2.5 },
    { field: 'fullRole', headerName: 'Vai trò', width: 150, flex: 1 },
    { field: 'status', headerName: 'Trạng thái', width: 150 , flex: 1.5, renderCell: NormalChip},
    { field: 'id', headerName: '', width: 150, flex: 1, renderCell: InfoButton},
  ];

const InactiveUser = () =>{

  const [rows, setRows] = useState([]);
  const [onProcess, setOnProcess] = useState(false);

  useEffect(() => {
      getData();
  }, []);

  const getData = async () =>{
    setOnProcess(true);
    let res = await sendAuthGetRequest("/api/user/inactivate");
    if (res.status === 200){
      setRows(res.data.map((u, index) => {return {
        ...u, name: `${u.title}. ${u.name}`, no: index + 1
      }}));
      setOnProcess(false);
    }
  }

    return (
        <>
          {onProcess? <LinearProgress /> : <></>}
          <DataGrid autoPageSize pagination
                      components={{
                        NoRowsOverlay: NoRowOverlay,
                        Pagination: CustomPagination,
                      }} 
                      rows={rows} 
                      columns={columns} 
                      getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
              />
        </>
    )
}

export default InactiveUser;