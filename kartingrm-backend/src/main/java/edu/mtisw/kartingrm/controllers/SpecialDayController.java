package edu.mtisw.kartingrm.controllers;

import edu.mtisw.kartingrm.entities.SpecialDayEntity;
import edu.mtisw.kartingrm.services.SpecialDayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/specialdays")
@CrossOrigin("*")
public class SpecialDayController {
    @Autowired
    SpecialDayService specialDayService;

    @GetMapping("/")
    public ResponseEntity<List<SpecialDayEntity>> getAllSpecialDays() {
        List<SpecialDayEntity> specialDays = specialDayService.getSpecialDays();
        return ResponseEntity.ok(specialDays);
    }

    @PostMapping("/")
    public ResponseEntity<SpecialDayEntity> createSpecialDay(@RequestBody SpecialDayEntity specialDay) {
        SpecialDayEntity createdSpecialDay = specialDayService.saveSpecialDay(specialDay);
        return ResponseEntity.ok(createdSpecialDay);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialDayEntity> getSpecialDayById(@PathVariable Long id) {
        SpecialDayEntity specialDay = specialDayService.getSpecialDayById(id);
        return ResponseEntity.ok(specialDay);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialDayById(@PathVariable Long id) throws Exception {
        specialDayService.deleteSpecialDayByID(id);
        return ResponseEntity.noContent().build();
    }

}
