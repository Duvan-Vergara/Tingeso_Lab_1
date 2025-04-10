package edu.mtisw.kartingrm.services;

import com.itextpdf.text.DocumentException;
import edu.mtisw.kartingrm.entities.TariffEntity;
import edu.mtisw.kartingrm.repositories.SpecialDayRepository;
import edu.mtisw.kartingrm.repositories.TariffRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.repositories.ReserveRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.*;

import static org.mockito.Mockito.when;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class ReserveServiceTest {

    @InjectMocks
    private ReserveService reserveService;

    @Mock
    private ReserveRepository reserveRepository;

    @Mock
    private TariffRepository tariffRepository;

    @Mock
    private SpecialDayRepository specialDayRepository;

    private ReserveEntity reserve, reserve1;
    private UserEntity user, user2, user3, user4, user5, user6, user7, user8, user9, user10;
    private TariffEntity tariff1, tariff2, tariff3;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new UserEntity(1L, "12.345.678-9", "Yugo", "Smith", "duvanvch12@gmail.com", java.util.Date.from(LocalDate.of(1995, 5, 15).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user2 = new UserEntity(2L, "98.765.432-1", "Anna", "Johnson", "anna.johnson@example.com", java.util.Date.from(LocalDate.of(1990, 8, 20).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user3 = new UserEntity(3L, "11.223.344-5", "Carlos", "Gomez", "carlos.gomez@example.com", java.util.Date.from(LocalDate.of(1988, 12, 10).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user4 = new UserEntity(4L, "22244333-5", "User4", "LastName4", "user4@example.com", java.util.Date.from(LocalDate.of(2004, 2, 1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user5 = new UserEntity(5L, "58176622-0", "User5", "LastName5", "user5@example.com", java.util.Date.from(LocalDate.of(2002, 7, 6).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user6 = new UserEntity(6L, "98877299-5", "User6", "LastName6", "user6@example.com", java.util.Date.from(LocalDate.of(2008, 4, 22).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user7 = new UserEntity(7L, "9190820-5", "User7", "LastName7", "user7@example.com", java.util.Date.from(LocalDate.of(2002, 9, 7).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user8 = new UserEntity(8L, "63106613-7", "User8", "LastName8", "user8@example.com", java.util.Date.from(LocalDate.of(1997, 11, 3).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user9 = new UserEntity(9L, "35709765-2", "User9", "LastName9", "user9@example.com", java.util.Date.from(LocalDate.of(2008, 11, 22).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        user10 = new UserEntity(10L, "6021623-0", "User10", "LastName10", "user10@example.com", java.util.Date.from(LocalDate.of(2000, 4, 15).atStartOfDay(ZoneId.systemDefault()).toInstant()));


        Set<UserEntity> group = new HashSet<>();
        group.add(user);
        group.add(user2);
        group.add(user3);

        Set<UserEntity> group1 = new HashSet<>();
        group1.add(user);
        group1.add(user2);
        group1.add(user3);

        Set<UserEntity> group2 = new HashSet<>();
        group2.add(user4);
        group2.add(user5);
        group2.add(user6);

        Set<UserEntity> group3 = new HashSet<>();
        group3.add(user7);
        group3.add(user8);
        group3.add(user9);
        group3.add(user10);

        tariff1 = new TariffEntity(1L, 10, 10, 15000.00, 30, 5.00, 20.00, 14250.00, 18000.00);
        tariff2 = new TariffEntity(2L, 15, 15, 20000.00, 35, 5.00, 20.00, 19000.00, 24000.00);
        tariff3 = new TariffEntity(3L, 20, 20, 25000.00, 40, 5.00, 20.00, 23750.00, 30000.00);

        reserve1 = new ReserveEntity();
        reserve1.setId(1L);
        reserve1.setDate(java.util.Date.from(LocalDate.of(2023, 12, 20).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        reserve1.setBegin(java.util.Date.from(LocalTime.of(17, 0).atDate(LocalDate.now()).atZone(ZoneId.systemDefault()).toInstant()));
        reserve1.setFinish(java.util.Date.from(LocalTime.of(17, 30).atDate(LocalDate.now()).atZone(ZoneId.systemDefault()).toInstant()));
        reserve1.setGroup(group1);
        reserve1.setTariff(tariff1);
        reserve1.setFinalPrice(0.0);

        reserve = new ReserveEntity();
        reserve.setId(1L);
        reserve.setDate(new Date());
        reserve.setBegin(new Date());
        reserve.setFinish(new Date());
        reserve.setGroup(group);
        reserve.setTariff(tariff1);
        reserve.setFinalPrice(0.0);
    }

    private boolean isSpecialDay(LocalDate date) {
        List<LocalDate> specialDays = List.of(
                LocalDate.of(date.getYear(), 1, 1), // Año Nuevo
                LocalDate.of(date.getYear(), 4, 18), // Viernes Santo
                LocalDate.of(date.getYear(), 4, 19), // Sábado Santo
                LocalDate.of(date.getYear(), 5, 1), // Día Nacional del Trabajo
                LocalDate.of(date.getYear(), 5, 21), // Día de las Glorias Navales
                LocalDate.of(date.getYear(), 6, 20), // Día Nacional de los Pueblos Indígenas
                LocalDate.of(date.getYear(), 6, 29), // San Pedro y San Pablo
                LocalDate.of(date.getYear(), 7, 16), // Día de la Virgen del Carmen
                LocalDate.of(date.getYear(), 8, 15), // Asunción de la Virgen
                LocalDate.of(date.getYear(), 9, 18), // Independencia Nacional
                LocalDate.of(date.getYear(), 9, 19), // Día de las Glorias del Ejército
                LocalDate.of(date.getYear(), 10, 12), // Encuentro de Dos Mundos
                LocalDate.of(date.getYear(), 10, 31), // Día de las Iglesias Evangélicas y Protestantes
                LocalDate.of(date.getYear(), 11, 1), // Día de Todos los Santos
                LocalDate.of(date.getYear(), 12, 8), // Inmaculada Concepción
                LocalDate.of(date.getYear(), 12, 25), // Navidad
                // Feriados específicos
                LocalDate.of(date.getYear(), 6, 7), // Asalto y Toma del Morro de Arica
                LocalDate.of(date.getYear(), 8, 20), // Nacimiento del Prócer de la Independencia
                LocalDate.of(date.getYear(), 12, 31) // Feriado Bancario
        );
        return specialDays.contains(date) || date.getDayOfWeek().getValue() == 7; // Incluye todos los domingos
    }

    @Test
    void whenGetReserves_thenReturnList() {
        // Given
        List<ReserveEntity> reserves = List.of(reserve);
        when(reserveRepository.findAll()).thenReturn(reserves);

        // When
        List<ReserveEntity> result = reserveService.getReserves();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);
        verify(reserveRepository, times(1)).findAll();
    }

    @Test
    void whenSaveReserve_thenReturnSavedReserve() {
        // Given
        when(reserveRepository.save(reserve)).thenReturn(reserve);

        // When
        ReserveEntity result = reserveService.saveReserve(reserve);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(reserve.getId());
        verify(reserveRepository, times(1)).save(reserve);
    }

    @Test
    void whenGetReserveById_thenReturnReserve() {
        // Given
        when(reserveRepository.findById(1L)).thenReturn(Optional.of(reserve));

        // When
        ReserveEntity result = reserveService.getReserveById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(reserveRepository, times(1)).findById(1L);
    }

    @Test
    void whenUpdateReserve_thenReturnUpdatedReserve() {
        // Given
        when(reserveRepository.save(reserve)).thenReturn(reserve);

        // When
        ReserveEntity result = reserveService.updateReserve(reserve);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(reserve.getId());
        verify(reserveRepository, times(1)).save(reserve);
    }

    @Test
    void whenDeleteReserveById_thenVerifyDeletion() throws Exception {
        // When
        boolean result = reserveService.deleteReserveById(1L);

        // Then
        assertThat(result).isTrue();
        verify(reserveRepository, times(1)).deleteById(1L);
    }

    @Test
    void whenGetReserveByDay_thenReturnList() {
        // Given
        List<ReserveEntity> reserves = List.of(reserve);
        when(reserveRepository.getReserveByDate_Day(1)).thenReturn(reserves);

        // When
        List<ReserveEntity> result = reserveService.getReserveByDay(1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);
        verify(reserveRepository, times(1)).getReserveByDate_Day(1);
    }

    @Test
    void whenGetReserveByMonth_thenReturnList() {
        // Given
        List<ReserveEntity> reserves = List.of(reserve);
        when(reserveRepository.getReserveByDate_Month(1)).thenReturn(reserves);

        // When
        List<ReserveEntity> result = reserveService.getReserveByMonth(1);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);
        verify(reserveRepository, times(1)).getReserveByDate_Month(1);
    }

    @Test
    void whenCalculateFinalPrice_thenReturnCorrectPrice() {
        // Given
        when(reserveRepository.getReservesByDateMonthAndRut(user.getRut(), reserve.getDate().getMonth() + 1))
                .thenReturn(List.of());

        // When
        double finalPrice = reserveService.calculateFinalPrice(reserve, reserve.getDate().getMonth() + 1);

        // Then
        assertThat(finalPrice).isEqualTo(40500.0);
    }

    @Test
    void whenCalculateFinalPrice2_thenReturnCorrectPrice() {
        // Given
        // Simular que el usuario tiene una reserva previa en el mes
        when(reserveRepository.getReservesByDateMonthAndRut(user.getRut(), reserve.getDate().getMonth() + 1))
                .thenReturn(List.of(reserve1));

        // Calcular el precio base según la tarifa
        double basePrice = tariff1.getRegularPrice();

        // Calcular el descuento por tamaño del grupo
        double groupDiscount = reserveService.calculateGroupSizeDiscount(reserve.getGroup().size());
        List<Double> descuentos = new ArrayList<>() ;
        double descfrecuent;
        // Calcular el descuento por cliente frecuente
        for (UserEntity  u : reserve1.getGroup()){
            descfrecuent = reserveService.calculateFrequentCustomerDiscount(u, reserve.getDate().getMonth() + 1);
            descuentos.add(Math.max(groupDiscount, descfrecuent));
        }

        // Calcular el precio final esperado
        double expectedPrice = 0.0;
        for (double d : descuentos){
            expectedPrice += basePrice * (1 - d);
        }

        // When
        double finalPrice = reserveService.calculateFinalPrice(reserve, reserve.getDate().getMonth() + 1);

        // Then
        System.out.println("Final Price: " + finalPrice + "Precio Calculado: " + expectedPrice);
        assertThat(finalPrice).isEqualTo(expectedPrice);
    }

    @Test
    void whenGeneratePaymentReceipt_thenCorrect() throws IOException {
        // When
        byte[] receipt = reserveService.generatePaymentReceipt(reserve);

        // Then
        assertThat(receipt).isNotNull();
        assertThat(receipt.length).isGreaterThan(0);
    }

    @Test
    void whenConvertExcelToPdf_thenCorrect() throws IOException, DocumentException {
        // Given
        byte[] excelData = reserveService.generatePaymentReceipt(reserve);

        // When
        byte[] pdfData = reserveService.convertExcelToPdf(excelData);

        // Then
        assertThat(pdfData).isNotNull();
        assertThat(pdfData.length).isGreaterThan(0);
    }
}
