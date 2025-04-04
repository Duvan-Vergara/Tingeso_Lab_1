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
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.when;

import static org.assertj.core.api.Assertions.assertThat;

public class ReserveServiceTest {

    @InjectMocks
    private ReserveService reserveService;

    @Mock
    private ReserveRepository reserveRepository;

    @Mock
    private TariffRepository tariffRepository;

    @Mock
    private SpecialDayRepository specialDayRepository;

    private ReserveEntity reserve;
    private UserEntity user;
    private TariffEntity tariff;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new UserEntity();
        user.setId(1L);
        user.setName("Juan");
        user.setRut("12.345.678-9");
        user.setEmail("duvanvch12@gmail.com");
        user.setBirthDate(new Date());

        Set<UserEntity> group = new HashSet<>();
        group.add(user);

        tariff = new TariffEntity();
        tariff.setRegularPrice(100.0);
        tariff.setHolidayPrice(150.0);
        tariff.setLaps(10);
        tariff.setMaxMinutes(30);

        reserve = new ReserveEntity();
        reserve.setId(1L);
        reserve.setDate(new Date());
        reserve.setBegin(new Date());
        reserve.setFinish(new Date());
        reserve.setGroup(group);
        reserve.setTariff(tariff);
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
    void whenCalculateFinalPrice_thenCorrect() {
        // Given
        when(reserveRepository.getReservesByDate_MonthANDRut(user.getRut(), reserve.getDate().getMonth() + 1))
                .thenReturn(List.of());

        // When
        double finalPrice = reserveService.calculateFinalPrice(reserve, reserve.getDate().getMonth() + 1);

        // Then
        assertThat(finalPrice).isEqualTo(100.0);
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
