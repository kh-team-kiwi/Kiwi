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

    public List<Doc> selectByUser(String employeeNo) {
        return docRepository.findByEmployeeNo(employeeNo);
    }

    public Doc getDocById(Long id) {
        return docRepository.findById(id).orElse(null);
    }

    public void addDoc(Doc doc) {
        docRepository.save(doc);
    }

    public void updateDoc(Long id, Doc updatedDoc) {
        Doc existingDoc = getDocById(id);
        if (existingDoc != null) {
            existingDoc.setDocTitle(updatedDoc.getDocTitle());
            existingDoc.setDocStatus(updatedDoc.getDocStatus());
            existingDoc.setDocDate(updatedDoc.getDocDate());
            existingDoc.setDocCompletion(updatedDoc.getDocCompletion());
            existingDoc.setDocContents(updatedDoc.getDocContents());
            existingDoc.setName(updatedDoc.getName());
            existingDoc.setScheduledDeletionDate(updatedDoc.getScheduledDeletionDate());
            existingDoc.setDocType(updatedDoc.getDocType());
            existingDoc.setEmployeeNo(updatedDoc.getEmployeeNo());
            docRepository.save(existingDoc);
        }
    }

    public void deleteDoc(Long id) {
        docRepository.deleteById(id);
    }

    // 모든 결재선 정보를 가져오는 메서드
    public List<ApprovalLine> getAllApprovalLines() {
        return approvalLineRepository.findAll();
    }
}
