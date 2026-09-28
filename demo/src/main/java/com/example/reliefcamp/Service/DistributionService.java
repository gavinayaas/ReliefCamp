package com.example.reliefcamp.Service;

import com.example.reliefcamp.Model.Camp;
import com.example.reliefcamp.Model.Distribution;
import com.example.reliefcamp.Model.Family;
import com.example.reliefcamp.Model.Supply;
import com.example.reliefcamp.Model.SupplyType;
import com.example.reliefcamp.Repository.CampRepository;
import com.example.reliefcamp.Repository.DistributionRepository;
import com.example.reliefcamp.Repository.FamilyRepository;
import com.example.reliefcamp.Repository.SupplyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DistributionService {

    private final DistributionRepository distributionRepository;
    private final CampRepository campRepository;
    private final FamilyRepository familyRepository;
    private final SupplyRepository supplyRepository;

    public DistributionService(
            DistributionRepository distributionRepository,
            CampRepository campRepository,
            FamilyRepository familyRepository,
            SupplyRepository supplyRepository) {

        this.distributionRepository = distributionRepository;
        this.campRepository = campRepository;
        this.familyRepository = familyRepository;
        this.supplyRepository = supplyRepository;
    }

    public Distribution distributeSupply(
            Long campId,
            Long familyId,
            SupplyType supplyType,
            Integer quantity) {

        Camp camp = campRepository.findById(campId)
                .orElseThrow(() ->
                        new RuntimeException("Camp not found with id: " + campId));

        Family family = familyRepository.findById(familyId)
                .orElseThrow(() ->
                        new RuntimeException("Family not found with id: " + familyId));

        if (!family.getCamp().getId().equals(campId)) {
            throw new RuntimeException(
                    "Family does not belong to the selected camp"
            );
        }

        Supply supply = supplyRepository
                .findByCampIdAndType(campId, supplyType)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No " + supplyType + " inventory available"
                        ));

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Distribution quantity must be greater than zero"
            );
        }

        if (quantity > supply.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient " + supplyType +
                            " inventory. Available: " +
                            supply.getQuantity()
            );
        }

        supply.setQuantity(supply.getQuantity() - quantity);
        supplyRepository.save(supply);

        Distribution distribution = new Distribution();
        distribution.setCamp(camp);
        distribution.setFamily(family);
        distribution.setSupplyType(supplyType);
        distribution.setQuantity(quantity);
        distribution.setDistributedAt(LocalDateTime.now());

        return distributionRepository.save(distribution);
    }

    public List<Distribution> getDistributionsByCamp(Long campId) {

        if (!campRepository.existsById(campId)) {
            throw new RuntimeException("Camp not found with id: " + campId);
        }

        return distributionRepository.findByCampId(campId);
    }
}