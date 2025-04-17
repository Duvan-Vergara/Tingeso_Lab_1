package edu.mtisw.kartingrm.services;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.entities.TariffEntity;
import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.repositories.ReserveRepository;
import edu.mtisw.kartingrm.repositories.TariffRepository;
import edu.mtisw.kartingrm.utils.ComplementReserve;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import com.itextpdf.text.Document;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

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
        // Ordenar las tarifas por duración máxima
        availableTariffs.sort(Comparator.comparingInt(TariffEntity::getTotalDuration));

        // Calcular la duración en minutos
        long durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        // Si la duración es menor que la tarifa más corta, asignar la tarifa mínima
        if (durationInMinutes <= availableTariffs.get(0).getTotalDuration()) {
            return availableTariffs.get(0);
        }

        // Si la duración es mayor que la tarifa más larga, asignar la tarifa máxima
        if (durationInMinutes > availableTariffs.get(availableTariffs.size() - 1).getTotalDuration()) {
            return availableTariffs.get(availableTariffs.size() - 1);
        }
        // Buscar la tarifa adecuada redondeando hacia arriba
        for (TariffEntity tariff : availableTariffs) {
            if (durationInMinutes <= tariff.getTotalDuration()) {
                return tariff;
            }
        }
        // Si no se encuentra una tarifa adecuada (caso improbable), lanzar excepción
        throw new IllegalArgumentException("No se encontró una tarifa adecuada para la duración especificada.");
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
}