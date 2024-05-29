package documents.entity;

import java.util.List;

public interface DocService {
    List<DocDTO> getAllDocs();
    DocDTO getDocById(Long id);
    void addDoc(DocDTO docDTO);
    void updateDoc(Long id, DocDTO updatedDocDTO);
    void deleteDoc(Long id);
}