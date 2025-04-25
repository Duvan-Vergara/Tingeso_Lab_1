import { useEffect, useState } from "react";
import tariffService from "../services/tariff.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const TariffList = () => {
  const [tariffs, setTariffs] = useState([]);
  const navigate = useNavigate();

  // Cargar tarifas desde el backend
  const loadTariffs = () => {
    tariffService
      .listTariffs()
      .then((response) => {
        setTariffs(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las tarifas:", error);
      });
  };

  useEffect(() => {
    loadTariffs();
  }, []);

  // Manejar eliminación de tarifas
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar esta tarifa?"
    );
    if (confirmDelete) {
      tariffService
        .deleteTariffById(id)
        .then(() => {
          console.log("Tarifa eliminada con éxito.");
          loadTariffs(); // Recargar la lista de tarifas
        })
        .catch((error) => {
          console.error("Error al eliminar la tarifa:", error);
        });
    }
  };

  // Navegar a la página de edición
  const handleEdit = (id) => {
    navigate(`/tariff/edit/${id}`);
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "rgba(30, 30, 47, 0.9)" }}>
      <h3 style={{ color: "var(--accent-color)", textAlign: "center" }}>Lista de Tarifas</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/tariff/add")}
        style={{ margin: "1rem" }}
      >
        Añadir Tarifa
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Vueltas
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Máx. Minutos
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Precio Regular
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Precio Fin de Semana
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Precio Feriado
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "var(--text-color)" }}>
              Operaciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tariffs.map((tariff) => (
            <TableRow key={tariff.id}>
              <TableCell align="left" sx={{ color: "var(--text-color)" }}>
                {tariff.laps}
              </TableCell>
              <TableCell align="left" sx={{ color: "var(--text-color)" }}>
                {tariff.maxMinutes}
              </TableCell>
              <TableCell align="left" sx={{ color: "var(--text-color)" }}>
                ${tariff.regularPrice.toLocaleString("es-CL")}
              </TableCell>
              <TableCell align="left" sx={{ color: "var(--text-color)" }}>
                ${tariff.weekendPrice.toLocaleString("es-CL")}
              </TableCell>
              <TableCell align="left" sx={{ color: "var(--text-color)" }}>
                ${tariff.holidayPrice.toLocaleString("es-CL")}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleEdit(tariff.id)}
                  startIcon={<EditIcon />}
                  sx={{ marginRight: "0.5rem" }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(tariff.id)}
                  startIcon={<DeleteIcon />}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TariffList;

/*
@Entity
@Table(name = "tariffs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TariffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false, name = "laps")
    private int laps;

    @Column(nullable = false, name = "max_minutes")
    private int maxMinutes;

    @Column(nullable = false, name = "regular_price")
    private double regularPrice;

    @Column(nullable = false, name = "total_duration")
    private int totalDuration;

    @Column(nullable = false, name = "weekend_discount_percentage")
    private double weekendDiscountPercentage;

    @Column(nullable = false, name = "holiday_increase_percentage")
    private double holidayIncreasePercentage;

    @Column(nullable = false, name = "weekend_price")
    private double weekendPrice;

    @Column(nullable = false, name = "holiday_price")
    private double holidayPrice;
}
*/