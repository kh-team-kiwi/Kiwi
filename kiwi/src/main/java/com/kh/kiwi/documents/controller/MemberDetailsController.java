package com.kh.kiwi.documents.controller;

import com.kh.kiwi.auth.dto.ResponseDto;
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

    @GetMapping("/details/{memberId}")
    public ResponseEntity<MemberDetailsDTO> getMemberDetailsByMemberId(@PathVariable String memberId) {
        MemberDetailsDTO memberDetailsDTO = memberDetailsService.getMemberDetailsByMemberId(memberId);
        if (memberDetailsDTO != null) {
            return ResponseEntity.ok(memberDetailsDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/details/by-employee-no/{employeeNo}")
    public ResponseEntity<MemberDetailsDTO> getMemberDetailsByEmployeeNo(@PathVariable String employeeNo) {
        MemberDetailsDTO memberDetailsDTO = memberDetailsService.getMemberDetailsByEmployeeNo(employeeNo);
        if (memberDetailsDTO != null) {
            return ResponseEntity.ok(memberDetailsDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/details/{employeeNo}")
    public ResponseEntity<String> updateMemberDetails(@PathVariable String employeeNo, @RequestBody MemberDetailsDTO memberDetailsDTO) {
        System.out.println("Update request received for employeeNo: " + employeeNo);
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

    @PostMapping("/api/members/details/")
    public ResponseDto<?> memberDetails(@RequestBody MemberDetailsDTO requestBody) {
        ResponseDto<?> result = memberDetailsService.memberDetails(requestBody.getEmployeeNo());
        return result;
    }
    @GetMapping("/details/team/{teamId}")
    public ResponseEntity<List<MemberDetailsDTO>> getMembersByTeamId(@PathVariable String teamId) {
        List<MemberDetailsDTO> memberDetailsList = memberDetailsService.getMembersByTeamId(teamId);
        return ResponseEntity.ok(memberDetailsList);
    }
}
