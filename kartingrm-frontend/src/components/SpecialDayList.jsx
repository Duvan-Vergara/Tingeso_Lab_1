import { useEffect, useState } from "react";
import specialDayService from "../services/specialday.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SpecialDayList = () => {
  const [specialDays, setSpecialDays] = useState([]);
  const [newDate, setNewDate] = useState("");

  const loadSpecialDays = () => {
    specialDayService
      .getAllSpecialDays()
      .then((response) => {
        setSpecialDays(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar días especiales:", error);
      });
  };

  const addSpecialDay = () => {
    specialDayService
      .createSpecialDay({ date: newDate })
      .then(() => {
        loadSpecialDays();
        setNewDate("");
      })
      .catch((error) => {
        console.error("Error al agregar día especial:", error);
      });
  };

  const deleteSpecialDay = (id) => {
    specialDayService
      .deleteSpecialDayById(id)
      .then(() => {
        loadSpecialDays();
      })
      .catch((error) => {
        console.error("Error al eliminar día especial:", error);
      });
  };

  useEffect(() => {
    loadSpecialDays();
  }, []);

  return (
    <TableContainer component={Paper}>
      <h3>Días Especiales</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialDays.map((day) => (
            <TableRow key={day.id}>
              <TableCell>{day.date}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSpecialDay(day.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TextField
        label="Nueva Fecha"
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginTop: "1rem" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addSpecialDay}
        style={{ marginTop: "1rem" }}
      >
        Agregar Día Especial
      </Button>
    </TableContainer>
  );
};

export default SpecialDayList;