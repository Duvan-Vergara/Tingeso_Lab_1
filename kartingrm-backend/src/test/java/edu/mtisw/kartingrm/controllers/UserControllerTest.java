package edu.mtisw.kartingrm.controllers;

import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;


    @Test
    public void listUsers_ShouldReturnUsers() throws Exception {
        UserEntity user1 = new UserEntity(1L, "12345678-9", "Alex", "Garcia", "alex@example.com", new Date(96, 5, 15)); // 15-06-1996
        UserEntity user2 = new UserEntity(2L, "98765432-1", "Beatriz", "Miranda", "beatriz@example.com", new Date(93, 8, 20)); // 20-09-1993

        List<UserEntity> userList = new ArrayList<>(Arrays.asList(user1, user2));

        given(userService.getUsers()).willReturn((ArrayList<UserEntity>) userList);

        mockMvc.perform(get("/api/v1/users/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Alex")))
                .andExpect(jsonPath("$[1].name", is("Beatriz")));
    }

    @Test
    public void getUserById_ShouldReturnUser() throws Exception {
        UserEntity user = new UserEntity(1L, "12345678-9", "Beatriz", "Miranda", "beatriz@example.com", new Date());

        given(userService.getUserById(1L)).willReturn(user);

        mockMvc.perform(get("/api/v1/users/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Beatriz")));
    }

    @Test
    public void saveUser_ShouldReturnSavedUser() throws Exception {
        UserEntity savedUser = new UserEntity(1L, "17.777.457-8", "Esteban", "Marquez", "esteban@example.com", new Date());

        given(userService.saveUser(Mockito.any(UserEntity.class))).willReturn(savedUser);

        String userJson = """
            {
                "rut": "17.777.457-8",
                "name": "Esteban",
                "lastName": "Marquez",
                "email": "esteban@example.com",
                "birthDate": "2000-01-01"
            }
            """;

        mockMvc.perform(post("/api/v1/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Esteban")));
    }

    @Test
    public void updateUser_ShouldReturnUpdatedUser() throws Exception {
        UserEntity updatedUser = new UserEntity(1L, "12.345.678-9", "Marco", "Jimenez", "marco@example.com", new Date());

        given(userService.updateUser(Mockito.any(UserEntity.class))).willReturn(updatedUser);

        String userJson = """
            {
                "id": 1,
                "rut": "12.345.678-9",
                "name": "Marco",
                "lastName": "Jimenez",
                "email": "marco@example.com",
                "birthDate": "2000-01-01"
            }
            """;

        mockMvc.perform(put("/api/v1/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Marco")));
    }

    @Test
    public void deleteUserById_ShouldReturn204() throws Exception {
        when(userService.deleteUser(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/users/{id}", 1L))
                .andExpect(status().isNoContent());
    }
}