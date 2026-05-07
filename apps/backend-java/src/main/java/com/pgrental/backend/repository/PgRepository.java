package com.pgrental.backend.repository;

import com.pgrental.backend.entity.Pg;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PgRepository extends JpaRepository<Pg, String> {
    
    @Query(value = "SELECT p.*, " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat)))) AS distance " +
           "FROM pgs p " +
           "WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat)))) <= :radius " +
           "ORDER BY distance ASC",
           countQuery = "SELECT count(*) FROM pgs p " +
           "WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat)))) <= :radius",
           nativeQuery = true)
    Page<Pg> findNearby(@Param("lat") Double lat, @Param("lng") Double lng, @Param("radius") Double radius, Pageable pageable);
}
