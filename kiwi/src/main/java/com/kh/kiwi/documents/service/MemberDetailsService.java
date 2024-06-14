package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.MemberDetailsDTO;
import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberDetailsService {

    private final MemberDetailsRepository memberDetailsRepository;

    @Autowired
    public MemberDetailsService(MemberDetailsRepository memberDetailsRepository) {
        this.memberDetailsRepository = memberDetailsRepository;
    }

    public List<MemberDetailsDTO> getAllMembers() {
        List<MemberDetails> memberDetailsList = memberDetailsRepository.findAll();
        return memberDetailsList.stream()
                .map(MemberDetailsDTO::new)
                .collect(Collectors.toList());
    }

    public void saveMemberDetails(MemberDetailsDTO memberDetailsDTO) {
        MemberDetails memberDetails = convertToEntity(memberDetailsDTO);
        memberDetailsRepository.save(memberDetails);
    }

    public MemberDetailsDTO getMemberDetailsByEmployeeNo(String employeeNo) {
        Optional<MemberDetails> optionalMemberDetails = memberDetailsRepository.findById(employeeNo);
        return optionalMemberDetails.map(MemberDetailsDTO::new).orElse(null);
    }

    public void updateMemberDetails(String employeeNo, MemberDetailsDTO memberDetailsDTO) {
        MemberDetails existingMemberDetails = memberDetailsRepository.findById(employeeNo)
                .orElseThrow(() -> new RuntimeException("Member details not found for employeeNo: " + employeeNo));

        // Update the existing member details entity with values from DTO
        existingMemberDetails.setName(memberDetailsDTO.getName());
        existingMemberDetails.setGender(memberDetailsDTO.getGender());
        existingMemberDetails.setBirthDate(LocalDateTime.parse(memberDetailsDTO.getBirthDate()));
        existingMemberDetails.setEmpDate(LocalDateTime.parse(memberDetailsDTO.getEmpDate()));
        existingMemberDetails.setQuitDate(LocalDateTime.parse(memberDetailsDTO.getQuitDate()));
        existingMemberDetails.setPhone(memberDetailsDTO.getPhone());
        existingMemberDetails.setAddress(memberDetailsDTO.getAddress());
        existingMemberDetails.setDeptName(memberDetailsDTO.getDeptName());
        existingMemberDetails.setTitle(memberDetailsDTO.getTitle());
        existingMemberDetails.setPosition(memberDetailsDTO.getPosition());
        existingMemberDetails.setDocSecurity(Integer.parseInt(String.valueOf(memberDetailsDTO.getDocSecurity())));
        existingMemberDetails.setDayOff(Integer.valueOf(memberDetailsDTO.getDayOff()));
        existingMemberDetails.setUsedDayOff(Double.valueOf(memberDetailsDTO.getUsedDayOff()));
        existingMemberDetails.setCompanyNum(memberDetailsDTO.getCompanyNum());
        existingMemberDetails.setMemberId(memberDetailsDTO.getMemberId());

        memberDetailsRepository.save(existingMemberDetails);
    }

    public void deleteMemberDetails(String employeeNo) {
        memberDetailsRepository.deleteById(employeeNo);
    }

    private MemberDetails convertToEntity(MemberDetailsDTO memberDetailsDTO) {
        MemberDetails memberDetails = new MemberDetails();
        memberDetails.setEmployeeNo(memberDetailsDTO.getEmployeeNo());
        memberDetails.setName(memberDetailsDTO.getName());
        memberDetails.setGender(memberDetailsDTO.getGender());
        memberDetails.setBirthDate(LocalDateTime.parse(memberDetailsDTO.getBirthDate()));
        memberDetails.setEmpDate(LocalDateTime.parse(memberDetailsDTO.getEmpDate()));
        memberDetails.setQuitDate(LocalDateTime.parse(memberDetailsDTO.getQuitDate()));
        memberDetails.setPhone(memberDetailsDTO.getPhone());
        memberDetails.setAddress(memberDetailsDTO.getAddress());
        memberDetails.setDeptName(memberDetailsDTO.getDeptName());
        memberDetails.setTitle(memberDetailsDTO.getTitle());
        memberDetails.setPosition(memberDetailsDTO.getPosition());
        memberDetails.setDocSecurity(Integer.parseInt(String.valueOf(memberDetailsDTO.getDocSecurity())));
        memberDetails.setDayOff(Integer.valueOf(memberDetailsDTO.getDayOff()));
        memberDetails.setUsedDayOff(Double.valueOf(memberDetailsDTO.getUsedDayOff()));
        memberDetails.setCompanyNum(memberDetailsDTO.getCompanyNum());
        memberDetails.setMemberId(memberDetailsDTO.getMemberId());
        return memberDetails;
    }
}
