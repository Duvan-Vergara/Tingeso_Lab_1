package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.TariffEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TariffRepository extends JpaRepository<TariffEntity, Long> {
}