package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.service.MemberDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberDetailsController {

    @Autowired
    private MemberDetailsService service;

    @PostMapping
    public MemberDetails createMember(@RequestBody MemberDetails memberDetails) {
        return service.save(memberDetails);
    }

    @GetMapping
    public List<MemberDetails> getAllMembers() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public MemberDetails getMemberById(@PathVariable String id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable String id) {
        service.delete(id);
    }
}