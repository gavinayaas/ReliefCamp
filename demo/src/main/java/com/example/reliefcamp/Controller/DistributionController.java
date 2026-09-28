package com.example.reliefcamp.Controller;

import com.example.reliefcamp.Model.Distribution;
import com.example.reliefcamp.Model.SupplyType;
import com.example.reliefcamp.Service.DistributionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/distributions")
@CrossOrigin(origins = "*")
public class DistributionController {

    private final DistributionService distributionService;

    public DistributionController(DistributionService distributionService) {
        this.distributionService = distributionService;
    }

    @PostMapping
    public ResponseEntity<Distribution> distributeSupply(
            @RequestParam Long campId,
            @RequestParam Long familyId,
            @RequestParam SupplyType supplyType,
            @RequestParam Integer quantity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(distributionService.distributeSupply(
                        campId,
                        familyId,
                        supplyType,
                        quantity
                ));
    }

    @GetMapping("/camp/{campId}")
    public ResponseEntity<List<Distribution>> getDistributions(
            @PathVariable Long campId) {

        return ResponseEntity.ok(
                distributionService.getDistributionsByCamp(campId)
        );
    }
}