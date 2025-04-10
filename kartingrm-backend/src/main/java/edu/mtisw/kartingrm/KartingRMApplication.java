package edu.mtisw.kartingrm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class KartingRMApplication implements CommandLineRunner {

    @Autowired
    private SQLScriptGenerator sqlScriptGenerator;

    public static void main(String[] args) {
        SpringApplication.run(KartingRMApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String filePath = "poblacion_BD.sql";
        File file = new File(filePath);

        if (file.exists()) {
            System.out.println("El archivo '" + filePath + "' ya existe. No se generará nuevamente.");
        } else {
            sqlScriptGenerator.generateSQLScript(filePath);
            System.out.println("Archivo '" + filePath + "' generado exitosamente.");
        }
    }
}