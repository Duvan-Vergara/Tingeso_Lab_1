package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    UserEntity findByRut(String rut);
}