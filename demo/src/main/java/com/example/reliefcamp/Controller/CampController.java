package com.example.reliefcamp.Controller;

import com.example.reliefcamp.Model.Camp;
import com.example.reliefcamp.Service.CampService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camps")
@CrossOrigin(origins = "*")
public class CampController {

    private final CampService campService;

    public CampController(CampService campService) {
        this.campService = campService;
    }

   @GetMapping("/{id}")
public ResponseEntity<Camp> getCampById(@PathVariable Long id) {
    return ResponseEntity.ok(campService.getCampById(id));
}

@PostMapping
public ResponseEntity<Camp> createCamp(@RequestBody Camp camp) {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(campService.createCamp(camp));
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteCamp(@PathVariable Long id) {
    campService.deleteCamp(id);
    return ResponseEntity.noContent().build();
}
}