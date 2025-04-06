package edu.mtisw.kartingrm.repositories;

import edu.mtisw.kartingrm.entities.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByRut_thenReturnUser() {
        // given
        UserEntity user = new UserEntity(null, "12345678-9", "John", "Doe", "john@example.com", new Date(96, 5, 15));
        entityManager.persistAndFlush(user);

        // when
        UserEntity found = userRepository.findByRut(user.getRut());

        // then
        assertThat(found.getRut()).isEqualTo(user.getRut());
    }
}