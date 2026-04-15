package com.bitaqa.repository;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.enums.ProfileVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUsername(String username);

    Optional<Profile> findByUserId(Long userId);

    boolean existsByUsername(String username);

    /**
     * Eagerly fetch all public-facing collections in a single query
     * to avoid LazyInitializationException outside of a transaction.
     */
    @Query("SELECT DISTINCT p FROM Profile p " +
           "LEFT JOIN FETCH p.skills " +
           "LEFT JOIN FETCH p.projects " +
           "LEFT JOIN FETCH p.socialLinks " +
           "WHERE p.username = :username")
    Optional<Profile> findByUsernameWithCollections(@Param("username") String username);

    @Modifying
    @Query("UPDATE Profile p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
