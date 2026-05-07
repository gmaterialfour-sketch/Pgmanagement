package com.pgrental.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "pgs", indexes = {
    @Index(name = "idx_pg_coords", columnList = "lat, lng"),
    @Index(name = "idx_pg_rent", columnList = "rent")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pg {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_phone")
    private String ownerPhone;

    @Column(nullable = false)
    private Integer rent;

    @Column(nullable = false)
    private Integer deposit;

    @Column(name = "food_rating")
    private Double foodRating = 0.0;

    @Column(name = "safety_rating")
    private Double safetyRating = 0.0;

    @Column(name = "overall_rating")
    private Double overallRating = 0.0;

    @ElementCollection
    @CollectionTable(name = "pg_amenities", joinColumns = @JoinColumn(name = "pg_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    private Boolean verified = false;

    @Column(name = "place_id")
    private String placeId;

    @Column(name = "google_rating")
    private Double googleRating;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "google_reviews")
    private List<Map<String, Object>> googleReviews;

    @Column(name = "google_fetched_at")
    private LocalDateTime googleFetchedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL)
    private List<RoomInventory> rooms;

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL)
    private List<NearbyInfrastructure> infrastructure;

    @Transient
    private Double distance;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
