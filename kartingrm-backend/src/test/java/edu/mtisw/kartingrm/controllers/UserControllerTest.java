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
    public void listEmployees_ShouldReturnUsers() throws Exception {
        UserEntity employee1 = new UserEntity(1L,
                "12345678-9",
                "Alex Garcia",
                50000,
                2,
                "A");

        UserEntity employee2 = new UserEntity(2L,
                "98765432-1",
                "Alex Garcia",
                60000,
                1,
                "A");

        List<UserEntity> employeeList = new ArrayList<>(Arrays.asList(employee1, employee2));

        given(userService.getUsers()).willReturn((ArrayList<UserEntity>) employeeList);

        mockMvc.perform(get("/api/v1/employees/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Alex Garcia")))
                .andExpect(jsonPath("$[1].name", is("Alex Garcia")));
    }

    @Test
    public void getEmployeeById_ShouldReturnEmployee() throws Exception {
        UserEntity employee = new UserEntity(1L,
                "12345678-9",
                "Beatriz Miranda",
                50000,
                2,
                "A");

        given(userService.getUserById(1L)).willReturn(employee);

        mockMvc.perform(get("/api/v1/employees/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Beatriz Miranda")));
    }

    @Test
    public void saveEmployee_ShouldReturnSavedEmployee() throws Exception {
        //EmployeeEntity employeeToSave = new EmployeeEntity(null, "12345678-9", "New Employee", 40000, 0, "B");
        UserEntity savedEmployee = new UserEntity(1L,
                "17.777.457-8",
                "Esteban Marquez",
                40000,
                0,
                "B");

        given(userService.saveUser(Mockito.any(UserEntity.class))).willReturn(savedEmployee);

        String employeeJson = """
            {
                "rut": "17.777.457-8",
                "name": "Esteban Marquez",
                "salary": 40000,
                "children": 0,
                "category": "B"
            }
            """;

        mockMvc.perform(post("/api/v1/employees/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Esteban Marquez")));
    }

    @Test
    public void updateEmployee_ShouldReturnUpdatedEmployee() throws Exception {
        UserEntity updatedEmployee = new UserEntity(1L,
                "12.345.678-9",
                "Marco Jimenez",
                45000,
                1,
                "B");

        given(userService.updateUser(Mockito.any(UserEntity.class))).willReturn(updatedEmployee);

        String employeeJson = """
            {
                "id": 1,
                "rut": "12.345.678-9",
                "name": "Marco Jimenez",
                "salary": 45000,
                "children": 1,
                "category": "B"
            }
            """;


        mockMvc.perform(put("/api/v1/employees/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Marco Jimenez")));
    }

    @Test
    public void deleteEmployeeById_ShouldReturn204() throws Exception {
        when(userService.deleteUser(1L)).thenReturn(true); // Assuming the method returns a boolean

        mockMvc.perform(delete("/api/v1/employees/{id}", 1L))
                .andExpect(status().isNoContent());
    }
}