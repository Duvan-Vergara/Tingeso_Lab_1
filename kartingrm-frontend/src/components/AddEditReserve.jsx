import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reserveService from "../services/reserve.service";
import tariffService from "../services/tariff.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";

const AddEditReserve = () => {
  const [code, setCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [tariffId, setTariffId] = useState("");
  const [tariffs, setTariffs] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar tarifas disponibles
  const loadTariffs = () => {
    tariffService
      .listTariffs()
      .then((response) => {
        setTariffs(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar tarifas:", error);
      });
  };

  // Cargar datos de la reserva si se está editando
  useEffect(() => {
    loadTariffs();
    if (id) {
      reserveService
        .getReserveById(id)
        .then((response) => {
          const reserve = response.data;
          setCode(reserve.code);
          setClientName(reserve.clientName);
          setDate(reserve.date);
          setNumberOfPeople(reserve.numberOfPeople);
          setTariffId(reserve.tariff.id);
          setFinalPrice(reserve.finalPrice);
        })
        .catch((error) => {
          console.error("Error al cargar la reserva:", error);
        });
    }
  }, [id]);

  // Guardar o actualizar la reserva
  const saveReserve = (e) => {
    e.preventDefault();

    const reserve = {
      id,
      code,
      clientName,
      date,
      numberOfPeople,
      tariff: { id: tariffId },
    };

    if (id) {
      // Actualizar reserva existente
      reserveService
        .updateReserve(reserve)
        .then((response) => {
          console.log("Reserva actualizada:", response.data);
          navigate("/reserve/list");
        })
        .catch((error) => {
          console.error("Error al actualizar la reserva:", error);
        });
    } else {
      // Crear nueva reserva
      reserveService
        .saveReserve(reserve)
        .then((response) => {
          console.log("Reserva creada:", response.data);
          navigate("/reserve/list");
        })
        .catch((error) => {
          console.error("Error al crear la reserva:", error);
        });
    }
  };

  // Recalcular el precio final al cambiar los valores clave
  const recalculatePrice = () => {
    const reserve = {
      date,
      numberOfPeople,
      tariff: { id: tariffId },
    };

    reserveService
      .calculateFinalPrice(reserve)
      .then((response) => {
        setFinalPrice(response.data);
      })
      .catch((error) => {
        console.error("Error al calcular el precio final:", error);
      });
  };

  useEffect(() => {
    if (date && numberOfPeople && tariffId) {
      recalculatePrice();
    }
  }, [date, numberOfPeople, tariffId]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
    >
      <h3>{id ? "Editar Reserva" : "Nueva Reserva"}</h3>
      <hr />
      <form>
        <FormControl fullWidth>
          <TextField
            id="code"
            label="Código"
            value={code}
            variant="standard"
            onChange={(e) => setCode(e.target.value)}
            helperText="Código único de la reserva"
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="clientName"
            label="Nombre del Cliente"
            value={clientName}
            variant="standard"
            onChange={(e) => setClientName(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="date"
            label="Fecha"
            type="date"
            value={date}
            variant="standard"
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="numberOfPeople"
            label="Número de Personas"
            type="number"
            value={numberOfPeople}
            variant="standard"
            onChange={(e) => setNumberOfPeople(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="tariffId"
            label="Tarifa"
            select
            value={tariffId}
            variant="standard"
            onChange={(e) => setTariffId(e.target.value)}
          >
            {tariffs.map((tariff) => (
              <MenuItem key={tariff.id} value={tariff.id}>
                {`${tariff.laps} vueltas / ${tariff.maxMinutes} minutos`}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="finalPrice"
            label="Precio Final"
            value={finalPrice}
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            onClick={(e) => saveReserve(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </FormControl>
      </form>
    </Box>
  );
};

export default AddEditReserve;