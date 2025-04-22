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
  const [description, setDescription] = useState("");

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

  // Agregar un nuevo día especial
  const addSpecialDay = () => {
    if (!newDate || !description) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const specialDay = { date: newDate, description };
    specialDayService
      .createSpecialDay(specialDay)
      .then(() => {
        loadSpecialDays();
        setNewDate("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error al agregar el día especial:", error);
      });
  };

  // Eliminar un día especial
  const deleteSpecialDay = (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar este día especial?"
    );
    if (confirmDelete) {
      specialDayService
        .deleteSpecialDayById(id)
        .then(() => {
          loadSpecialDays();
        })
        .catch((error) => {
          console.error("Error al eliminar el día especial:", error);
        });
    }
  };

  useEffect(() => {
    loadSpecialDays();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "rgba(30, 30, 47, 0.9)" }}>
      <h3 style={{ color: "var(--accent-color)", textAlign: "center" }}>
        Días Especiales
      </h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Fecha
            </TableCell>
            <TableCell sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Descripción
            </TableCell>
            <TableCell sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialDays.map((day) => (
            <TableRow key={day.id}>
              <TableCell sx={{ color: "var(--text-color)" }}>{day.date}</TableCell>
              <TableCell sx={{ color: "var(--text-color)" }}>{day.description}</TableCell>
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
        style={{ marginTop: "1rem", marginRight: "1rem" }}
      />
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginTop: "1rem", marginRight: "1rem" }}
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