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
import Autocomplete from "@mui/material/Autocomplete";
import userService from "../services/user.service";

const AddEditReserve = () => {
  const [code, setCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [tariffId, setTariffId] = useState("");
  const [tariffs, setTariffs] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [beginTime, setBeginTime] = useState("");
  const [finish, setFinishTime] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const loadUsers = () => {
    userService
      .getAll()
      .then((response) => {
        setUsers(response.data);
        console.log("Usuarios cargados:", response.data);
      })
      .catch((error) => {
        console.error("Error al cargar usuarios:", error);
      });
  };

  // Cargar tarifas disponibles
  const loadTariffs = () => {
    tariffService
      .listTariffs()
      .then((response) => {
        setTariffs(response.data);
        console.log("Tarifas cargadas:", response.data);
      })
      .catch((error) => {
        console.error("Error al cargar tarifas:", error);
      });
  };

  // Cargar datos de la reserva si se está editando
  useEffect(() => {
    loadTariffs();
    loadUsers();
    console.log("Datos Cargados");
    if (id) {
      reserveService
        .getReserveById(id)
        .then((response) => {
          const reserve = response.data;
          console.log("Reserva cargada:", reserve);
          console.log("Precio final cargado:", reserve.finalPrice);
          setCode(reserve.code || "");
          setClientName(reserve.group?.[0]?.name || ""); // Asumir que el primer usuario es el creador
          setDate(reserve.date);
          setTariffId(reserve.tariff?.id || "");
          setFinalPrice(reserve.finalPrice || 0);
          setSelectedUsers(reserve.group || []); // Cargar usuarios del grupo
          setBeginTime(reserve.begin || ""); // Extraer hora de inicio
          setFinishTime(reserve.finish || ""); // Extraer hora de finalización
        })
        .catch((error) => {
          console.error("Error al cargar la reserva:", error);
        });
    }
  }, [id]);

  // Guardar o actualizar la reserva
  const saveReserve = (e) => {
    e.preventDefault();

    if (!code || !clientName || !date || !tariffId || !beginTime || !finish) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const reserve = {
      id,
      code,
      clientName,
      date,
      tariff: { id: tariffId },
      begin: `${date}T${beginTime}`,
      finish: `${date}T${finish}`,
      group: selectedUsers.map((user) => ({ id: user.id })),
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
    console.log("Datos recibidos:");
    console.log("Fecha:", date);
    console.log("Hora de inicio:", beginTime);
    console.log("Hora de finalización:", finish);
    console.log("ID de tarifa:", tariffId);
    console.log("Usuarios seleccionados:", selectedUsers);
  
    // Si no hay tarifa o usuarios seleccionados, no se puede calcular el precio
    if (!tariffId || selectedUsers.length === 0) {
      setFinalPrice(0);
      return;
    }
  
    // Construir el objeto de reserva con los datos disponibles
    const reserve = {
      date: date || null, // Permitir que falte la fecha
      begin: date && beginTime ? `${date}T${beginTime}` : null, // Validar hora de inicio
      finish: date && finish ? `${date}T${finish}` : null, // Validar hora de finalización
      tariff: { id: tariffId },
      group: selectedUsers.map((user) => ({ id: user.id })),
    };
  
    console.log("Datos enviados para calcular el precio:", reserve);
  
    reserveService
      .calculateFinalPrice(reserve)
      .then((response) => {
        console.log("Precio final calculado:", response.data);
        setFinalPrice(response.data);
      })
      .catch((error) => {
        console.error("Error al calcular el precio final:", error);
        setFinalPrice(0); // Si hay un error, establecer el precio a 0
      });
  };

  useEffect(() => {
    console.log("Recalculando precio...");
    recalculatePrice();
  }, [date, beginTime, finish, tariffId, selectedUsers]);

  useEffect(() => {
    if (clientName) {
      const matchingUser = users.find((user) => user.name === clientName);
      if (matchingUser) {
        setSelectedUsers((prevSelectedUsers) => {
          const filteredUsers = prevSelectedUsers.filter((user) => user.id !== matchingUser.id);
          return [matchingUser, ...filteredUsers];
        });
      }
    }
  }, [clientName, users]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      sx={{
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <h3>{id ? "Editar Reserva" : "Nueva Reserva"}</h3>
      <hr />
      <form>
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
            onChange={(e) => {setDate(e.target.value)
              console.log("Fecha Selecionada:", e.target.value);}}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="beginTime"
            label="Hora de Inicio"
            type="time"
            value={beginTime}
            variant="standard"
            onChange={(e) => setBeginTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="finish"
            label="Hora de Finalización"
            type="time"
            value={finish}
            variant="standard"
            onChange={(e) => setFinishTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(user) => `${user.rut} - ${user.name}`}
            filterOptions={(options, { inputValue }) =>
              options.filter(
                (user) =>
                  user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                  user.rut.includes(inputValue)
              )
            }
            value={selectedUsers}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar Usuarios" variant="standard" />
            )}
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


/*
Respuesta:
Birthday Limit: 2
Birthday Limit: 2
Tariff: TariffEntity(id=3, laps=0, maxMinutes=0, regularPrice=0.0, totalDuration=0, weekendDiscountPercentage=0.0, holidayIncreasePercentage=0.0, weekendPrice=0.0, holidayPrice=0.0)
Fecha de reserva: 2025-04-01
Tariff: TariffEntity(id=3, laps=0, maxMinutes=0, regularPrice=0.0, totalDuration=0, weekendDiscountPercentage=0.0, holidayIncreasePercentage=0.0, weekendPrice=0.0, holidayPrice=0.0)
Fecha de reserva: 2025-04-01
Base Price: 0.0
Base Price: 0.0
Best Discount: 0.2
Best Discount: 0.2
Total Price for null: 0.0
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Best Discount: 0.2
Total Price for null: 0.0
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Final Price: 0.0
Best Discount: 0.2
Total Price for null: 0.0
Final Price: 0.0

--------------------------------------------------------------------------------------------------------


Reserve Controller
@RestController
@RequestMapping("/api/v1/reserves")
@Tag(name = "Reservas", description = "Controlador para gestionar reservas")
@CrossOrigin("*")
public class ReserveController {

    @Autowired
    ReserveService reserveService;

    @GetMapping("/")
    public ResponseEntity<List<ReserveEntity>> listReservers() {
        List<ReserveEntity> reserves = reserveService.getReserves();
        return ResponseEntity.ok(reserves);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReserveEntity> getReserveById(@PathVariable Long id) {
        ReserveEntity reserve = reserveService.getReserveById(id);
        return ResponseEntity.ok(reserve);
    }

    @PostMapping("/")
    public ResponseEntity<ReserveEntity> saveReserves(@RequestBody ReserveEntity reserve) {
        ReserveEntity newReserve = reserveService.saveReserve(reserve);
        return ResponseEntity.ok(newReserve);
    }

    @GetMapping("/{rut}/{month}")
    public ResponseEntity<List<ReserveEntity>> listReservesByRutAndMonth(@PathVariable("rut") String rut, @PathVariable("month") int month) {
        List<ReserveEntity> reserves = reserveService.getReservesByDate_MonthANDRut(rut,month);
        return ResponseEntity.ok(reserves);
    }

    @PutMapping("/")
    public ResponseEntity<ReserveEntity> updateExtraHours(@RequestBody ReserveEntity extraHours){
        ReserveEntity extraHoursUpdated = reserveService.updateReserve(extraHours);
        return ResponseEntity.ok(extraHoursUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteExtraHoursById(@PathVariable Long id) throws Exception {
        var isDeleted = reserveService.deleteReserveById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/day/{day}")
    public ResponseEntity<List<ReserveEntity>> listReservesByDay(@PathVariable("day") int day) {
        List<ReserveEntity> reserves = reserveService.getReserveByDay(day);
        return ResponseEntity.ok(reserves);
    }

    @GetMapping("/month/{month}")
    public ResponseEntity<List<ReserveEntity>> listReservesByMonth(@PathVariable("month") int month) {
        List<ReserveEntity> reserves = reserveService.getReserveByMonth(month);
        return ResponseEntity.ok(reserves);
    }

    @GetMapping("/week/{year}/{month}/{week}")
    public ResponseEntity<List<List<String>>> listReservesByWeek(@PathVariable("year") int year, @PathVariable("month") int month, @PathVariable("week") int week) {
        List<List<String>> reserves = reserveService.getReserveByWeek(year, month, week);
        return ResponseEntity.ok(reserves);
    }

    @GetMapping("/{id}/payment-receipt")
    public ResponseEntity<?> sendPaymentReceipt(@PathVariable Long id) {
        try {
            ReserveEntity reserve = reserveService.getReserveById(id);
            reserveService.sendPaymentReceipts(reserve);
            return ResponseEntity.ok().body("Comprobante de pago enviado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el comprobante de pago: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/payment-receipt-v2")
    public ResponseEntity<?> sendPaymentReceiptV2(@PathVariable Long id) {
        try {
            ReserveEntity reserve = reserveService.getReserveById(id);
            reserveService.sendPaymentReceipts_2(reserve);
            return ResponseEntity.ok().body("Comprobante de pago enviado correctamente (versión 2)");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el comprobante de pago (versión 2): " + e.getMessage());
        }
    }

    @PostMapping("/calculate-price")
    public ResponseEntity<Double> calculatePrice(@RequestBody ReserveEntity reserve) {
        double finalPrice = reserveService.calculateFinalPrice(reserve, LocalDate.now().getMonthValue());
        System.out.println("Final Price: " + finalPrice);
        return ResponseEntity.ok(finalPrice);
    }

    @GetMapping("/report/tariff")
    public ResponseEntity<byte[]> generateTariffReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            byte[] report = reserveService.generateTariffReport(startDate, endDate);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=reporte_tarifas.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(report.length)
                    .body(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/report/group-size")
    public ResponseEntity<byte[]> generateGroupSizeReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            byte[] report = reserveService.generateGroupSizeReport(startDate, endDate);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=reporte_tamanio_grupo.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(report.length)
                    .body(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
---------------------------------------------------------------------------------------------------------------------------------
Reserve Entity:

@Entity
@Table(name = "reserves")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReserveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(nullable = false, name = "reserveday", columnDefinition = "DATE")
    private LocalDate date;

    @DateTimeFormat(pattern = "HH:mm")
    @Column(nullable = false, name = "begin")
    private LocalTime begin;

    @DateTimeFormat(pattern = "HH:mm")
    @Column(nullable = false, name = "finish")
    private LocalTime finish;

    @ManyToMany
    @JoinTable(
            name = "reserves_users",
            joinColumns = @JoinColumn(name = "reserve_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserEntity> group;

    @ManyToOne
    @JoinColumn(name = "tariff_id", nullable = false)
    private TariffEntity tariff;

    @Column(nullable = false, name = "final_price")
    private double finalPrice;
}
------------------------------------------------------------------------------------------------------------------------------
Reserve Service:
@Service
public class ReserveService {

    @Autowired
    ReserveRepository reserveRepository;

    @Autowired
    TariffRepository tariffRepository;

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    ComplementReserve complementReserve;


    @Value("${spring.mail.username}")
    private String senderEmail;

    public List<ReserveEntity> getReserves() { return new ArrayList<>(reserveRepository.findAll()); }

    public ReserveEntity saveReserve(ReserveEntity reserve) {
        // Obtener las tarifas disponibles
        List<TariffEntity> availableTariffs = tariffRepository.findAll();

        // Calcular la tarifa si no está especificada
        if (reserve.getTariff() == null) {
            TariffEntity calculatedTariff = calculateTariffForReserve(reserve.getBegin(), reserve.getFinish(), availableTariffs);
            reserve.setTariff(calculatedTariff);
            // Ajustar la hora de finalización según la tarifa calculada
            reserve.setFinish(reserve.getBegin().plusMinutes(calculatedTariff.getMaxMinutes()));
        }
        // Guardar la reserva
        return reserveRepository.save(reserve);
    }

    public ReserveEntity getReserveById(Long id){
        return reserveRepository.findById(id).get();
    }

    public ReserveEntity updateReserve(ReserveEntity reserve) {
        return reserveRepository.save(reserve);
    }

    public List<ReserveEntity> getReserveByDay(int day) { return reserveRepository.getReserveByDate_Day(day); }

    public List<ReserveEntity> getReserveByMonth(int month) { return reserveRepository.getReserveByDate_Month(month); }

    public List<List<String>> getReserveByWeek(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        LocalDate startDate = date.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        LocalDate endDate = startDate.plusDays(6);

        // Obtener reservas entre las fechas
        List<ReserveEntity> reserves = reserveRepository.getReserveByDate_DateBetween(startDate, endDate);

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("H:mm"); // Formato sin ceros a la izquierda

        // Agrupar reservas por día de la semana y formatear la información
        return IntStream.range(0, 7)
                .mapToObj(i -> startDate.plusDays(i))
                .map(d -> reserves.stream()
                        .filter(r -> r.getDate().equals(d))
                        .map(r -> {
                            UserEntity user = r.getGroup().iterator().next(); // Obtener el primer usuario
                            String startTime = r.getBegin().format(timeFormatter);
                            String endTime = r.getFinish().format(timeFormatter);
                            return user.getName() + " (" + startTime + " - " + endTime + ")";
                        })
                        .collect(Collectors.toList()))
                .collect(Collectors.toList());
    }

    public List<ReserveEntity> getReservesByDate_MonthANDRut(String rut, int month) {
        return reserveRepository.getReservesByDateMonthAndRut(rut, month);
    }

    public boolean deleteReserveById(Long id) throws Exception {
        try {
            reserveRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public double getTariffForDate(ReserveEntity reserve) {
        LocalDate reserveDate = reserve.getDate();
        System.out.println("Fecha de reserva: " + reserveDate);
        if (complementReserve.isSpecialDay(reserveDate)) {
            return reserve.getTariff().getHolidayPrice();
        } else if (complementReserve.isWeekend(reserveDate)) {
            return reserve.getTariff().getWeekendPrice();
        } else {
            return reserve.getTariff().getRegularPrice();
        }
    }

    public TariffEntity calculateTariffForReserve(LocalTime startTime, LocalTime endTime, List<TariffEntity> availableTariffs) {
        if (availableTariffs == null || availableTariffs.isEmpty()) {
            throw new IllegalArgumentException("No hay tarifas disponibles para calcular.");
        }

        // Calcular la duración en minutos
        long durationInMinutes = java.time.Duration.between(startTime, endTime).toMinutes();


        // Inicializar las tarifas mínima y máxima
        TariffEntity shortestTariff = null;
        TariffEntity longestTariff = null;

        // Buscar la tarifa adecuada en una sola pasada
        for (TariffEntity tariff : availableTariffs) {
            if (shortestTariff == null || tariff.getTotalDuration() < shortestTariff.getTotalDuration()) {
                shortestTariff = tariff;
            }
            if (longestTariff == null || tariff.getTotalDuration() > longestTariff.getTotalDuration()) {
                longestTariff = tariff;
            }
            if (durationInMinutes <= tariff.getTotalDuration()) {
                return tariff; // Retornar la primera tarifa adecuada
            }
        }
        // Si la duración es mayor que la tarifa más larga, retornar la tarifa máxima
        return longestTariff;
    }

    public double calculateFinalPrice(ReserveEntity reserve, int month) {
        double totalPrice = 0;
        int birthdayLimit = complementReserve.calculateBirthdayLimit(reserve.getGroup().size());
        System.out.println("Birthday Limit: " + birthdayLimit);
        System.out.println("Tariff: " + reserve.getTariff());
        double basePrice = getTariffForDate(reserve);
        System.out.println("Base Price: " + basePrice);

        for (UserEntity user : reserve.getGroup()) {
            List<ReserveEntity> userReserves = reserveRepository.getReservesByDateMonthAndRut(user.getRut(), month);

            double bestDiscount = complementReserve.calculateBestDiscount(reserve, userReserves);
            System.out.println("Best Discount: " + bestDiscount);

            // Descuento por cumpleaños
            if (complementReserve.isBirthday(user, reserve.getDate()) && birthdayLimit > 0) {
                bestDiscount = Math.max(bestDiscount, 0.50);
                birthdayLimit--;
                System.out.println("descuento por cumpleaños aplicado a " + user.getName());
            }

            // Aplicar el descuento al precio base por usuario
            totalPrice += basePrice * (1 - bestDiscount);
            System.out.println("Total Price for " + user.getName() + ": " + totalPrice);
        }
        return totalPrice;
    }

    public byte[] generatePaymentReceipt(ReserveEntity reserve) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Comprobante de Pago");

        // Crear encabezados
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "Código de Reserva", "Fecha y Hora de Reserva", "Número de Vueltas/Max Tiempo",
                "Cantidad de Personas", "Nombre de la Persona que Reservó", "", ""
        };
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Llenar información de la reserva
        Row infoRow = sheet.createRow(1);
        infoRow.createCell(0).setCellValue(reserve.getId());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM HH:mm");
        LocalDateTime dateTime = LocalDateTime.of(reserve.getDate(), reserve.getBegin());
        String formattedDateTime = dateTime.format(formatter);
        infoRow.createCell(1).setCellValue(formattedDateTime);
        infoRow.createCell(2).setCellValue(reserve.getTariff().getLaps() + " vueltas / " + reserve.getTariff().getMaxMinutes() + " minutos");
        infoRow.createCell(3).setCellValue(reserve.getGroup().size());
        infoRow.createCell(4).setCellValue(reserve.getGroup().iterator().next().getName());
        for (int i = 5; i < 7; i++) {
            infoRow.createCell(i); // Crear celdas vacías
        }

        // Crear encabezados para el detalle de pago
        Row paymentHeaderRow = sheet.createRow(3);
        String[] paymentHeaders = {
                "Nombre de Cliente", "Tarifa Base", "Descuento (%)",
                "Descuento especial (%)", "Monto Final", "IVA", "Monto Total"
        };
        for (int i = 0; i < paymentHeaders.length; i++) {
            paymentHeaderRow.createCell(i).setCellValue(paymentHeaders[i]);
        }

        // Llenar detalle de pago
        int rowNum = 4;
        double totalAmount = 0;
        double iva = 0;
        for (UserEntity user : reserve.getGroup()) {
            Row row = sheet.createRow(rowNum++);
            double basePrice = reserve.getTariff().getRegularPrice();
            double groupDiscount = complementReserve.calculateGroupSizeDiscount(reserve.getGroup().size());
            List<ReserveEntity> userReserves = reserveRepository.getReservesByDateMonthAndRut(user.getRut(), reserve.getDate().getMonthValue());
            double frequentDiscount = complementReserve.calculateFrequentCustomerDiscount(userReserves);
            double bestDiscount = Math.max(groupDiscount, frequentDiscount);
            double finalAmount = basePrice * (1 - bestDiscount);
            double ivaAmount = finalAmount * 0.19;
            double totalWithIva = finalAmount + ivaAmount;

            row.createCell(0).setCellValue(user.getName());
            row.createCell(1).setCellValue(basePrice);
            row.createCell(2).setCellValue(groupDiscount * 100);
            row.createCell(3).setCellValue(frequentDiscount * 100);
            row.createCell(4).setCellValue(finalAmount);
            row.createCell(5).setCellValue(ivaAmount);
            row.createCell(6).setCellValue(totalWithIva);

            totalAmount += finalAmount;
            iva += ivaAmount;
        }

        // Agregar fila para el precio total de la reserva
        Row totalReserveRow = sheet.createRow(rowNum);
        for (int i = 0; i < 4; i++) {
            totalReserveRow.createCell(i); // Crear celdas vacías
        }
        totalReserveRow.createCell(4).setCellValue("Totales:");
        totalReserveRow.createCell(5).setCellValue(iva);
        totalReserveRow.createCell(6).setCellValue(totalAmount + iva);


        // Escribir el archivo Excel a un ByteArrayOutputStream para retornarlo
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();

        return bos.toByteArray();
    }

    public byte[] convertExcelToPdf(byte[] excelData) throws IOException, DocumentException {
        ByteArrayInputStream bis = new ByteArrayInputStream(excelData);
        Workbook workbook = WorkbookFactory.create(bis);

        Document document = new Document();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, bos);
        document.open();

        Sheet sheet = workbook.getSheetAt(0);

        // Crear una tabla en el PDF con el número de columnas del Excel
        int numberOfColumns = sheet.getRow(0).getLastCellNum();
        com.itextpdf.text.pdf.PdfPTable table = new com.itextpdf.text.pdf.PdfPTable(numberOfColumns);
        table.setWidthPercentage(100); // Ajustar al ancho de la página

        // Establecer anchos relativos para las columnas
        float[] columnWidths = new float[numberOfColumns];
        Arrays.fill(columnWidths, 1f); // Asignar ancho uniforme a todas las columnas
        table.setWidths(columnWidths);

        // Agregar encabezados de la tabla
        Row headerRow = sheet.getRow(0);
        for (Cell cell : headerRow) {
            table.addCell(new com.itextpdf.text.Phrase(cell.toString()));
        }

        // Agregar datos de las filas
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row != null) {
                // Determinar el número de columnas dinámicamente para cada fila
                int dynamicNumberOfColumns = row.getLastCellNum();
                for (int j = 0; j < dynamicNumberOfColumns; j++) {
                    Cell cell = row.getCell(j, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    // Formatear valores numéricos para mayor claridad
                    if (cell.getCellType() == CellType.NUMERIC) {
                        table.addCell(new com.itextpdf.text.Phrase(String.format("%.2f", cell.getNumericCellValue())));
                    } else {
                        table.addCell(new com.itextpdf.text.Phrase(cell.toString()));
                    }
                }
            }
        }
        // Agregar la tabla al documento PDF
        document.add(table);
        document.close();
        workbook.close();
        return bos.toByteArray();
    }

    public void sendEmailWithAttachment(String to, String subject, String text, byte[] attachmentData, String attachmentName) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            message.setSubject(subject);
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setText(text);
            helper.addAttachment(attachmentName, new ByteArrayDataSource(attachmentData, "application/pdf"));
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendPaymentReceipts(ReserveEntity reserve) throws IOException, DocumentException {
        byte[] excelData = generatePaymentReceipt(reserve);
        byte[] pdfData = convertExcelToPdf(excelData);

        for (UserEntity user : reserve.getGroup()) {
            sendEmailWithAttachment(
                    user.getEmail(),
                    "Comprobante de Pago",
                    "Adjunto encontrará el comprobante de pago de su reserva.",
                    pdfData,
                    "Comprobante_de_Pago.pdf"
            );
        }
    }

    public void sendPaymentReceipts_2(ReserveEntity reserve) throws IOException, DocumentException {
        byte[] excelData = generatePaymentReceipt(reserve);
        byte[] pdfData = convertExcelToPdf(excelData);

        // Crear un pool de hilos para enviar correos en paralelo
        ExecutorService executorService = Executors.newFixedThreadPool(5); // Ajusta el tamaño del pool según tus necesidades

        for (UserEntity user : reserve.getGroup()) {
            executorService.submit(() -> {
                try {
                    sendEmailWithAttachment(
                            user.getEmail(),
                            "Comprobante de Pago",
                            "Adjunto encontrará el comprobante de pago de su reserva.",
                            pdfData,
                            "Comprobante_de_Pago.pdf"
                    );
                } catch (Exception e) {
                    e.printStackTrace(); // Manejar errores de envío
                }
            });
        }

        // Cerrar el pool de hilos
        executorService.shutdown();
    }

    public JavaMailSender createJavaMailSender() {
        return javaMailSender;
    }

    private List<YearMonth> getMonthsBetween(LocalDate startDate, LocalDate endDate) {
        List<YearMonth> months = new ArrayList<>();
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);

        while (!start.isAfter(end)) {
            months.add(start);
            start = start.plusMonths(1);
        }
        return months;
    }

    private String formatMonth(YearMonth month) {
        return month.format(DateTimeFormatter.ofPattern("MMMM", new Locale("es", "ES"))).toUpperCase();
    }

    private double calculateIncome(List<ReserveEntity> reserves, TariffEntity tariff, YearMonth month) {
        return reserves.stream()
                .filter(r -> {
                    YearMonth reserveMonth = YearMonth.from(r.getDate());
                    return reserveMonth.equals(month) &&
                            tariff.getId().equals(r.getTariff().getId());
                })
                .mapToDouble(ReserveEntity::getFinalPrice)
                .sum();
    }

    private double calculateGroupSizeIncome(List<ReserveEntity> reserves, int minSize, int maxSize, YearMonth month) {
        return reserves.stream()
                .filter(r -> {
                    // Convertir java.sql.Date a LocalDate directamente
                    YearMonth reserveMonth = YearMonth.from(r.getDate());
                    int groupSize = r.getGroup().size();
                    return reserveMonth.equals(month) &&
                            groupSize >= minSize && groupSize <= maxSize;
                })
                .mapToDouble(ReserveEntity::getFinalPrice)
                .sum();
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private CellStyle createMoneyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,##0"));
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }


    public byte[] generateTariffReport(LocalDate startDate, LocalDate endDate) throws IOException {

        // Agregar esta validación al inicio del metodo
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha fin.");
        }

        List<TariffEntity> tariffs = tariffRepository.findAll();
        if (tariffs.isEmpty()) {
            throw new IllegalArgumentException("No existen tarifas registradas");
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte por Tarifas");
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle moneyStyle = createMoneyStyle(workbook);

            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            Cell headerCell = headerRow.createCell(0);
            headerCell.setCellValue("Número de vueltas o tiempo máximo permitido");
            headerCell.setCellStyle(headerStyle);

            // Obtener los meses entre las fechas
            List<YearMonth> months = getMonthsBetween(startDate, endDate);

            // Crear encabezados de meses
            for (int i = 0; i < months.size(); i++) {
                Cell monthCell = headerRow.createCell(i + 1);
                monthCell.setCellValue(formatMonth(months.get(i)));
                monthCell.setCellStyle(headerStyle);
            }

            // Columna de total
            Cell totalHeaderCell = headerRow.createCell(months.size() + 1);
            totalHeaderCell.setCellValue("TOTAL");
            totalHeaderCell.setCellStyle(headerStyle);

            // Obtener todas las reservas entre las fechas
            List<ReserveEntity> allReserves = reserveRepository.getReserveByDate_DateBetween(
                    startDate, endDate.plusDays(1));

            // Procesar datos para cada tarifa
            int rowIndex = 1;
            double[] columnTotals = new double[months.size() + 1]; // +1 para el total general

            for (TariffEntity tariff : tariffs) {
                Row dataRow = sheet.createRow(rowIndex++);
                dataRow.createCell(0).setCellValue(
                        tariff.getLaps() + " vueltas o máx " + tariff.getMaxMinutes() + " min");

                double rowTotal = 0;

                // Calcular ingresos por mes para esta tarifa
                for (int i = 0; i < months.size(); i++) {
                    YearMonth month = months.get(i);
                    double monthlyIncome = calculateIncome(allReserves, tariff, month);

                    Cell valueCell = dataRow.createCell(i + 1);
                    valueCell.setCellValue(monthlyIncome);
                    valueCell.setCellStyle(moneyStyle);

                    rowTotal += monthlyIncome;
                    columnTotals[i] += monthlyIncome;
                }

                // Total por tarifa
                Cell rowTotalCell = dataRow.createCell(months.size() + 1);
                rowTotalCell.setCellValue(rowTotal);
                rowTotalCell.setCellStyle(moneyStyle);
                columnTotals[months.size()] += rowTotal;
            }

            // Fila de totales
            Row totalRow = sheet.createRow(rowIndex);
            Cell totalLabelCell = totalRow.createCell(0);
            totalLabelCell.setCellValue("TOTAL");
            totalLabelCell.setCellStyle(headerStyle);

            for (int i = 0; i <= months.size(); i++) {
                Cell totalCell = totalRow.createCell(i + 1);
                totalCell.setCellValue(columnTotals[i]);
                totalCell.setCellStyle(moneyStyle);
            }

            // Ajustar anchos de columna
            for (int i = 0; i <= months.size() + 1; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return bos.toByteArray();
        }
    }

    public byte[] generateGroupSizeReport(LocalDate startDate, LocalDate endDate) throws IOException {
        // Definir las categorías de tamaño de grupo
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha fin.");
        }

        int[][] groupSizeCategories = {{1, 2}, {3, 5}, {6, 10}, {11, 15}};
        String[] categoryLabels = {"1-2 personas", "3-5 personas", "6-10 personas", "11-15 personas"};

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte por Tamaño de Grupo");
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle moneyStyle = createMoneyStyle(workbook);

            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            Cell headerCell = headerRow.createCell(0);
            headerCell.setCellValue("Número de personas");
            headerCell.setCellStyle(headerStyle);

            // Obtener los meses entre las fechas
            List<YearMonth> months = getMonthsBetween(startDate, endDate);

            // Crear encabezados de meses
            for (int i = 0; i < months.size(); i++) {
                Cell monthCell = headerRow.createCell(i + 1);
                monthCell.setCellValue(formatMonth(months.get(i)));
                monthCell.setCellStyle(headerStyle);
            }

            // Columna de total
            Cell totalHeaderCell = headerRow.createCell(months.size() + 1);
            totalHeaderCell.setCellValue("TOTAL");
            totalHeaderCell.setCellStyle(headerStyle);

            // Obtener todas las reservas entre las fechas
            List<ReserveEntity> allReserves = reserveRepository.getReserveByDate_DateBetween(
                    startDate, endDate.plusDays(1));

            // Procesar datos para cada categoría de tamaño
            int rowIndex = 1;
            double[] columnTotals = new double[months.size() + 1]; // +1 para el total general

            for (int i = 0; i < groupSizeCategories.length; i++) {
                int[] range = groupSizeCategories[i];
                String label = categoryLabels[i];

                Row dataRow = sheet.createRow(rowIndex++);
                dataRow.createCell(0).setCellValue(label);

                double rowTotal = 0;

                // Calcular ingresos por mes para esta categoría de tamaño
                for (int j = 0; j < months.size(); j++) {
                    YearMonth month = months.get(j);
                    double monthlyIncome = calculateGroupSizeIncome(allReserves, range[0], range[1], month);

                    Cell valueCell = dataRow.createCell(j + 1);
                    valueCell.setCellValue(monthlyIncome);
                    valueCell.setCellStyle(moneyStyle);

                    rowTotal += monthlyIncome;
                    columnTotals[j] += monthlyIncome;
                }

                // Total por categoría
                Cell rowTotalCell = dataRow.createCell(months.size() + 1);
                rowTotalCell.setCellValue(rowTotal);
                rowTotalCell.setCellStyle(moneyStyle);
                columnTotals[months.size()] += rowTotal;
            }

            // Fila de totales
            Row totalRow = sheet.createRow(rowIndex);
            Cell totalLabelCell = totalRow.createCell(0);
            totalLabelCell.setCellValue("TOTAL");
            totalLabelCell.setCellStyle(headerStyle);

            for (int i = 0; i <= months.size(); i++) {
                Cell totalCell = totalRow.createCell(i + 1);
                totalCell.setCellValue(columnTotals[i]);
                totalCell.setCellStyle(moneyStyle);
            }

            // Ajustar anchos de columna
            for (int i = 0; i <= months.size() + 1; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return bos.toByteArray();
        }
    }
}
*/