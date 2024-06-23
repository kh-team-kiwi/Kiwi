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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // 문서 상태별 문서를 가져오는 메서드
    public List<Doc> getDocumentsByStatus(Doc.DocStatus status) {
        return docRepository.findByDocStatus(status);
    }

    public Map<String, Long> getCountByStatus() {
        long inProgressCount = docRepository.countByDocStatus(Doc.DocStatus.진행중);
        long completedCount = docRepository.countByDocStatus(Doc.DocStatus.완료);
        long rejectedCount = docRepository.countByDocStatus(Doc.DocStatus.반려);

        Map<String, Long> countMap = new HashMap<>();
        countMap.put("진행중", inProgressCount);
        countMap.put("완료", completedCount);
        countMap.put("반려", rejectedCount);
        countMap.put("전체", inProgressCount + completedCount + rejectedCount);

        return countMap;
    }


    public Doc getDocById(Long id) {
        return docRepository.findById(id).orElse(null);
    }

    public void addDoc(Doc doc) {
        if (doc.getEmployeeNo() == null || doc.getEmployeeNo().trim().isEmpty()) {
            doc.setEmployeeNo("1@kimcs");
        }

        if (doc.getDocTitle() == null || doc.getDocTitle().trim().isEmpty()) {
            doc.setDocTitle("제목을 불러오지 못했습니다.s");
        }

        if (doc.getName() == null || doc.getName().trim().isEmpty()) {
            MemberDetails memberDetails = memberDetailsRepository.findById(doc.getEmployeeNo())
                    .orElseThrow(() -> new RuntimeException("사원 정보를 찾을 수 없습니다."));
            doc.setName(memberDetails.getName());
        }

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
