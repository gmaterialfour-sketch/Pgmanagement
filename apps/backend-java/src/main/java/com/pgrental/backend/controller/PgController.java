package com.pgrental.backend.controller;

import com.pgrental.backend.dto.PgDetailDto;
import com.pgrental.backend.dto.PgSummaryDto;
import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.service.PgService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pgs")
@RequiredArgsConstructor
@CrossOrigin
public class PgController {
    private final PgService pgService;

    @GetMapping("/nearby")
    public Map<String, Object> getNearby(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer limit) {
        Page<Pg> pgPage = pgService.getNearbyPgs(lat, lng, page, limit);
        return Map.of(
            "data", pgPage.getContent().stream()
                    .map(PgSummaryDto::fromEntity)
                    .collect(Collectors.toList()),
            "page", page,
            "total", pgPage.getTotalElements()
        );
    }

    @GetMapping("/{id}")
    public PgDetailDto getById(@PathVariable String id) {
        return PgDetailDto.fromEntity(pgService.getPgById(id));
    }
}
