package com.example.reliefcamp.Service;

import com.example.reliefcamp.Model.Camp;
import com.example.reliefcamp.Model.Family;
import com.example.reliefcamp.Repository.CampRepository;
import com.example.reliefcamp.Repository.FamilyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final CampRepository campRepository;

    public FamilyService(FamilyRepository familyRepository,
                         CampRepository campRepository) {
        this.familyRepository = familyRepository;
        this.campRepository = campRepository;
    }

    public Family registerFamily(Long campId, Family family) {

        Camp camp = campRepository.findById(campId)
                .orElseThrow(() ->
                        new RuntimeException("Camp not found with id: " + campId));

        List<Family> families = familyRepository.findByCampId(campId);

        int currentPeople = families.stream()
                .mapToInt(Family::getHeadCount)
                .sum();

        int requestedPeople = family.getHeadCount();

        if (currentPeople + requestedPeople > camp.getCapacity()) {
            throw new RuntimeException(
                    "Camp capacity exceeded. Available capacity: "
                            + (camp.getCapacity() - currentPeople)
            );
        }

        family.setCamp(camp);

        return familyRepository.save(family);
    }

    public List<Family> getFamiliesByCamp(Long campId) {

        if (!campRepository.existsById(campId)) {
            throw new RuntimeException("Camp not found with id: " + campId);
        }

        return familyRepository.findByCampId(campId);
    }

    public Family getFamilyById(Long id) {

        return familyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Family not found with id: " + id));
    }
}