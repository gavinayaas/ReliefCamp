package com.example.reliefcamp.Controller;

import com.example.reliefcamp.Model.Supply;
import com.example.reliefcamp.Service.SupplyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camps")
@CrossOrigin(origins = "*")
public class SupplyController {

    private final SupplyService supplyService;

    public SupplyController(SupplyService supplyService) {
        this.supplyService = supplyService;
    }

    @PostMapping("/{campId}/supplies")
    public ResponseEntity<Supply> addSupply(
            @PathVariable Long campId,
            @RequestBody Supply supply) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supplyService.addSupply(campId, supply));
    }

    @GetMapping("/{campId}/inventory")
    public ResponseEntity<List<Supply>> getInventory(
            @PathVariable Long campId) {

        return ResponseEntity.ok(
                supplyService.getInventory(campId)
        );
    }
}