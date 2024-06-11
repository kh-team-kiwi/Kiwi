package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.entity.Doc;
import com.kh.kiwi.documents.repository.DocRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocService {
    private final DocRepository docRepository;

    public DocService(DocRepository docRepository) {
        this.docRepository = docRepository;
    }

    public List<Doc> selectAllList() {
        return docRepository.findAll();
    }

    public List<Doc> selectByUser(String creComEmpNum) {
        return docRepository.findByCreComEmpNum(creComEmpNum);
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
            existingDoc.setDocType(updatedDoc.getDocType());
            existingDoc.setDocTitle(updatedDoc.getDocTitle());
            existingDoc.setDocDate(updatedDoc.getDocDate());
            docRepository.save(existingDoc);
        }
    }

    public void deleteDoc(Long id) {
        docRepository.deleteById(id);
    }
}