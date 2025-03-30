package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.ReserveEntity;
import edu.mtisw.kartingrm.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReserveRepository extends JpaRepository<ReserveEntity, Long> {
    List<ReserveEntity> getReserveByDate_Day(int dateDay);

    List<ReserveEntity> getReserveByDate_Month(int dateMonth);

    List<ReserveEntity> getReserveByDate_DateBetween(int dateDateAfter, int dateDateBefore);
}
