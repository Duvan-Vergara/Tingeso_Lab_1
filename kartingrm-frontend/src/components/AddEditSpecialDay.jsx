import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import specialDayService from "../services/specialday.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const AddEditSpecialDay = () => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      specialDayService
        .getSpecialDayById(id)
        .then((response) => {
          const specialDay = response.data;
          setDate(specialDay.date);
          setDescription(specialDay.description);
        })
        .catch((error) => {
          console.error("Error al cargar el día especial:", error);
        });
    }
  }, [id]);

  const saveSpecialDay = (e) => {
    e.preventDefault();
    const specialDay = { date, description };

    if (id) {
      specialDayService
        .createSpecialDay({ ...specialDay, id })
        .then(() => {
          navigate("/specialdays/list");
        })
        .catch((error) => {
          console.error("Error al actualizar el día especial:", error);
        });
    } else {
      specialDayService
        .createSpecialDay(specialDay)
        .then(() => {
          navigate("/specialdays/list");
        })
        .catch((error) => {
          console.error("Error al crear el día especial:", error);
        });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      sx={{
        backgroundColor: "rgba(30, 30, 47, 0.9)",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <h3 style={{ color: "var(--accent-color)" }}>
        {id ? "Editar Día Especial" : "Nuevo Día Especial"}
      </h3>
      <form>
        <TextField
          label="Fecha"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={saveSpecialDay}
          startIcon={<SaveIcon />}
          style={{ marginTop: "1rem" }}
        >
          Guardar
        </Button>
      </form>
    </Box>
  );
};

export default AddEditSpecialDay;