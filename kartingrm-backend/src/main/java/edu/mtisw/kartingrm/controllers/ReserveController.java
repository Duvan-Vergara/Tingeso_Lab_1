package edu.mtisw.kartingrm.controllers;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.services.ReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        //List<List<ReserveEntity>> reserves = reserveService.getReserveByWeek(year, month, week);
        List<List<String>> reserves = reserveService.getReserveByWeek(year, month, week);
        return ResponseEntity.ok(reserves);
    }

}