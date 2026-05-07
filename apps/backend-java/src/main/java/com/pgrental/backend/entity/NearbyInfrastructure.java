package com.pgrental.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nearby_infrastructure")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyInfrastructure {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "pg_id", nullable = false)
    private Pg pg;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String name;

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "place_id")
    private String placeId;
}
