package com.bitaqa.repository;

import com.bitaqa.domain.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByProfileId(Long profileId);

    Optional<Skill> findByIdAndProfileId(Long id, Long profileId);

    int countByProfileId(Long profileId);
}
