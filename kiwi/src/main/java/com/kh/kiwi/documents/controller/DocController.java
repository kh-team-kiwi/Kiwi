package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.dto.CommentDto;
import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.entity.ApprovalLine;
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

    public DocController(DocService docService) {
        this.docService = docService;
    }

    @GetMapping
    public List<Doc> selectAllList() {
        return docService.selectAllList();
    }

    @GetMapping("/{id}")
    public Doc getDocById(@PathVariable Long id) {
        return docService.getDocById(id);
    }

    @PostMapping
    public ResponseEntity<String> addDoc(
            @RequestPart("doc") Doc doc,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {

        // 기본 설정 로직 확인
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
        // 보존 기간과 보안 등급 기본값 설정
        if (doc.getRetentionPeriod() == null || doc.getRetentionPeriod().trim().isEmpty()) {
            doc.setRetentionPeriod("1년");
        }
        if (doc.getAccessLevel() == null) {
            doc.setAccessLevel(Doc.AccessLevel.C);
        }

        docService.addDoc(doc);
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

    // 모든 문서를 조회하는 엔드포인트
    @GetMapping("/all-documents")
    public List<Doc> getAllDocuments() {
        return docService.selectAllList();
    }

    // 문서 번호로 문서 상세 정보를 가져오는 엔드포인트 추가
    @GetMapping("/details/{docNum}")
    public ResponseEntity<Doc> getDocDetailsByDocNum(@PathVariable Long docNum) {
        Doc doc = docService.getDocByDocNum(docNum);
        return ResponseEntity.ok(doc);
    }

    // 모든 결재선 정보를 조회하는 엔드포인트
    @GetMapping("/all-approval-lines")
    public List<ApprovalLine> getAllApprovalLines() {
        return docService.getAllApprovalLines();
    }

    // 댓글 추가 엔드포인트
    @PostMapping("/{docNum}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long docNum, @RequestBody CommentDto commentDto) {
        try {
            docService.addComment(docNum, commentDto);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 추가에 실패하였습니다.");
        }
    }

    // 문서 상태별로 문서를 가져오는 엔드포인트 추가
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