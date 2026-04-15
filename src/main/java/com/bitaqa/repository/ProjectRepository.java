package com.bitaqa.repository;

import com.bitaqa.domain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByProfileIdOrderByDisplayOrderAsc(Long profileId);

    Optional<Project> findByIdAndProfileId(Long id, Long profileId);

    int countByProfileId(Long profileId);

    @Query("SELECT COALESCE(MAX(p.displayOrder), -1) FROM Project p WHERE p.profile.id = :profileId")
    int findMaxDisplayOrderByProfileId(@Param("profileId") Long profileId);
}
