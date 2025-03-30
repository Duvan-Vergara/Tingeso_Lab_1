package edu.mtisw.kartingrm.controllers;

import edu.mtisw.kartingrm.entities.UserEntity;
import edu.mtisw.kartingrm.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
	UserService userService;

    @GetMapping("/")
	public ResponseEntity<List<UserEntity>> listUsers() {
    	List<UserEntity> users = userService.getUsers();
		return ResponseEntity.ok(users);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserEntity> getEmployeeById(@PathVariable Long id) {
		UserEntity user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}

	@PostMapping("/")
	public ResponseEntity<UserEntity> saveEmployee(@RequestBody UserEntity employee) {
		UserEntity userNew = userService.saveUser(employee);
		return ResponseEntity.ok(userNew);
	}

	@PutMapping("/")
	public ResponseEntity<UserEntity> updateEmployee(@RequestBody UserEntity employee){
		UserEntity userUpdated = userService.updateUser(employee);
		return ResponseEntity.ok(userUpdated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteEmployeeById(@PathVariable Long id) throws Exception {
		var isDeleted = userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}
}