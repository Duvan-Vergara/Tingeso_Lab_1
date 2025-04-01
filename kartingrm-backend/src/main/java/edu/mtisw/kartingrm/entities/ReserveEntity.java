package edu.mtisw.kartingrm.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "reserves")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReserveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @DateTimeFormat(pattern = "dd-mm-yyyy")
    @Column(nullable = false, name = "reserveday")
    private Date date;

    @DateTimeFormat(pattern = "hh-mm")
    @Column(nullable = false, name = "begin")
    private Date begin;

    @DateTimeFormat(pattern = "hh-mm")
    @Column(nullable = false, name = "finish")
    private Date finish;

    @ManyToMany
    @Column(nullable = false, name = "members")
    private Set<UserEntity> group;


}

