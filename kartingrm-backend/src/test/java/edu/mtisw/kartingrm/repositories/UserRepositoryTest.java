package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByRut_thenReturnEmployee() {
        // given
        UserEntity employee = new UserEntity(null, "12345678-9", "John Doe", 50000, 2, "A");
        entityManager.persistAndFlush(employee);

        // when
        UserEntity found = userRepository.findByRut(employee.getRut());

        // then
        assertThat(found.getRut()).isEqualTo(employee.getRut());
    }

    @Test
    public void whenFindByCategory_thenReturnEmployees() {
        // given
        UserEntity employee1 = new UserEntity(null, "12345678-9", "John Doe", 50000, 2, "A");
        UserEntity employee2 = new UserEntity(null, "98765432-1", "Jane Doe", 60000, 1, "A");
        entityManager.persist(employee1);
        entityManager.persist(employee2);
        entityManager.flush();

        // when
        List<UserEntity> foundEmployees = userRepository.findByCategory("A");

        // then
        assertThat(foundEmployees).hasSize(2).extracting(UserEntity::getCategory).containsOnly("A");
    }

    @Test
    public void whenFindBySalaryGreaterThan_thenReturnEmployees() {
        // given
        UserEntity lowSalaryEmployee = new UserEntity(null, "12345678-9", "John Doe", 30000, 2, "B");
        UserEntity highSalaryEmployee = new UserEntity(null, "98765432-1", "Jane Doe", 60000, 1, "A");
        entityManager.persist(lowSalaryEmployee);
        entityManager.persist(highSalaryEmployee);
        entityManager.flush();

        // when
        List<UserEntity> foundEmployees = userRepository.findBySalaryGreaterThan(50000);

        // then
        assertThat(foundEmployees).hasSize(1).extracting(UserEntity::getName).containsOnly("Jane Doe");
    }

    @Test
    public void whenFindByChildrenBetween_thenReturnEmployees() {
        // given
        UserEntity employee1 = new UserEntity(null, "12345678-9", "John Doe", 50000, 0, "A");
        UserEntity employee2 = new UserEntity(null, "98765432-1", "Jane Doe", 60000, 2, "B");
        entityManager.persist(employee1);
        entityManager.persist(employee2);
        entityManager.flush();

        // when
        List<UserEntity> foundEmployees = userRepository.findByChildrenBetween(1, 3);

        // then
        assertThat(foundEmployees).hasSize(1).extracting(UserEntity::getName).containsOnly("Jane Doe");
    }

    @Test
    public void whenFindByRutNativeQuery_thenReturnEmployee() {
        // given
        UserEntity employee = new UserEntity(null, "12345678-9", "John Doe", 50000, 2, "A");
        entityManager.persistAndFlush(employee);

        // when
        UserEntity found = userRepository.findByRutNativeQuery(employee.getRut());

        // then
        assertThat(found.getRut()).isEqualTo(employee.getRut());
    }
}