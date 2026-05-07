package com.pgrental.backend.service;

import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.repository.PgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PgService {
    private final PgRepository pgRepository;

    @Transactional(readOnly = true)
    public Page<Pg> getNearbyPgs(Double lat, Double lng, Integer page, Integer limit) {
        return pgRepository.findNearby(lat, lng, 2.0, PageRequest.of(page - 1, limit));
    }

    public Pg getPgById(String id) {
        return pgRepository.findById(id).orElseThrow(() -> new RuntimeException("PG not found"));
    }
}
