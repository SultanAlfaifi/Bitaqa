package com.bitaqa.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "profile_views", indexes = {
        @Index(name = "idx_profile_view_profile_id", columnList = "profile_id"),
        @Index(name = "idx_profile_view_viewed_at", columnList = "viewedAt"),
        @Index(name = "idx_profile_view_ip_profile", columnList = "profile_id, ipAddress, viewedAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime viewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @PrePersist
    protected void onCreate() {
        if (viewedAt == null) {
            viewedAt = LocalDateTime.now();
        }
    }
}
