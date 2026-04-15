package com.bitaqa.repository;

import com.bitaqa.domain.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {

    List<SocialLink> findAllByProfileId(Long profileId);

    Optional<SocialLink> findByIdAndProfileId(Long id, Long profileId);

    int countByProfileId(Long profileId);
}
