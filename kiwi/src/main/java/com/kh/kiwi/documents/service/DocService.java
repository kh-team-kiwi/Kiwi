package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.DocDto;
import com.kh.kiwi.documents.dto.DocListDto;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocService {
    private List<DocDto> docs = new ArrayList<>();

    // select list - all
    public List<DocListDto> selectAllList() {
        List<DocListDto> result = null;
//        SqlSession session = getSqlSession();
//        result = dao.selectAllList(session);
//        session.close();

        return result;
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