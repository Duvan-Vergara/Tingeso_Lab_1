import { useState } from "react";
import reserveService from "../services/reserve.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ReserveReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const downloadTariffReport = () => {
    reserveService
      .generateTariffReport(startDate, endDate)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reporte_tarifas.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error al descargar el reporte de tarifas:", error);
        alert("Error al descargar el reporte de tarifas.");
      });
  };

  const downloadGroupSizeReport = () => {
    reserveService
      .generateGroupSizeReport(startDate, endDate)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reporte_tamanio_grupo.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error al descargar el reporte de tamaño de grupo:", error);
        alert("Error al descargar el reporte de tamaño de grupo.");
      });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <h3>Descargar Reportes</h3>
      <TextField
        label="Fecha de Inicio"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Fecha de Fin"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "1rem" }}
      />
      <Button variant="contained" color="primary" onClick={downloadTariffReport}>
        Descargar Reporte de Tarifas
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={downloadGroupSizeReport}
        style={{ marginTop: "1rem" }}
      >
        Descargar Reporte de Tamaño de Grupo
      </Button>
    </Box>
  );
};

export default ReserveReports;