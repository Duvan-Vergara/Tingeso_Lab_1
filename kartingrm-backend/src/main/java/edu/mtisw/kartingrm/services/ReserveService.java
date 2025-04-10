package edu.mtisw.kartingrm.services;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.entities.TariffEntity;
import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.repositories.ReserveRepository;
import edu.mtisw.kartingrm.repositories.SpecialDayRepository;
import edu.mtisw.kartingrm.repositories.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
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
    SpecialDayRepository specialDayRepository;

    @Autowired
    TariffRepository tariffRepository;

    public List<ReserveEntity> getReserves() { return new ArrayList<>(reserveRepository.findAll()); }

    /*
    public ReserveEntity saveReserve(ReserveEntity reserve){
        return reserveRepository.save(reserve);
    }
    */

    public ReserveEntity saveReserve(ReserveEntity reserve) {
        // Obtener las tarifas disponibles
        List<TariffEntity> availableTariffs = tariffRepository.getAllTariffs();

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

    public List<List<ReserveEntity>> getReserveByWeek(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        LocalDate startDate = date.with(TemporalAdjusters.previousOrSame(date.getDayOfWeek().getValue() == 7 ? date.getDayOfWeek() : date.getDayOfWeek().minus(1)));
        LocalDate endDate = startDate.plusDays(6);

        // Obtener reservas entre las fechas
        List<ReserveEntity> reserves = reserveRepository.getReserveByDate_DateBetween(startDate, endDate);

        // Agrupar reservas por día de la semana
        return IntStream.range(0, 7)
                .mapToObj(i -> startDate.plusDays(i))
                .map(d -> reserves.stream().filter(r -> r.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(d)).collect(Collectors.toList()))
                .collect(Collectors.toList());
    }

    public List<ReserveEntity> getReservesByDate_MonthANDRut(String rut, int month) {
        return reserveRepository.getReservesByDateMonthAndRut(rut, month);
    }

    /*
    public List<ReserveEntity> getReservesByDate_MonthANDRut(String rut, int month) {
        List<ReserveEntity> reserves = reserveRepository.getReserveByDate_Month(month);
        return reserves.stream()
                .filter(reserve -> reserve.getGroup().stream().anyMatch(user -> user.getRut().equals(rut)))
                .collect(Collectors.toList());
    }
    */

    public boolean deleteReserveById(Long id) throws Exception {
        try {
            reserveRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

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

    public double calculateFrequentCustomerDiscount(UserEntity user, int month) {
        List<ReserveEntity> visits = getReservesByDate_MonthANDRut(user.getRut(), month);
        int visitsCount = visits.size();
        if (visitsCount >= 7) {
            return 0.30;
        } else if (visitsCount >= 5) {
            return 0.20;
        } else if (visitsCount >= 2) {
            return 0.10;
        }
        return 0;
    }

    public double calculateBestDiscount(UserEntity user, ReserveEntity reserve, int month) {
        double bestDiscount = 0;
        int numberOfPeople = reserve.getGroup().size();
        // Descuento por número de personas
        bestDiscount = Math.max(bestDiscount, calculateGroupSizeDiscount(numberOfPeople));
        // Descuento para clientes frecuentes
        bestDiscount = Math.max(bestDiscount, calculateFrequentCustomerDiscount(user, month));
        return bestDiscount;
    }

    public double getTariffForDate(ReserveEntity reserve) {
        LocalDate reserveDate = reserve.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (isSpecialDay(reserveDate)) {
            return reserve.getTariff().getHolidayPrice();
        } else if (isWeekend(reserveDate)) {
            return reserve.getTariff().getWeekendPrice();
        } else {
            return reserve.getTariff().getRegularPrice();
        }
    }

    public TariffEntity calculateTariffForReserve(Date startTime, Date endTime, List<TariffEntity> availableTariffs) {
        // Ordenar las tarifas por duración máxima
        availableTariffs.sort(Comparator.comparingInt(TariffEntity::getMaxMinutes));

        // Calcular la duración en minutos
        long durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        // Si la duración es menor que la tarifa más corta, asignar la tarifa mínima
        if (durationInMinutes <= availableTariffs.get(0).getMaxMinutes()) {
            return availableTariffs.get(0);
        }

        // Si la duración es mayor que la tarifa más larga, asignar la tarifa máxima
        if (durationInMinutes > availableTariffs.get(availableTariffs.size() - 1).getMaxMinutes()) {
            return availableTariffs.get(availableTariffs.size() - 1);
        }

        // Buscar la tarifa adecuada redondeando hacia arriba
        for (TariffEntity tariff : availableTariffs) {
            if (durationInMinutes <= tariff.getMaxMinutes()) {
                return tariff;
            }
        }

        // Si no se encuentra una tarifa adecuada (caso improbable), lanzar excepción
        throw new IllegalArgumentException("No se encontró una tarifa adecuada para la duración especificada.");
    }

    public double calculateFinalPrice(ReserveEntity reserve, int month) {
        double totalPrice = 0;
        int birthdayLimit = calculateBirthdayLimit(reserve.getGroup().size());
        double basePrice = getTariffForDate(reserve);

        for (UserEntity user : reserve.getGroup()) {
            double bestDiscount = calculateBestDiscount(user, reserve, month);
            // Descuento por cumpleaños
            if (isBirthday(user, reserve.getDate()) && birthdayLimit > 0) {
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
        headerRow.createCell(0).setCellValue("Código de Reserva");
        headerRow.createCell(1).setCellValue("Fecha y Hora de Reserva");
        headerRow.createCell(2).setCellValue("Número de Vueltas/Max Tiempo");
        headerRow.createCell(3).setCellValue("Cantidad de Personas");
        headerRow.createCell(4).setCellValue("Nombre de la Persona que Reservó");

        // Llenar información de la reserva
        Row infoRow = sheet.createRow(1);
        infoRow.createCell(0).setCellValue(reserve.getId());
        infoRow.createCell(1).setCellValue(reserve.getDate().toString() + " " + reserve.getBegin().toString());
        infoRow.createCell(2).setCellValue(reserve.getTariff().getLaps() + " vueltas / " + reserve.getTariff().getMaxMinutes() + " minutos");
        infoRow.createCell(3).setCellValue(reserve.getGroup().size());
        infoRow.createCell(4).setCellValue(reserve.getGroup().iterator().next().getName());

        // Crear encabezados para el detalle de pago
        Row paymentHeaderRow = sheet.createRow(3);
        paymentHeaderRow.createCell(0).setCellValue("Nombre de Cliente");
        paymentHeaderRow.createCell(1).setCellValue("Tarifa Base");
        paymentHeaderRow.createCell(2).setCellValue("Descuento por Tamaño de Grupo");
        paymentHeaderRow.createCell(3).setCellValue("Descuento por Cliente Frecuente/Promociones");
        paymentHeaderRow.createCell(4).setCellValue("Monto Final");
        paymentHeaderRow.createCell(5).setCellValue("IVA");
        paymentHeaderRow.createCell(6).setCellValue("Monto Total");

        // Llenar detalle de pago
        int rowNum = 4;
        double totalAmount = 0;
        double iva = 0;
        for (UserEntity user : reserve.getGroup()) {
            Row row = sheet.createRow(rowNum++);
            double basePrice = reserve.getTariff().getRegularPrice();
            double groupDiscount = calculateGroupSizeDiscount(reserve.getGroup().size());
            double frequentDiscount = calculateFrequentCustomerDiscount(user, reserve.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue());
            double bestDiscount = Math.max(groupDiscount, frequentDiscount);
            double finalAmount = basePrice * (1 - bestDiscount);
            double ivaAmount = finalAmount * 0.19;
            double totalWithIva = finalAmount + ivaAmount;

            row.createCell(0).setCellValue(user.getName());
            row.createCell(1).setCellValue(basePrice);
            row.createCell(2).setCellValue(groupDiscount);
            row.createCell(3).setCellValue(frequentDiscount);
            row.createCell(4).setCellValue(finalAmount);
            row.createCell(5).setCellValue(ivaAmount);
            row.createCell(6).setCellValue(totalWithIva);

            totalAmount += finalAmount;
            iva += ivaAmount;
        }

        // Calcular el monto total e IVA
        Row totalRow = sheet.createRow(rowNum++);
        totalRow.createCell(5).setCellValue("IVA Total:");
        totalRow.createCell(6).setCellValue(iva);
        Row finalRow = sheet.createRow(rowNum);
        finalRow.createCell(5).setCellValue("Monto Total:");
        finalRow.createCell(6).setCellValue(totalAmount + iva);

        // Escribir el archivo Excel a un ByteArrayOutputStream
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
        for (Row row : sheet) {
            for (Cell cell : row) {
                document.add(new Paragraph(cell.toString()));
            }
            document.add(new Paragraph("\n"));
        }
        document.close();
        workbook.close();

        return bos.toByteArray();
    }

    public JavaMailSender createJavaMailSender(String host, int port, String username, String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }

    public void sendEmailWithAttachment(String host, int port, String username, String password, String to, String subject, String text, byte[] attachmentData, String attachmentName) {
        try {
            JavaMailSender mailSender = createJavaMailSender(host, port, username, password);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            helper.addAttachment(attachmentName, new ByteArrayDataSource(attachmentData, "application/pdf"));

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendPaymentReceipts(ReserveEntity reserve) throws IOException, DocumentException {
        byte[] excelData = generatePaymentReceipt(reserve);
        byte[] pdfData = convertExcelToPdf(excelData);

        for (UserEntity user : reserve.getGroup()) {
            sendEmailWithAttachment(
                    "smtp.example.com", 587, "your_email@example.com", "your_password",
                    user.getEmail(), "Comprobante de Pago", "Adjunto encontrará el comprobante de pago de su reserva.",
                    pdfData, "Comprobante_de_Pago.pdf"
            );
        }
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
}