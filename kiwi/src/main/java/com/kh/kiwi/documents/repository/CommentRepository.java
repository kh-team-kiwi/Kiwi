package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
