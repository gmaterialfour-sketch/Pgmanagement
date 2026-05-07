package com.pgrental.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"pg_id", "type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "pg_id", nullable = false)
    private Pg pg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false)
    private Integer occupied = 0;

    @Column(nullable = false)
    private Integer rent;

    public enum RoomType {
        SINGLE, DOUBLE, TRIPLE;

        public String toDbValue() {
            return name().toLowerCase();
        }

        public static RoomType fromDbValue(String value) {
            return RoomType.valueOf(value.toUpperCase());
        }
    }

    @Converter(autoApply = true)
    public static class RoomTypeConverter implements AttributeConverter<RoomType, String> {
        @Override
        public String convertToDatabaseColumn(RoomType attribute) {
            return attribute == null ? null : attribute.toDbValue();
        }

        @Override
        public RoomType convertToEntityAttribute(String dbData) {
            return dbData == null ? null : RoomType.fromDbValue(dbData);
        }
    }
}
