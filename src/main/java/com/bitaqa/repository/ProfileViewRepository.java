package com.bitaqa.repository;

import com.bitaqa.domain.entity.ProfileView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProfileViewRepository extends JpaRepository<ProfileView, Long> {

    long countByProfileId(Long profileId);

    long countByProfileIdAndViewedAtBetween(Long profileId, LocalDateTime from, LocalDateTime to);

    boolean existsByProfileIdAndIpAddressAndViewedAtAfter(Long profileId, String ipAddress, LocalDateTime since);

    @Query(value = """
            SELECT DATE(v.viewed_at) as view_date, COUNT(v.id) as view_count
            FROM profile_views v
            WHERE v.profile_id = :profileId
              AND v.viewed_at >= :since
            GROUP BY DATE(v.viewed_at)
            ORDER BY view_date ASC
            """, nativeQuery = true)
    List<Object[]> getDailyViewsForProfile(@Param("profileId") Long profileId, @Param("since") LocalDateTime since);
}
