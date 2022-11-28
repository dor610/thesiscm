import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, LinearProgress, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendAuthGetRequest, sendAuthPostResquest, sendPostRequest } from "../../../common/utils";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditTopic = ({open, setOpen, data}) => {
    const account = useSelector(state => state.user.account);
    const [onProcess, setOnProcess] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [students, setStudents] = useState({});

    const [viName, setViName] = useState(data.name);
    const [enName, setEnName] = useState(data.enName);
    const [type, setType] = useState(data.typeCode);
    const [studentArr, setStudentArr] = useState([]);
    const [student, setStudent] = useState("");
    const [viNameValid, setViNameValid] = useState(true);
    const [enNameValid, setEnNameValid] = useState(true);

    useEffect(() => {
      getStudents();
      processStudents();
    },[]);

    const onClose =() =>{
        reset();
        setOpen(false);
    }

    const reset = () => {
      setOnProcess(false);
      setMessage("");
      setIsError(false);
      setIsSuccess(false);
      setStudent({});
      setViName("");
      setEnName("");
      setType("1");
      setStudentArr([]);
      setStudent("");
      setViNameValid(true);
      setEnNameValid(true);
    }

    const onSubmit = async () =>{
      setOnProcess(true);
      if(validate()){
        let data = new FormData();
        data.append("type", type);
        data.append("name", viName);
        data.append("enName", enName);
        data.append("id", data.id);
        if(type == "1"){
          data.append("member", student);
        } else {
          data.append("member", studentArr.join(","));
        }
        data.append( "account", account);

        let result = await sendAuthPostResquest("/api/topic/update", data);
        if(result.status === 200) {
          reset();
          setIsSuccess(true);
          setMessage("Chỉnh đề tài luận văn thành công");
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setIsSuccess(false);
          setIsError(true);
          setMessage("Đã có lỗi xảy ra, vui lòng thực hiên lại");
        }
      } else {
        setOnProcess(false);
      }
    }

    const validate = () =>{
      let result = true;
      if(viName == ""){
        result = false;
        setViNameValid(false);
      }

      if(enName == "") {
        result = false;
        setEnNameValid(false);
      }

      if(type == "1" && student == ""){
        setIsError(true);
        setMessage("Vui lòng chọn một sinh viên để thực hiện đề tài");
        result = false;
      } else if(type == "2" && studentArr.length == 0){
        result = false;
        setIsError(true);
        setMessage("Vui lòng chọn ít nhất một sinh viên để thực hiện đề tài");
      }

      return result;
    }

    const onStudentChange = (event) => {
        const {
          target: { value },
        } = event;
        setStudentArr(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };


    const getStudents = async () => {
        let result = await sendAuthGetRequest("/api/student/current?account="+account);
        if(result.status === 200){
          let sds = {};
          result.data.forEach(s => {
            sds[s.studentCode + " - " + s.name] = s.id;   
             });
          setStudents(sds);
      } 
    }

    const processStudents = () => {
            if(data.typeCode == "1") {
              setStudent(data.member[0].id);
            } else {
              setStudentArr(data.member.map(s => s.studentCode + " - " + s.name));
            }
    } 

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>Chỉnh sửa đề tài luận văn</DialogTitle>
        <DialogContent>
          {onProcess? <LinearProgress />: <></>}
          {isError? <Alert severity="error">{message}</Alert>: <></>}
          {isSuccess? <Alert severity="primary">{message}</Alert>: <></>}
          <Stack direction={"column"} sx={{gap: '20px'}}>
          <DialogContentText>
          Chỉnh sửa thông tin của một đề tài luận văn trong học kỳ hiện tại
          </DialogContentText>
          <Stack gap={2} alignItems={"center"} direction={"column"} sx={{width: `100%`}} >
            <TextField fullWidth color="secondary" error={!viNameValid} required value={viName} onChange={(e) => (setViName(e.target.value))} label={"Tên tiếng Việt"}
                        helperText={viNameValid? "" : "Giá trị không hợp lệ"}/>
            <TextField fullWidth color="secondary" error={!enNameValid} required value={enName} onChange={(e) => (setEnName(e.target.value))} label={"Tên tiếng Anh"}
                        helperText={viNameValid? "" : "Giá trị không hợp lệ"}/>
            <TextField fullWidth color="secondary" required select={true}
                        value={type} onChange={(e) => {setType(e.target.value)}} label="Loại đề tài">
                        <MenuItem  key={"topic-type-individual"} value={"1"}>Cá nhân</MenuItem >
                        <MenuItem  key={"topic-type-group"} value={"2"}>Nhóm</MenuItem >
            </TextField> 
            {type === "2"? <FormControl fullWidth>
                <InputLabel color="secondary" id="multiple-student-checkbox-label">Sinh viên thực hiện *</InputLabel>
                <Select
                    labelId="multiple-student-checkbox-label"
                    id="multiple-student-checkbox"
                    multiple
                    color="secondary"
                    fullWidth
                    value={studentArr}
                    input={<OutlinedInput label="Sinh viên thực hiện *" />}
                    onChange={onStudentChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    MenuProps={MenuProps}
                    >
                    {Object.keys(students).map((name) => (
                        <MenuItem  key={"individual_"+students[name]} value={name}>
                        <Checkbox checked={studentArr.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                        </MenuItem >
                    ))}
                    </Select>
            </FormControl> :
            <TextField fullWidth color="secondary" select={Object.keys(students).length > 0} required value={student} onChange={(e) => {setStudent(e.target.value)}} label="Sinh viên thực hiện">
                    {Object.keys(students).length > 0 ? Object.keys(students).map((name) => (
                        <MenuItem  key={"individual_"+students[name]} value={students[name]}>
                        {name}
                        </MenuItem >
                    )): <></>}
            </TextField>}
          </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" variant="outlined" color="secondary" onClick={onClose}>Huỷ</Button>
          <Button size="large" variant="outlined" onClick={onSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
    )
}

export default EditTopic;