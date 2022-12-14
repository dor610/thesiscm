import { DataGrid } from "@mui/x-data-grid";
import NoRowOverlay from "../../common/NoRowOverlay";
import CustomPagination from "../../common/CustomPagination";
import SuccessChip from "../../common/SuccessChip";
import DisableButton from "./DisableButton";
import { useEffect, useState } from "react";
import { sendAuthGetRequest } from "../../../common/utils";
import InfoButton from "./InfoButton";

  const columns = [
    { field: 'account', headerName: 'Tài khoản', width: 150, flex: 1},
    { field: 'name', headerName: 'Họ tên', width: 150, flex: 2},
    { field: 'email', headerName: 'Email', width: 150, flex: 2.5 },
    { field: 'roleName', headerName: 'Vai trò', width: 150, flex: 1 },
    { field: 'status', headerName: 'Trạng thái', width: 150 , flex: 1, renderCell: SuccessChip},
    { field: 'id', headerName: "", with: 150, flex: 1.5,  renderCell: InfoButton}
  ];

const EnabledUser = () =>{

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if(rows.length === 0) {
      getData();
    }
  }, [rows]);

  const generateRoleName = (role) => {
    console.log(role);
    if(role.includes("2"))
      return "Thư ký bộ môn";
    else if (role.includes("3"))
      return "Quản lý bộ môn";
    else if (role.includes("1"))
      return "Giảng viên";
    else return "Uỷ viên";
  }

  const getData = async () =>{
    let res = await sendAuthGetRequest("/api/user/enabled");
    if (res.status === 200){
      setRows(res.data.map((data, index) => (
        {no: index + 1,
          roleName: generateRoleName(data.role),
          ...data,})));
    }
  }

    return (
        <DataGrid autoPageSize pagination
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                      Pagination: CustomPagination,
                    }} 
                    rows={rows} 
                    columns={columns} 
                    getRowClassName={(params) => `${params.row.no%2 != 0? "odd": "even"}-row`} 
            />
    )
}

export default EnabledUser;