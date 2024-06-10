package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.DocDto;
import com.kh.kiwi.documents.dto.DocListDto;
import com.kh.kiwi.documents.mapper.DocMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocService {
    private List<DocDto> docs = new ArrayList<>();
    private final DocMapper docMapper;

    public DocService(DocMapper docMapper) {
        this.docMapper = docMapper;
    }

    // select list - all
    public List<DocListDto> selectAllList() {
        return docMapper.selectAllList();
    }

    public List<DocDto> selectByUser(String creComEmpNum) {
        return docMapper.selectByUser(creComEmpNum);
    }

    public DocDto getDocById(Long id) {
        return docs.stream().filter(doc -> doc.getDocNum() == id).findFirst().orElse(null);
    }

    public void addDoc(DocDto docDTO) {
        docs.add(docDTO);
    }

    public void updateDoc(Long id, DocDto updatedDocDTO) {
        DocDto doc = getDocById(id);
        if (doc != null) {
            doc.setDocType(updatedDocDTO.getDocType());
            doc.setDocTitle(updatedDocDTO.getDocTitle());
            doc.setDocDate(updatedDocDTO.getDocDate());
        }
    }

    public void deleteDoc(Long id) {
        docs.removeIf(doc -> doc.getDocNum() == id);
    }
}