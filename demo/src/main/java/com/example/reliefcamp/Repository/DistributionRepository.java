package com.example.reliefcamp.Repository;

import com.example.reliefcamp.Model.Distribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionRepository extends JpaRepository<Distribution, Long> {

    List<Distribution> findByCampId(Long campId);

    List<Distribution> findByFamilyId(Long familyId);

    void deleteByCampId(Long campId);
}