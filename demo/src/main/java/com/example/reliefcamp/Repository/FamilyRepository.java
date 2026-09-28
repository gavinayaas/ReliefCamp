package com.example.reliefcamp.Repository;

import com.example.reliefcamp.Model.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

    List<Family> findByCampId(Long campId);
}