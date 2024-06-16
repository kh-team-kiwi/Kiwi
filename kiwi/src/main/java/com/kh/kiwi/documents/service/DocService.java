package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.entity.ApprovalLine;
import com.kh.kiwi.documents.repository.DocRepository;
import com.kh.kiwi.documents.repository.ApprovalLineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocService {

    private final DocRepository docRepository;
    private final ApprovalLineRepository approvalLineRepository;

    public DocService(DocRepository docRepository, ApprovalLineRepository approvalLineRepository) {
        this.docRepository = docRepository;
        this.approvalLineRepository = approvalLineRepository;
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
            // 업데이트 로직
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
}
