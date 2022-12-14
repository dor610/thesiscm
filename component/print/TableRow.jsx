import { Unstable_Grid2 as Grid, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useEffect } from "react";
import { useState } from "react";
import { miliSecToDateOnly, sendAuthGetRequest } from "../../common/utils";

const TableRow = ({studentCode, no,semester}) => {

    const [student, setStudent] = useState(null);
    const [numberPoint, setNumberPoint] = useState("");
    const [letterPoint, setLetterPoint] = useState("");
    const [studentName, setStudentname] = useState([]);
    const [otherName, setOtherName] = useState("");

    useEffect(() =>{
        if(studentCode && semester) {
            getStudent();
            getStudentMark();
        }
    }, [studentCode,, semester])

    const getStudent = async () => {
        let res = await sendAuthGetRequest("/api/student/code?code="+studentCode);
        if(res.status == 200) {
            setStudent(res.data);
            let sName = res.data.name.split(" ")
            setStudentname(sName);
            let other = [...sName];
            other.pop();
            setOtherName(other.join(" "));
        }else{

        }
    }

    const getStudentMark = async () => {
        console.log(semester);
        let res = await sendAuthGetRequest("/api/report/mark?student="+studentCode+"&semester=" +semester.id);
        if(res.status == 200) {
            setNumberPoint(res.data.number);
            setLetterPoint(res.data.letter);
        }
    }

    return (
        <>
        {student? <Grid container sx={{width: `100%`, borderTop: `1px solid black`}}>
                    <Grid xs={0.7}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{no}</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={1.3}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{studentCode}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={5.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="row">
                        <Grid container sx={{width: `100%`, px: `10px`}}>
                            <Grid xs={9}>
                                <Typography sx={{textAlign: "left"}}>{otherName}</Typography>
                            </Grid>
                            <Grid xs={3}>
                                <Typography >{studentName.length > 0? studentName[studentName.length - 1]: ""}</Typography>
                            </Grid>
                        </Grid>
                        </Stack>
                        </Grid>
                    <Grid xs={1.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{miliSecToDateOnly(student.dateOfBirth)}</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={1.5}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{student.classCode}</Typography>
                        </Stack>
                        </Grid>
                    <Grid xs={0.7}><Stack sx={{width: `100%`, height: `100%`, borderRight: `1px solid black`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{numberPoint}</Typography>
                        </Stack>
                    </Grid>
                    <Grid xs={0.8}><Stack sx={{width: `100%`, height: `100%`}} direction="column" alignItems={"center"} justifyContent="center">
                        <Typography sx={{textAlign: "center"}}>{letterPoint}</Typography>
                        </Stack>
                    </Grid>
                </Grid>: <></>}
        </>
    )
}

export default TableRow;