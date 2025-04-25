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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const SpecialDayList = () => {
  const [specialDays, setSpecialDays] = useState([]);
  const navigate = useNavigate();


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

  useEffect(() => {
    loadSpecialDays();
  }, []);

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

  // Navegar a la página de edición
  const handleEdit = (id) => {
    navigate(`/specialdays/edit/${id}`);
  };

  // Navegar a la página de agregar
  const handleAdd = () => {
    navigate("/specialdays/add");
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "rgba(30, 30, 47, 0.9)" }}>
      <h3 style={{ color: "var(--accent-color)", textAlign: "center" }}>
        Dias Especiales
      </h3>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAdd} 
        sx={{ margin: "1rem" }}
        > 
        Agregar Dia Especial
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Fecha
            </TableCell>
            <TableCell sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Descripción
            </TableCell>
            <TableCell  align="center" sx={{ color: "var(--text-color)", fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specialDays.map((day) => (
            <TableRow key={day.id}>
              <TableCell sx={{ color: "var(--text-color)" }}>{day.date}</TableCell>
              <TableCell sx={{ color: "var(--text-color)" }}>{day.description}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-color)",
                    "&:hover": {backgroundColor: "var(--hover-color)"},
                  }}
                  size="small"
                  onClick={() => handleEdit(day.id)}
                  startIcon={<EditIcon />}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--secondary-color)",
                    color: "var(--text-color)",
                    "&:hover": { backgroundColor: "var(--hover-color)"},
                  }}
                  size="small"
                  onClick={() => deleteSpecialDay(day.id)}
                  style={{ marginLeft: "0.5rem" }}
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

export default SpecialDayList;

/*
@Entity
@Table(name = "special_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialDayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false, name = "date")
    private LocalDate date;

    @Column(nullable = false, name = "description")
    private String description;

}

*/