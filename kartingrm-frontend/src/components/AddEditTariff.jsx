import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import tariffService from "../services/tariff.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const AddEditTariff = () => {
  const [laps, setLaps] = useState("");
  const [maxMinutes, setMaxMinutes] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [holidayPrice, setHolidayPrice] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      tariffService
        .getTariffById(id)
        .then((response) => {
          const tariff = response.data;
          setLaps(tariff.laps);
          setMaxMinutes(tariff.maxMinutes);
          setRegularPrice(tariff.regularPrice);
          setWeekendPrice(tariff.weekendPrice);
          setHolidayPrice(tariff.holidayPrice);
        })
        .catch((error) => {
          console.error("Error al cargar la tarifa:", error);
        });
    }
  }, [id]);

  const saveTariff = (e) => {
    e.preventDefault();
    const tariff = { laps, maxMinutes, regularPrice, weekendPrice, holidayPrice };

    if (id) {
      tariffService
        .saveTariff({ ...tariff, id })
        .then(() => {
          navigate("/tariff/list");
        })
        .catch((error) => {
          console.error("Error al actualizar la tarifa:", error);
        });
    } else {
      tariffService
        .saveTariff(tariff)
        .then(() => {
          navigate("/tariff/list");
        })
        .catch((error) => {
          console.error("Error al crear la tarifa:", error);
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
      <h3 style={{ color: "var(--accent-color)" }}>{id ? "Editar Tarifa" : "Nueva Tarifa"}</h3>
      <form>
        <TextField
          label="Vueltas"
          value={laps}
          onChange={(e) => setLaps(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Máx. Minutos"
          value={maxMinutes}
          onChange={(e) => setMaxMinutes(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio Regular"
          value={regularPrice}
          onChange={(e) => setRegularPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio Fin de Semana"
          value={weekendPrice}
          onChange={(e) => setWeekendPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio Feriado"
          value={holidayPrice}
          onChange={(e) => setHolidayPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={saveTariff}
          startIcon={<SaveIcon />}
          style={{ marginTop: "1rem" }}
        >
          Guardar
        </Button>
      </form>
    </Box>
  );
};

export default AddEditTariff;