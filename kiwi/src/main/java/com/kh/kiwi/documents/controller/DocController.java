package documents.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/docs")
public class DocController {
    private final DocService docService;

    public DocController(DocService docService) {
        this.docService = docService;
    }

    @GetMapping
    public List<DocDTO> getAllDocs() {
        return docService.getAllDocs();
    }

    @GetMapping("/{id}")
    public DocDTO getDocById(@PathVariable Long id) {
        return docService.getDocById(id);
    }

    @PostMapping
    public void addDoc(@RequestBody DocDTO docDTO) {
        docService.addDoc(docDTO);
    }

    @PutMapping("/{id}")
    public void updateDoc(@PathVariable Long id, @RequestBody DocDTO updatedDocDTO) {
        docService.updateDoc(id, updatedDocDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteDoc(@PathVariable Long id) {
        docService.deleteDoc(id);
    }
}
