package com.example.reliefcamp.Service;

import com.example.reliefcamp.Model.Camp;
import com.example.reliefcamp.Model.Supply;
import com.example.reliefcamp.Model.SupplyType;
import com.example.reliefcamp.Repository.CampRepository;
import com.example.reliefcamp.Repository.SupplyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplyService {

    private final SupplyRepository supplyRepository;
    private final CampRepository campRepository;

    public SupplyService(SupplyRepository supplyRepository,
                         CampRepository campRepository) {
        this.supplyRepository = supplyRepository;
        this.campRepository = campRepository;
    }

    public Supply addSupply(Long campId, Supply supply) {

        Camp camp = campRepository.findById(campId)
                .orElseThrow(() ->
                        new RuntimeException("Camp not found with id: " + campId));

        Supply existingSupply = supplyRepository
                .findByCampIdAndType(campId, supply.getType())
                .orElse(null);

        if (existingSupply != null) {
            existingSupply.setQuantity(
                    existingSupply.getQuantity() + supply.getQuantity()
            );

            return supplyRepository.save(existingSupply);
        }

        supply.setCamp(camp);

        return supplyRepository.save(supply);
    }

    public List<Supply> getInventory(Long campId) {

        if (!campRepository.existsById(campId)) {
            throw new RuntimeException("Camp not found with id: " + campId);
        }

        return supplyRepository.findByCampId(campId);
    }

    public Supply getSupply(Long campId, SupplyType type) {

        return supplyRepository.findByCampIdAndType(campId, type)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Supply not found for type: " + type
                        ));
    }
}