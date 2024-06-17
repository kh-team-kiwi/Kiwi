package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.dto.CommentDto;
import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.entity.ApprovalLine;
import com.kh.kiwi.documents.service.DocService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void addDoc(@RequestBody Doc doc) {
        docService.addDoc(doc);
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 추가에 실패하였습니다.");
        }
    }

}
