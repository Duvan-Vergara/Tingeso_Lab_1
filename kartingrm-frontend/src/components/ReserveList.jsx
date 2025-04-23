import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import reserveService from "../services/reserve.service";
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
import { format } from "date-fns";

const ReserveList = () => {
    const [reserves, setReserves] = useState([]);
    const navigate = useNavigate();

    const formatDate = (isoDate) => {
        return format(new Date(isoDate), "dd-MM-yyyy");
    };

    const init = () => {
        reserveService
            .listReserves()
            .then((response) => {
                console.log("Reservas cargadas:", response.data);
                setReserves(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar las reservas:", error);
            });
    };

    useEffect(() => {
        init();
    }, []);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "¿Está seguro de que desea eliminar esta reserva?"
        );
        if (confirmDelete) {
            reserveService
                .deleteReserveById(id)
                .then(() => {
                    console.log("Reserva eliminada con éxito.");
                    init(); // Recargar la lista de reservas
                })
                .catch((error) => {
                    console.error("Error al eliminar la reserva:", error);
                });
        }
    };

    const handleSendPaymentReceipt = (id) => {
        reserveService
            .sendPaymentReceipt(id)
            .then(() => {
                alert("Comprobante de pago enviado con éxito.");
            })
            .catch((error) => {
                console.error("Error al enviar el comprobante de pago:", error);
                alert("Error al enviar el comprobante de pago.");
            });
    };


    return (
        <TableContainer component={Paper}>
            <br />
            <Link
                to="/reserve/add"
                style={{ textDecoration: "none", marginBottom: "1rem" }}
            >
                <Button variant="contained" color="primary">
                    Añadir Reserva
                </Button>
            </Link>
            <br /> <br />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Código
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Cliente
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Fecha
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Número de Personas
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            Operaciones
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reserves.map((reserve) => (

                        <TableRow
                            key={reserve.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}

                        >
                            <TableCell align="left">{reserve.id}</TableCell>
                            <TableCell align="left">
                                {reserve.group.length > 0 ? reserve.group[0].name : "Sin cliente"}
                            </TableCell>
                            <TableCell align="left">{formatDate(reserve.date)}</TableCell>
                            <TableCell align="left">{reserve.group.length}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => navigate(`/reserve/edit/${reserve.id}`)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(reserve.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                    startIcon={<DeleteIcon />}
                                >
                                    Eliminar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleSendPaymentReceipt(reserve.id)}
                                    style={{ marginLeft: "0.5rem" }}
                                >
                                    Enviar Comprobante
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReserveList;