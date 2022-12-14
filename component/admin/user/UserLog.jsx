import { LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react"
import { miliSecToDate, sendAuthGetRequest } from "../../../common/utils";
import CustomPagination from "../../common/CustomPagination";
import NoRowOverlay from "../../common/NoRowOverlay";
import UserLogStatusChip from "./UserLogStatusChip";

const columns = [
    { field: "time", headerName: 'Thời gian', width: 150, flex: 1},
    { field: 'typeObj', headerName: 'Loại hoạt động', width: 150, flex: 1, renderCell:UserLogStatusChip },
    { field: 'note', headerName: 'Ghi chú', width: 150, flex: 5},
]

const UserLog = ({userId, reload, setReload}) =>{

    const [data, setData] = useState([]);
    const [onProcess, setOnProcess] = useState(false);

    useEffect(() => {
        if(userId && data.length === 0) {
            getData(userId);
        }
    }, [userId, data]);

    useEffect(() => {
        if(reload) {
            getData(userId);
        }
    }, [reload]);

    const getData = async (id) =>{
        setOnProcess(true);
        setReload(false);
        let result = await sendAuthGetRequest("/api/user/log?id="+id);
        if(result.status === 200){
            setData(result.data.map((log, index) => ({id: index+"_user_log", time: miliSecToDate(log.timestamp), typeObj: {code: log.typeCode, text: log.type}, ...log})));
            setOnProcess(false);
        }
    }

    return (
        <>
        {onProcess? <LinearProgress />: <></>}
        <DataGrid autoPageSize pagination
                    components={{
                      NoRowsOverlay: NoRowOverlay,
                      Pagination: CustomPagination,
                    }} 
                    rows={data} 
                    columns={columns} 
            />
        </>
    )
}

export default UserLog;