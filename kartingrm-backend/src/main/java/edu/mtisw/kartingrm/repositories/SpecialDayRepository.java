package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.SpecialDayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialDayRepository extends JpaRepository<SpecialDayEntity, Long> {
}
