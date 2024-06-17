package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.CommentDto;
import com.kh.kiwi.documents.entity.Comment;
import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.entity.ApprovalLine;
import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.repository.CommentRepository;
import com.kh.kiwi.documents.repository.DocRepository;
import com.kh.kiwi.documents.repository.ApprovalLineRepository;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

    // 기존 메서드들

@Service
public class DocService {

    private final DocRepository docRepository;
    private final ApprovalLineRepository approvalLineRepository;
    private final CommentRepository commentRepository;
    private final MemberDetailsRepository memberDetailsRepository;

    public DocService(DocRepository docRepository, ApprovalLineRepository approvalLineRepository, CommentRepository commentRepository, MemberDetailsRepository memberDetailsRepository) {
        this.docRepository = docRepository;
        this.approvalLineRepository = approvalLineRepository;
        this.commentRepository = commentRepository;
        this.memberDetailsRepository = memberDetailsRepository;
    }

    public List<Doc> selectAllList() {
        return docRepository.findAll();
    }

    public Doc getDocById(Long id) {
        return docRepository.findById(id).orElse(null);
    }

    public void addDoc(Doc doc) {
        docRepository.save(doc);
    }

    public void updateDoc(Long id, Doc updatedDoc) {
        Doc existingDoc = docRepository.findById(id).orElse(null);
        if (existingDoc != null) {
            existingDoc.setDocTitle(updatedDoc.getDocTitle());
            existingDoc.setDocContents(updatedDoc.getDocContents());
            existingDoc.setDocStatus(updatedDoc.getDocStatus());
            docRepository.save(existingDoc);
        }
    }

    public void deleteDoc(Long id) {
        docRepository.deleteById(id);
    }

    public List<ApprovalLine> getAllApprovalLines() {
        return approvalLineRepository.findAll();
    }

    public Doc getDocByDocNum(Long docNum) {
        return docRepository.findByDocNum(docNum);
    }


    public void addComment(Long docNum, CommentDto commentDto) {
        Doc doc = docRepository.findByDocNum(docNum);
        if (doc == null) {
            throw new EntityNotFoundException("해당 문서를 찾을 수 없습니다.");
        }

        // 사원 번호로 MemberDetails를 조회
        MemberDetails employee = memberDetailsRepository.findById(commentDto.getEmployeeNo())
                .orElseThrow(() -> new EntityNotFoundException("해당 사원을 찾을 수 없습니다."));

        Comment comment = new Comment();
        comment.setDoc(doc);
        comment.setContent(commentDto.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setEmployee(employee); // 사원 정보 설정

        commentRepository.save(comment);
    }
}
