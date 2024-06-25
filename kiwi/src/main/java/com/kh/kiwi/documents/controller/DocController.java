package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.dto.CommentDto;
import com.kh.kiwi.documents.entity.*;
import com.kh.kiwi.documents.dto.ApprovalLineDto;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
import com.kh.kiwi.documents.service.DocService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
public class DocController {
    private final DocService docService;
    private final MemberDetailsRepository memberDetailsRepository;

    public DocController(DocService docService, MemberDetailsRepository memberDetailsRepository) {
        this.docService = docService;
        this.memberDetailsRepository = memberDetailsRepository;
    }

    @GetMapping
    public List<Doc> selectAllList() {
        return docService.selectAllList();
    }

    @GetMapping("/{id}")
    public Doc getDocById(@PathVariable Long id) {
        return docService.getDocById(id);
    }

    @GetMapping("/details/{docNum}")
    public ResponseEntity<Doc> getDocWithDetails(@PathVariable Long docNum) {
        Doc doc = docService.getDocWithApprovalAndReferences(docNum);

        if (doc != null) {
            List<ApprovalLine> approvalLines = doc.getApprovalLines();
            if (approvalLines != null) {
                approvalLines.forEach(approvalLine -> {
                    MemberDetails memberDetails = memberDetailsRepository.findByEmployeeNo(approvalLine.getEmployeeNo());
                    if (memberDetails != null) {
                        approvalLine.setEmployeeName(memberDetails.getName());
                        approvalLine.setDeptName(memberDetails.getDeptName());
                        approvalLine.setPosition(memberDetails.getPosition());
                    }
                });
            }

            List<DocReferrer> references = doc.getReferences();
            if (references != null) {
                references.forEach(reference -> {
                    MemberDetails memberDetails = memberDetailsRepository.findByEmployeeNo(reference.getEmployeeNo());
                    if (memberDetails != null) {
                        reference.setEmployeeName(memberDetails.getName());
                        reference.setDeptName(memberDetails.getDeptName());
                        reference.setPosition(memberDetails.getPosition());
                    }
                });
            }

            List<CommentDto> comments = docService.getCommentsWithAuthor(doc);
            doc.setCommentDtos(comments);

            return ResponseEntity.ok(doc);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addDoc(
            @RequestPart("doc") Doc doc,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment,
            @RequestPart(value = "approvalLine", required = false) ApprovalLineDto approvalLine) {

        if (doc.getEmployeeNo() == null || doc.getEmployeeNo().trim().isEmpty()) {
            doc.setEmployeeNo("1@kimcs");
        }
        if (doc.getDocTitle() == null || doc.getDocTitle().trim().isEmpty()) {
            doc.setDocTitle("제목을 불러오지 못했습니다.");
        }
        if (doc.getName() == null || doc.getName().trim().isEmpty()) {
            doc.setName("이름없음");
        }
        if (doc.getDocContents() == null || doc.getDocContents().trim().isEmpty()) {
            doc.setDocContents("내용 없음");
        }
        if (doc.getRetentionPeriod() == null || doc.getRetentionPeriod().trim().isEmpty()) {
            doc.setRetentionPeriod("1년");
        }
        if (doc.getAccessLevel() == null) {
            doc.setAccessLevel(Doc.AccessLevel.C);
        }

        docService.addDoc(doc);

        if (approvalLine != null) {
            docService.saveApprovalLine(doc, approvalLine);
        }

        return new ResponseEntity<>("문서가 성공적으로 저장되었습니다.", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public void updateDoc(@PathVariable Long id, @RequestBody Doc updatedDoc) {
        docService.updateDoc(id, updatedDoc);
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        docService.deleteDoc(id);
    }

    @GetMapping("/all-documents")
    public List<Doc> getAllDocuments() {
        return docService.selectAllList();
    }

    @GetMapping("/all-approval-lines")
    public List<ApprovalLine> getAllApprovalLines() {
        return docService.getAllApprovalLines();
    }

    @PostMapping("/{docNum}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long docNum, @RequestBody CommentDto commentDto) {
        try {
            Comment comment = docService.addComment(docNum, commentDto);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody CommentDto commentDto) {
        try {
            Comment updatedComment = docService.updateComment(id, commentDto);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            docService.deleteComment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Doc>> getDocumentsByStatus(@PathVariable String status) {
        try {
            Doc.DocStatus docStatus = Doc.DocStatus.valueOf(status.toUpperCase());
            List<Doc> documents = docService.getDocumentsByStatus(docStatus);
            return ResponseEntity.ok(documents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/completed")
    public List<Doc> getCompletedDocuments() {
        return docService.getDocumentsByStatus(Doc.DocStatus.완료);
    }

    @GetMapping("/rejected")
    public List<Doc> getRejectedDocuments() {
        return docService.getDocumentsByStatus(Doc.DocStatus.반려);
    }

    @GetMapping("/count-by-status")
    public ResponseEntity<Map<String, Long>> getCountByStatus() {
        Map<String, Long> countMap = docService.getCountByStatus();
        return ResponseEntity.ok(countMap);
    }
}