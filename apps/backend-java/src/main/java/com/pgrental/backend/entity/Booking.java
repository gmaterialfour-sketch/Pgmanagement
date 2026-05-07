package com.pgrental.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_pg_status", columnList = "pg_id, status"),
    @Index(name = "idx_booking_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pg_id", nullable = false)
    private Pg pg;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomInventory.RoomType roomType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum BookingStatus {
        CONFIRMED, CANCELLED;

        public String toDbValue() {
            return name().toLowerCase();
        }

        public static BookingStatus fromDbValue(String value) {
            return BookingStatus.valueOf(value.toUpperCase());
        }
    }

    @Converter(autoApply = true)
    public static class BookingStatusConverter implements AttributeConverter<BookingStatus, String> {
        @Override
        public String convertToDatabaseColumn(BookingStatus attribute) {
            return attribute == null ? null : attribute.toDbValue();
        }

        @Override
        public BookingStatus convertToEntityAttribute(String dbData) {
            return dbData == null ? null : BookingStatus.fromDbValue(dbData);
        }
    }
}
