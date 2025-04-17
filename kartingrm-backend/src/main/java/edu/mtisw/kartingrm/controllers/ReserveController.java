package edu.mtisw.kartingrm.controllers;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.services.ReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reserves")
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