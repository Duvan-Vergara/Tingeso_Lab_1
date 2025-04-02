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

    public TariffEntity saveTariff(TariffEntity tariff){
        return tariffRepository.save(tariff);
    }

    public TariffEntity getTariffById(Long id){
        return tariffRepository.findById(id).get();
    }

    public void deleteTariff(Long id){
        tariffRepository.deleteById(id);
    }
}
