package edu.mtisw.kartingrm;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.entities.SpecialDayEntity;
import edu.mtisw.kartingrm.entities.TariffEntity;
import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.services.ReserveService;
import edu.mtisw.kartingrm.services.SpecialDayService;
import edu.mtisw.kartingrm.services.TariffService;
import edu.mtisw.kartingrm.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private TariffService tariffService;

    @Autowired
    private SpecialDayService specialDayService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReserveService reserveService;

    @Override
    public void run(String... args) throws Exception {
        seedTariffs();
        seedSpecialDays();
        seedUsers(50); // Crear 50 usuarios
        seedReserves(100); // Crear 100 reservas
    }

    private void seedTariffs() {
        List<TariffEntity> tariffs = List.of(
                new TariffEntity(null, 10, 10, 15000, 30, 5.0, 20.0, 0, 0),
                new TariffEntity(null, 15, 15, 20000, 35, 5.0, 20.0, 0, 0),
                new TariffEntity(null, 20, 20, 25000, 40, 5.0, 20.0, 0, 0)
        );

        tariffs.forEach(tariffService::saveTariff);
    }

    private void seedSpecialDays() {
        List<SpecialDayEntity> specialDays = List.of(
                new SpecialDayEntity(null, LocalDate.of(2023, 1, 1), "Año Nuevo"),
                new SpecialDayEntity(null, LocalDate.of(2023, 4, 18), "Viernes Santo"),
                new SpecialDayEntity(null, LocalDate.of(2023, 4, 19), "Sábado Santo"),
                new SpecialDayEntity(null, LocalDate.of(2023, 5, 1), "Día del Trabajo"),
                new SpecialDayEntity(null, LocalDate.of(2023, 5, 21), "Día de las Glorias Navales"),
                new SpecialDayEntity(null, LocalDate.of(2023, 6, 20), "Día Nacional de los Pueblos Indígenas"),
                new SpecialDayEntity(null, LocalDate.of(2023, 6, 29), "San Pedro y San Pablo"),
                new SpecialDayEntity(null, LocalDate.of(2023, 7, 16), "Día de la Virgen del Carmen"),
                new SpecialDayEntity(null, LocalDate.of(2023, 8, 15), "Asunción de la Virgen"),
                new SpecialDayEntity(null, LocalDate.of(2023, 9, 18), "Independencia Nacional"),
                new SpecialDayEntity(null, LocalDate.of(2023, 9, 19), "Día de las Glorias del Ejército"),
                new SpecialDayEntity(null, LocalDate.of(2023, 10, 12), "Encuentro de Dos Mundos"),
                new SpecialDayEntity(null, LocalDate.of(2023, 10, 31), "Día de las Iglesias Evangélicas y Protestantes"),
                new SpecialDayEntity(null, LocalDate.of(2023, 11, 1), "Día de Todos los Santos"),
                new SpecialDayEntity(null, LocalDate.of(2023, 12, 8), "Inmaculada Concepción"),
                new SpecialDayEntity(null, LocalDate.of(2023, 12, 25), "Navidad")
        );
        specialDays.forEach(specialDayService::saveSpecialDay);
    }

    private void seedUsers(int count) {
        List<UserEntity> users = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < count; i++) {
            String rut = String.format("%d-%d", random.nextInt(99999999), random.nextInt(10));
            String name = "User" + i;
            String lastName = "LastName" + i;
            String email = "user" + i + "@example.com";
            LocalDate localDate = LocalDate.of(1990 + random.nextInt(30), 1 + random.nextInt(12), 1 + random.nextInt(28));
            Date birthDate = java.util.Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            users.add(new UserEntity(null, rut, name, lastName, email, birthDate));
        }

        users.forEach(userService::saveUser);
    }

    private void seedReserves(int count) {
        List<ReserveEntity> reserves = new ArrayList<>();
        Random random = new Random();
        List<UserEntity> users = userService.getUsers();
        List<TariffEntity> tariffs = tariffService.getTariffs();

        for (int i = 0; i < count; i++) {
            LocalDate randomDate = LocalDate.now().minusWeeks(random.nextInt(4)).plusDays(random.nextInt(7));
            Date reserveDate = Date.from(randomDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

            int startHour = randomDate.getDayOfWeek().getValue() >= 6 || specialDayService.getSpecialDays().stream()
                    .anyMatch(specialDay -> specialDay.getDate().equals(randomDate)) ? 10 + random.nextInt(12) : 14 + random.nextInt(8);
            int duration = 1 + random.nextInt(3);
            Date begin = Date.from(randomDate.atTime(startHour, 0).atZone(ZoneId.systemDefault()).toInstant());
            Date finish = Date.from(randomDate.atTime(startHour + duration, 0).atZone(ZoneId.systemDefault()).toInstant());

            TariffEntity tariff = tariffs.get(random.nextInt(tariffs.size()));

            int groupSize = 2 + random.nextInt(5);
            Set<UserEntity> group = new HashSet<>();
            while (group.size() < groupSize) {
                group.add(users.get(random.nextInt(users.size())));
            }

            ReserveEntity reserve = new ReserveEntity();
            reserve.setDate(reserveDate);
            reserve.setBegin(begin);
            reserve.setFinish(finish);
            reserve.setGroup(group);
            reserve.setTariff(tariff);
            reserve.setFinalPrice(reserveService.calculateFinalPrice(reserve, randomDate.getMonthValue()));

            reserveService.saveReserve(reserve);
        }
    }
}
