import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import SaveIcon from "@mui/icons-material/Save";

const AddEditUser = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [titleUserForm, setTitleUserForm] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();

    const user = { rut, name, lastName, email, birthDate};
    if (id) {
      //Actualizar Datos Usuario
      userService
        .update(user)
        .then((response) => {
          console.log("Usuario ha sido actualizado.", response.data);
          navigate("/users/list");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar actualizar datos del usuario.",
            error
          );
        });
    } else {
      //Crear nuevo Usuario
      userService
        .create(user)
        .then((response) => {
          console.log("Usuario ha sido añadido.", response.data);
          navigate("/users/list");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar crear nuevo usuario.",
            error
          );
        });
    }
  };

  useEffect(() => {
    if (id) {
      setTitleUserForm("Editar Usuario");
      // Obtener Datos Usuario
      userService
        .get(id)
        .then((user) => {
          setRut(user.data.rut);
          setName(user.data.name);
          setLastName(user.data.lastName);
          setEmail(user.data.email);
          setBirthDate(user.data.birthDate.split("T")[0]); // Formatear fecha
        })
        .catch((error) => {
          console.log("Se ha producido un error.", error);
        });
    } else {
      setTitleEmployeeForm("Nuevo Usuario");
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      sx={{
        backgroundColor: "rgba(30, 30, 47, 0.9)", // Fondo translúcido
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <h3 style={{ color: "var(--accent-color)" }}> {titleUserForm} </h3>
      <hr />
      <form>
        <FormControl fullWidth>
          <TextField
            id="rut"
            label="Rut"
            value={rut}
            variant="standard"
            onChange={(e) => setRut(e.target.value)}
            helperText="Ej. 12.587.698-8"
            InputLabelProps={{ style: { color: "var(--text-color)" } }}
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-color)" },
              "& .MuiInput-underline:before": { borderBottomColor: "var(--border-color)" },
               "& .MuiInput-underline:hover:before": { borderBottomColor: "var(--accent-color)" },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="name"
            label="Name"
            value={name}
            variant="standard"
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: "var(--text-color)" } }}
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-color)" },
              "& .MuiInput-underline:before": { borderBottomColor: "var(--border-color)" },
               "& .MuiInput-underline:hover:before": { borderBottomColor: "var(--accent-color)" },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="lastName"
            label="LastName"
            value={lastName}
            variant="standard"
            onChange={(e) => setLastName(e.target.value)}
            InputLabelProps={{ style: { color: "var(--text-color)" } }}
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-color)" },
              "& .MuiInput-underline:before": { borderBottomColor: "var(--border-color)" },
               "& .MuiInput-underline:hover:before": { borderBottomColor: "var(--accent-color)" },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="email"
            label="Email"
            value={email}
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
            helperText="Ej. example@gmail.com"
            InputLabelProps={{ style: { color: "var(--text-color)" } }}
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-color)" },
              "& .MuiInput-underline:before": { borderBottomColor: "var(--border-color)" },
               "& .MuiInput-underline:hover:before": { borderBottomColor: "var(--accent-color)" },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
            <TextField
              id="birthDate"
              label="BirthDate"
              value={birthDate}
              variant="standard"
              onChange={(e) => {
                const regex = /^\d{2}-\d{2}-\d{4}$/; // Validar formato dd-mm-yyyy
                if (regex.test(e.target.value) || e.target.value === "") {
                  setBirthDate(e.target.value);
                }
              }}
              helperText="Formato: dd-mm-yyyy"
              placeholder="dd-mm-yyyy"
              InputLabelProps={{ style: { color: "var(--text-color)" } }}
              sx={{
                "& .MuiInputBase-root": { color: "var(--text-color)" },
                "& .MuiInput-underline:before": { borderBottomColor: "var(--border-color)" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "var(--accent-color)" },
              }}
            />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="info"
            onClick={(e) => saveUser(e)}
            style={{ marginLeft: "0.5rem" }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </FormControl>
      </form>
      <hr />
      <Link to="/user/list">Back to List</Link>
    </Box>
  );
};

export default AddEditUser;
