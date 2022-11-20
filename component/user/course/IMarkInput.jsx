import { FileUpload, Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sendAuthGetRequest } from "../../../common/utils";
import IMark from "./IMark";

const IMarkInput = ({step, setIsNext}) => {

    const account = useSelector(state => state.user.account);
    const [onProcess, setOnProcess] = useState(false);
    const [students, setStudents] = useState({});

    const [student, setStudent] = useState("");
    const [lecturerComment, setLecturerComment] = useState("");
    const [deanComment, setDeanComment] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState(null);

    const [fileName, setFileName] = useState("Chọn file");
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        console.log(step);
    })

    useEffect(() => {
        getStudents();
    }, [])

    useEffect(() => {
        if(file){
            setFileUrl(URL.createObjectURL(file));
        }
    }, [file])

    useEffect(() => {
        if(student == "") {
            setIsNext(false);
        }else{
            setIsNext(true);
        }
    }, [student])

    const getStudents = async () => {
        let result = await sendAuthGetRequest("/api/student/current?account="+account);
        if(result.status === 200){
            let data = {};
            result.data.forEach(s => {
                data[s.id] = s.studentCode + " - " + s.name;   
               });
            setStudents(data);
        } 
    }

    return (
        <>
        {step == 0? <Stack direction={"column"} sx={{width: `60%`, py: `50px`, mx: `auto`}} gap={2}>
            <Typography variant="h5">Chọn sinh viên cần xét điểm I</Typography>
            <TextField label="Chọn sinh viên" select fullWidth value = {student} onChange={e => setStudent(e.target.value)} >
                {Object.keys(students).map((id) => (
                        <MenuItem  key={"individual_"+students[id]} value={id}>
                            {students[id]}
                        </MenuItem >
                    ))}
            </TextField>
        </Stack>: step == 1? <IMark reason={reason} setReason={setReason} lecturerComment={lecturerComment} setLecturerComment={setLecturerComment}
         account={account} deanComment={deanComment} setDeanComment={setDeanComment} student={student}/>: step == 2?<Stack>
            <Stack direction={"column"} sx={{width: `100%`, height: `100%`, overflow: `auto`}} gap={2}>
                <Stack gap={2} direction={"row"} sx={{width: `60%`, py: `20px`, mx: `auto`}} >
                    <Button variant="contained" startIcon={<FileUpload />} sx={{width: `150px`}} component="label" >
                        Tải lên
                        <input hidden onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name)}} accept="image/*" type="file" />
                    </Button>
                    <TextField value={fileName} onChange={e => e.preventDefault()} fullWidth/>
                </Stack>
                <div style={{width: `60%`, minHeight: `500px`, marginLeft:`auto`, marginRight: `auto`, position: `relative`}}>
                    {file? <Image src={URL.createObjectURL(file)} alt="" layout="fill" objectFit='contain'/>: <></>}
                </div>
            </Stack>
        </Stack>:<Stack direction={"column"} gap={2} alignItems="center" justifyContent={"center"} sx={{width: `60%`, py: `50px`, mx: `auto`}}>
                <CircularProgress />
                <Typography>Đang xử lý...</Typography>
            </Stack>}
        </>
    )
}

export default IMarkInput;