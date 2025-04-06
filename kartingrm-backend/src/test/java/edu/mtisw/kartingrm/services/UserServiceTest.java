package edu.mtisw.kartingrm.services;

import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.BeforeEach;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new UserEntity(1L, "12345678-9", "John", "Doe", "john@example.com", new Date(96, 5, 15));
    }

    @Test
    void whenGetUsers_thenReturnUserList() {
        // Given
        List<UserEntity> userList = new ArrayList<>();
        userList.add(user);
        when(userRepository.findAll()).thenReturn(userList);

        // When
        List<UserEntity> result = userService.getUsers();

        // Then
        assertThat(result).isEqualTo(userList);
    }

    @Test
    void whenSaveUser_thenReturnSavedUser() {
        // Given
        when(userRepository.save(user)).thenReturn(user);

        // When
        UserEntity result = userService.saveUser(user);

        // Then
        assertThat(result).isEqualTo(user);
    }

    @Test
    void whenGetUserById_thenReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        UserEntity result = userService.getUserById(1L);

        // Then
        assertThat(result).isEqualTo(user);
    }

    @Test
    void whenUpdateUser_thenReturnUpdatedUser() {
        // Given
        when(userRepository.save(user)).thenReturn(user);

        // When
        UserEntity result = userService.updateUser(user);

        // Then
        assertThat(result).isEqualTo(user);
    }

    @Test
    void whenDeleteUser_thenReturnTrue() throws Exception {
        // Given
        doNothing().when(userRepository).deleteById(1L);

        // When
        boolean result = userService.deleteUser(1L);

        // Then
        assertThat(result).isTrue();
    }
}
