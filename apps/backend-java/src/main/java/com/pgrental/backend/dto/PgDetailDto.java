package com.pgrental.backend.dto;

import com.pgrental.backend.entity.NearbyInfrastructure;
import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.entity.RoomInventory;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class PgDetailDto {
    private String id;
    private String name;
    private String address;
    private Double lat;
    private Double lng;
    private String ownerName;
    private Integer rent;
    private Integer deposit;
    private PgSummaryDto.Ratings ratings;
    private PgSummaryDto.Rooms rooms;
    private List<String> amenities;
    private Boolean verified;
    private Double distanceKm;
    private String placeId;
    private String description;
    private List<InfrastructureDto> infrastructure;
    private Double googleRating;
    private List<Map<String, Object>> googleReviews;

    @Data
    @Builder
    public static class InfrastructureDto {
        private String type;
        private String name;
        private Double distanceKm;
    }

    public static PgDetailDto fromEntity(Pg pg) {
        int total = pg.getRooms().stream().mapToInt(RoomInventory::getTotal).sum();
        int occupied = pg.getRooms().stream().mapToInt(RoomInventory::getOccupied).sum();

        return PgDetailDto.builder()
                .id(pg.getId())
                .name(pg.getName())
                .address(pg.getAddress())
                .lat(pg.getLat())
                .lng(pg.getLng())
                .ownerName(pg.getOwnerName())
                .rent(pg.getRent())
                .deposit(pg.getDeposit())
                .ratings(PgSummaryDto.Ratings.builder()
                        .food(pg.getFoodRating())
                        .safety(pg.getSafetyRating())
                        .overall(pg.getOverallRating())
                        .build())
                .rooms(PgSummaryDto.Rooms.builder()
                        .total(total)
                        .occupied(occupied)
                        .available(total - occupied)
                        .types(pg.getRooms().stream().map(RoomInventory::getType).distinct().toList())
                        .build())
                .amenities(pg.getAmenities())
                .verified(pg.getVerified())
                .distanceKm(pg.getDistance())
                .placeId(pg.getPlaceId())
                .description(pg.getDescription())
                .infrastructure(pg.getInfrastructure().stream()
                        .map(infra -> InfrastructureDto.builder()
                                .type(infra.getType())
                                .name(infra.getName())
                                .distanceKm(infra.getDistanceKm())
                                .build())
                        .toList())
                .googleRating(pg.getGoogleRating())
                .googleReviews(pg.getGoogleReviews())
                .build();
    }
}
