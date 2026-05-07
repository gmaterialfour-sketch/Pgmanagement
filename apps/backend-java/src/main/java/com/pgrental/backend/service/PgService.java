package com.pgrental.backend.service;

import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.repository.PgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PgService {
    private final PgRepository pgRepository;
    private final GoogleMapsService googleMapsService;

    @Transactional(readOnly = true)
    public Page<Pg> getNearbyPgs(Double lat, Double lng, Integer page, Integer limit) {
        return pgRepository.findNearby(lat, lng, 2.0, PageRequest.of(page - 1, limit));
    }

    @Transactional
    public Pg getPgById(String id) {
        Pg pg = pgRepository.findById(id).orElseThrow(() -> new RuntimeException("PG not found"));
        
        // Sync with Google if stale (e.g. 24 hours)
        if (pg.getPlaceId() != null && (pg.getGoogleFetchedAt() == null || pg.getGoogleFetchedAt().isBefore(LocalDateTime.now().minusHours(24)))) {
            syncWithGoogle(pg);
        }
        
        return pg;
    }

    private void syncWithGoogle(Pg pg) {
        googleMapsService.getPlaceDetails(pg.getPlaceId()).subscribe(details -> {
            if (details != null && !details.isEmpty()) {
                pg.setGoogleRating((Double) details.get("rating"));
                pg.setGoogleReviews((List<Map<String, Object>>) details.get("reviews"));
                pg.setGoogleFetchedAt(LocalDateTime.now());
                pgRepository.save(pg);
            }
        });
    }
}
