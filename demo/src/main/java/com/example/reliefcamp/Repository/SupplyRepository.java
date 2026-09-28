package com.example.reliefcamp.Repository;

import com.example.reliefcamp.Model.Supply;
import com.example.reliefcamp.Model.SupplyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplyRepository extends JpaRepository<Supply, Long> {

    Optional<Supply> findByCampIdAndType(Long campId, SupplyType type);

    List<Supply> findByCampId(Long campId);
}