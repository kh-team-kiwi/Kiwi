package com.kh.kiwi.aram.repository;

import com.kh.kiwi.aram.entity.Aram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AramRepository extends JpaRepository<Aram, String> {
}
