package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.DocDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocService {

    public List<DocDto> getAllDocs() {
        return null;
    }

    public DocDto getDocById(Long id) {
        return null;
    }

    public String addDoc(DocDto docDto){
        return "";
    };

    public void updateDoc(Long id, DocDto updatedDocDto) {

    }

    public void deleteDoc(Long id) {

    }
}