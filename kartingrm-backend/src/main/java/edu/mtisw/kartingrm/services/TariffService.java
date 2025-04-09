package edu.mtisw.kartingrm.services;

import edu.mtisw.kartingrm.entities.TariffEntity;
import edu.mtisw.kartingrm.repositories.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class TariffService {
    @Autowired
    TariffRepository tariffRepository;

    public ArrayList<TariffEntity> getTariffs(){
        return (ArrayList<TariffEntity>) tariffRepository.findAll();
    }

    public TariffEntity saveTariff(TariffEntity tariff) {
        calculateAdjustedPrices(tariff);
        return tariffRepository.save(tariff);
    }

    public TariffEntity updateTariff(TariffEntity tariff) {
        calculateAdjustedPrices(tariff);
        return tariffRepository.save(tariff);
    }

    public TariffEntity getTariffById(Long id){
        return tariffRepository.findById(id).get();
    }

    public void deleteTariff(Long id){
        tariffRepository.deleteById(id);
    }

    public TariffEntity getTariffByLaps(int laps){
        return tariffRepository.findByLaps(laps);
    }

    public TariffEntity getTariffByMaxMinutes(int maxMinutes){
        return tariffRepository.findByMaxMinutes(maxMinutes);
    }

    private void calculateAdjustedPrices(TariffEntity tariff) {
        // Calcular precio de fin de semana
        tariff.setWeekendPrice(tariff.getRegularPrice() * (1 - tariff.getWeekendDiscountPercentage() / 100));

        // Calcular precio de día especial
        tariff.setHolidayPrice(tariff.getRegularPrice() * (1 + tariff.getHolidayIncreasePercentage() / 100));
    }

    public TariffEntity getTariffByIdOrLapsOrMaxMinutes(Long id, int laps, int maxMinutes) {
        if (id != null) {
            return getTariffById(id);
        } else if (laps > 0) {
            return getTariffByLaps(laps);
        } else if (maxMinutes > 0) {
            return getTariffByMaxMinutes(maxMinutes);
        }
        return null;
    }
}
