package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.Comment;
import com.kh.kiwi.documents.entity.Doc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
        List<Comment> findByDoc(Doc doc);
}
