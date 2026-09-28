package com.example.reliefcamp.Controller;

import com.example.reliefcamp.Model.Family;
import com.example.reliefcamp.Service.FamilyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camps")
@CrossOrigin(origins = "*")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping("/{campId}/families")
    public ResponseEntity<Family> registerFamily(
            @PathVariable Long campId,
            @RequestBody Family family) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(familyService.registerFamily(campId, family));
    }

    @GetMapping("/{campId}/families")
    public ResponseEntity<List<Family>> getFamilies(
            @PathVariable Long campId) {

        return ResponseEntity.ok(
                familyService.getFamiliesByCamp(campId)
        );
    }
}