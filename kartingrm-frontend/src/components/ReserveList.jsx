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

const ReserveList = () => {
  const [reserves, setReserves] = useState([]);
  const navigate = useNavigate();

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
              <TableCell align="left">{reserve.code}</TableCell>
              <TableCell align="left">{reserve.clientName}</TableCell>
              <TableCell align="left">{reserve.date}</TableCell>
              <TableCell align="left">{reserve.numberOfPeople}</TableCell>
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

/*
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
            reserve.setFinish(Date.from(reserve.getBegin().toInstant().plusSeconds(calculatedTariff.getMaxMinutes() * 60)));
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
                        .filter(r -> r.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(d))
                        .map(r -> {
                            UserEntity user = r.getGroup().iterator().next(); // Obtener el primer usuario
                            String startTime = r.getBegin().toInstant().atZone(ZoneId.systemDefault()).toLocalTime().format(timeFormatter);
                            String endTime = r.getFinish().toInstant().atZone(ZoneId.systemDefault()).toLocalTime().format(timeFormatter);
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
        LocalDate reserveDate = reserve.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (complementReserve.isSpecialDay(reserveDate)) {
            return reserve.getTariff().getHolidayPrice();
        } else if (complementReserve.isWeekend(reserveDate)) {
            return reserve.getTariff().getWeekendPrice();
        } else {
            return reserve.getTariff().getRegularPrice();
        }
    }

    public TariffEntity calculateTariffForReserve(Date startTime, Date endTime, List<TariffEntity> availableTariffs) {
        // Validar que las tarifas disponibles no estén vacías
        if (availableTariffs == null || availableTariffs.isEmpty()) {
            throw new IllegalArgumentException("No hay tarifas disponibles para calcular.");
        }

        // Calcular la duración en minutos
        long durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

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
        double basePrice = getTariffForDate(reserve);

        for (UserEntity user : reserve.getGroup()) {
            List<ReserveEntity> userReserves = reserveRepository.getReservesByDateMonthAndRut(user.getRut(), month);

            double bestDiscount = complementReserve.calculateBestDiscount(reserve, userReserves);

            // Descuento por cumpleaños
            if (complementReserve.isBirthday(user, reserve.getDate()) && birthdayLimit > 0) {
                bestDiscount = Math.max(bestDiscount, 0.50);
                birthdayLimit--;
            }

            // Aplicar el descuento al precio base por usuario
            totalPrice += basePrice * (1 - bestDiscount);
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
        String formattedDateTime = reserve.getDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()
                .format(formatter);
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
            List<ReserveEntity> userReserves = reserveRepository.getReservesByDateMonthAndRut(user.getRut(), reserve.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue());
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

        // Crear un archivo temporal para guardar el Excel
        java.nio.file.Path tempFile = java.nio.file.Files.createTempFile("Comprobante_de_Pago", ".xlsx");
        try (FileOutputStream fos = new FileOutputStream(tempFile.toFile())) {
            workbook.write(fos);
        }
        workbook.close();

        System.out.println("Archivo Excel guardado temporalmente en: " + tempFile.toAbsolutePath());

        // Escribir el archivo Excel a un ByteArrayOutputStream para retornarlo
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (FileInputStream fis = new FileInputStream(tempFile.toFile())) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
        }
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
                    // Convertir java.sql.Date a LocalDate directamente
                    LocalDate reserveDate = ((java.sql.Date) r.getDate()).toLocalDate();
                    YearMonth reserveMonth = YearMonth.from(reserveDate);
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
                    LocalDate reserveDate = ((java.sql.Date) r.getDate()).toLocalDate();
                    YearMonth reserveMonth = YearMonth.from(reserveDate);
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

y el complemento de reserve que es en otro archivo "ComplementReserve"

public class ComplementReserve {

    @Autowired
    private SpecialDayRepository specialDayRepository;

    public int calculateBirthdayLimit(int numberOfPeople) {
        if (numberOfPeople >= 3 && numberOfPeople <= 5) {
            return 1;
        } else if (numberOfPeople >= 6 && numberOfPeople <= 10) {
            return 2;
        }
        return 0;
    }

    public double calculateGroupSizeDiscount(int numberOfPeople) {
        if (numberOfPeople >= 3 && numberOfPeople <= 5) {
            return 0.10;
        } else if (numberOfPeople >= 6 && numberOfPeople <= 10) {
            return 0.20;
        } else if (numberOfPeople >= 11 && numberOfPeople <= 15) {
            return 0.30;
        }
        return 0;
    }

    public double calculateFrequentCustomerDiscount(List<ReserveEntity> userReserves) {
        int visitsCount = userReserves.size();
        if (visitsCount >= 7) {
            return 0.30;
        } else if (visitsCount >= 5) {
            return 0.20;
        } else if (visitsCount >= 2) {
            return 0.10;
        }
        return 0;
    }

    public double calculateBestDiscount(ReserveEntity reserve, List<ReserveEntity> userReserves) {
        double bestDiscount = 0;
        int numberOfPeople = reserve.getGroup().size();
        // Descuento por número de personas
        bestDiscount = Math.max(bestDiscount, calculateGroupSizeDiscount(numberOfPeople));
        // Descuento para clientes frecuentes
        bestDiscount = Math.max(bestDiscount, calculateFrequentCustomerDiscount(userReserves));
        return bestDiscount;
    }

    public boolean isSpecialDay(LocalDate date) {
        return specialDayRepository.findAll().stream()
                .anyMatch(specialDay -> specialDay.getDate().equals(date));
    }

    public boolean isWeekend(LocalDate date) {
        return date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7;
    }

    public boolean isBirthday(UserEntity user, Date date) {
        if(user.getBirthDate() == null || user.getBirthDate().getMonth() != date.getMonth()) {
            return false;
        }
        return date.getDay() == user.getBirthDate().getDay();
    }
    --------------------------------------------------------------------------------------------------

    ReserveController:
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

    @PostMapping("/calculate-price")
    public ResponseEntity<Double> calculatePrice(@RequestBody ReserveEntity reserve) {
        double finalPrice = reserveService.calculateFinalPrice(reserve, LocalDate.now().getMonthValue());
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
*/