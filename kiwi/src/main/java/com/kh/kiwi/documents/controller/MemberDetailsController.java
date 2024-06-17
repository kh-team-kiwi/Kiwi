package com.kh.kiwi.documents.controller;

import com.kh.kiwi.documents.dto.MemberDetailsDTO;
import com.kh.kiwi.documents.service.MemberDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
public class MemberDetailsController {

    private final MemberDetailsService memberDetailsService;

    @Autowired
    public MemberDetailsController(MemberDetailsService memberDetailsService) {
        this.memberDetailsService = memberDetailsService;
    }

    @PostMapping("/details")
    public ResponseEntity<String> saveMemberDetails(@RequestBody MemberDetailsDTO memberDetailsDTO) {
        memberDetailsService.saveMemberDetails(memberDetailsDTO);
        return ResponseEntity.ok("Member details saved successfully");
    }

    @GetMapping("/details/{employeeNo}")
    public ResponseEntity<MemberDetailsDTO> getMemberDetails(@PathVariable String employeeNo) {
        MemberDetailsDTO memberDetailsDTO = memberDetailsService.getMemberDetailsByEmployeeNo(employeeNo);
        if (memberDetailsDTO != null) {
            return ResponseEntity.ok(memberDetailsDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/details/{employeeNo}")
    public ResponseEntity<String> updateMemberDetails(@PathVariable String employeeNo, @RequestBody MemberDetailsDTO memberDetailsDTO) {
        memberDetailsService.updateMemberDetails(employeeNo, memberDetailsDTO);
        return ResponseEntity.ok("Member details updated successfully");
    }

    @DeleteMapping("/details/{employeeNo}")
    public ResponseEntity<String> deleteMemberDetails(@PathVariable String employeeNo) {
        memberDetailsService.deleteMemberDetails(employeeNo);
        return ResponseEntity.ok("Member details deleted successfully");
    }

    @GetMapping("/details")
    public ResponseEntity<List<MemberDetailsDTO>> getAllMembers() {
        List<MemberDetailsDTO> memberDetailsList = memberDetailsService.getAllMembers();
        return ResponseEntity.ok(memberDetailsList);
    }
}
