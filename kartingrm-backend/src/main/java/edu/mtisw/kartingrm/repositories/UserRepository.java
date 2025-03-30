package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity findByRut(String rut);

    @Query(value = "SELECT * FROM users WHERE users.rut = :rut", nativeQuery = true)
    UserEntity findByRutNativeQuery(@Param("rut") String rut);
}