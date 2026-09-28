package com.example.reliefcamp.Service;

import com.example.reliefcamp.Model.Camp;
import com.example.reliefcamp.Repository.CampRepository;
import com.example.reliefcamp.Repository.DistributionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampService {

    private final CampRepository campRepository;
    private final DistributionRepository distributionRepository;

    public CampService(
            CampRepository campRepository,
            DistributionRepository distributionRepository) {

        this.campRepository = campRepository;
        this.distributionRepository = distributionRepository;
    }

    public List<Camp> getAllCamps() {
        return campRepository.findAll();
    }

    public Camp getCampById(Long id) {
        return campRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Camp not found with id: " + id));
    }

    public Camp createCamp(Camp camp) {
        return campRepository.save(camp);
    }

    public void deleteCamp(Long id) {

        if (!campRepository.existsById(id)) {
            throw new RuntimeException(
                    "Camp not found with id: " + id);
        }

        // Delete distributions first because they reference
        // the camp and its families.
        distributionRepository.deleteByCampId(id);

        // Now delete the camp.
        // Its supplies and families are removed through
        // CascadeType.ALL in Camp.java.
        campRepository.deleteById(id);
    }
}