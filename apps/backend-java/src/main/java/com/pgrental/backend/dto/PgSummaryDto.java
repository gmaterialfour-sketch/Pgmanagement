package com.pgrental.backend.dto;

import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.entity.RoomInventory;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PgSummaryDto {
    private String id;
    private String name;
    private String address;
    private Double lat;
    private Double lng;
    private String ownerName;
    private Integer rent;
    private Integer deposit;
    private Ratings ratings;
    private Rooms rooms;
    private List<String> amenities;
    private Boolean verified;
    private Double distanceKm;

    @Data
    @Builder
    public static class Ratings {
        private Double food;
        private Double safety;
        private Double overall;
    }

    @Data
    @Builder
    public static class Rooms {
        private Integer total;
        private Integer occupied;
        private Integer available;
        private List<RoomInventory.RoomType> types;
    }

    public static PgSummaryDto fromEntity(Pg pg) {
        int total = pg.getRooms() != null ? pg.getRooms().stream().mapToInt(RoomInventory::getTotal).sum() : 0;
        int occupied = pg.getRooms() != null ? pg.getRooms().stream().mapToInt(RoomInventory::getOccupied).sum() : 0;
        
        return PgSummaryDto.builder()
                .id(pg.getId())
                .name(pg.getName())
                .address(pg.getAddress())
                .lat(pg.getLat())
                .lng(pg.getLng())
                .ownerName(pg.getOwnerName())
                .rent(pg.getRent())
                .deposit(pg.getDeposit())
                .ratings(Ratings.builder()
                        .food(pg.getFoodRating())
                        .safety(pg.getSafetyRating())
                        .overall(pg.getOverallRating())
                        .build())
                .rooms(Rooms.builder()
                        .total(total)
                        .occupied(occupied)
                        .available(total - occupied)
                        .types(pg.getRooms() != null ? pg.getRooms().stream().map(RoomInventory::getType).distinct().toList() : java.util.Collections.emptyList())
                        .build())
                .amenities(pg.getAmenities())
                .verified(pg.getVerified())
                .distanceKm(pg.getDistance())
                .build();
    }
}
