package edu.mtisw.kartingrm.services;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.repositories.ReserveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ReserveService {

    @Autowired
    ReserveRepository reserveRepository;

    public ArrayList<ReserveEntity> getReserves(){
        return (ArrayList<ReserveEntity>) reserveRepository.findAll();
    }

    public ReserveEntity saveReserve(ReserveEntity reserve){
        return reserveRepository.save(reserve);
    }

    public ReserveEntity getReserveById(Long id){
        return reserveRepository.findById(id).get();
    }

    public ReserveEntity updateReserve(ReserveEntity reserve) {
        return reserveRepository.save(reserve);
    }

    public List<ReserveEntity> getReserveByDay(int day){ return reserveRepository.getReserveByDate_Day(day); }

    public List<ReserveEntity> getReserveByMonth(int month){ return reserveRepository.getReserveByDate_Month(month); }


    public List<List<ReserveEntity>> getReserveByWeek(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        LocalDate startDate = date.with(TemporalAdjusters.previousOrSame(date.getDayOfWeek().getValue() == 7 ? date.getDayOfWeek() : date.getDayOfWeek().minus(1)));
        LocalDate endDate = startDate.plusDays(6);
        int startDay = startDate.getDayOfMonth();
        int endDay = endDate.getDayOfMonth();
        List<ReserveEntity> reserves = reserveRepository.getReserveByDate_DateBetween(startDay, endDay);
        return IntStream.range(0, 7)
                .mapToObj(i -> startDate.plusDays(i))
                .map(d -> reserves.stream().filter(r -> r.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(d)).collect(Collectors.toList()))
                .collect(Collectors.toList());
    }

    /*
    public List<List<ReserveEntity>> getReserveByWeek(int year, int month, int day) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month - 1); // Los meses en Calendar son 0-based
        cal.set(Calendar.DAY_OF_MONTH, day);

        // Ajustar al primer día de la semana
        cal.set(Calendar.DAY_OF_WEEK, cal.getFirstDayOfWeek());
        int startDate = cal.get(Calendar.DAY_OF_MONTH);

        // Obtener el último día de la semana
        cal.add(Calendar.DAY_OF_WEEK, 6);
        int endDate = cal.get(Calendar.DAY_OF_MONTH);

        List<ReserveEntity> reserves = reserveRepository.getReserveByDate_DateBetween(startDate, endDate);
        List<List<ReserveEntity>> weeklyReserves = new ArrayList<>(7);

        for (int i = 0; i < 7; i++) {
            weeklyReserves.add(new ArrayList<>());
        }

        for (ReserveEntity reserve : reserves) {
            cal.setTime(reserve.getDate());
            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - cal.getFirstDayOfWeek();
            if (dayOfWeek < 0) {
                dayOfWeek += 7;
            }
            weeklyReserves.get(dayOfWeek).add(reserve);
        }

        return weeklyReserves;
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

}
