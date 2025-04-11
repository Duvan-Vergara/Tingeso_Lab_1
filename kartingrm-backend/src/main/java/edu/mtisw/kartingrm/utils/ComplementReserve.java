package edu.mtisw.kartingrm.utils;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplementReserve {

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

    public double calculateFrequentCustomerDiscount(List<ReserveEntity> userReserves) {
        int visitsCount = userReserves.size();
        if (visitsCount >= 7) {
            return 0.30;
        } else if (visitsCount >= 5) {
            return 0.20;
        } else if (visitsCount >= 2) {
            return 0.10;
        }
        return 0;
    }

    public double calculateBestDiscount(ReserveEntity reserve, List<ReserveEntity> userReserves) {
        double bestDiscount = 0;
        int numberOfPeople = reserve.getGroup().size();
        // Descuento por número de personas
        bestDiscount = Math.max(bestDiscount, calculateGroupSizeDiscount(numberOfPeople));
        // Descuento para clientes frecuentes
        bestDiscount = Math.max(bestDiscount, calculateFrequentCustomerDiscount(userReserves));

        return bestDiscount;
    }

}
