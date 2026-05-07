package com.pgrental.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Verification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pg_id")
    private String pgId;

    @Column(name = "proof_url", nullable = false)
    private String proofUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.PENDING;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED;

        public String toDbValue() {
            return name().toLowerCase();
        }

        public static VerificationStatus fromDbValue(String value) {
            return VerificationStatus.valueOf(value.toUpperCase());
        }
    }

    @Converter(autoApply = true)
    public static class VerificationStatusConverter implements AttributeConverter<VerificationStatus, String> {
        @Override
        public String convertToDatabaseColumn(VerificationStatus attribute) {
            return attribute == null ? null : attribute.toDbValue();
        }

        @Override
        public VerificationStatus convertToEntityAttribute(String dbData) {
            return dbData == null ? null : VerificationStatus.fromDbValue(dbData);
        }
    }
}
