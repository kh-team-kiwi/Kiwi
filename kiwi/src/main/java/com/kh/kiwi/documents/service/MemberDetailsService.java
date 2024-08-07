package com.kh.kiwi.documents.service;

import com.kh.kiwi.auth.dto.ResponseDto;
import com.kh.kiwi.documents.dto.MemberDetailsDTO;
import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        if (memberDetails.getEmployeeNo() == null || memberDetails.getEmployeeNo().isEmpty()) {
            memberDetails.setEmployeeNo(memberDetails.getCompanyNum() + "@" + memberDetails.getMemberId().split("@")[0]);
        }
        memberDetailsRepository.save(memberDetails);
    }

    public MemberDetailsDTO getMemberDetailsByEmployeeNo(String employeeNo) {
        Optional<MemberDetails> optionalMemberDetails = memberDetailsRepository.findById(employeeNo);
        return optionalMemberDetails.map(MemberDetailsDTO::new).orElse(null);
    }

    public MemberDetailsDTO getMemberDetailsByMemberId(String memberId) {
        List<MemberDetails> memberDetailsList = memberDetailsRepository.findByMemberId(memberId);
        return memberDetailsList.stream().findFirst().map(MemberDetailsDTO::new).orElse(null);
    }

    public void updateMemberDetails(String employeeNo, MemberDetailsDTO memberDetailsDTO) {
        System.out.println("Updating details for employeeNo: " + employeeNo);
        MemberDetails existingMemberDetails = memberDetailsRepository.findById(employeeNo)
                .orElseThrow(() -> new RuntimeException("Member details not found for employeeNo: " + employeeNo));

        existingMemberDetails.setName(memberDetailsDTO.getName());
        existingMemberDetails.setGender(memberDetailsDTO.getGender());
        existingMemberDetails.setBirthDate(LocalDate.parse(memberDetailsDTO.getBirthDate()));
        existingMemberDetails.setEmpDate(LocalDate.parse(memberDetailsDTO.getEmpDate()));
        existingMemberDetails.setQuitDate(memberDetailsDTO.getQuitDate() != null && !memberDetailsDTO.getQuitDate().isEmpty() ?
                LocalDate.parse(memberDetailsDTO.getQuitDate()) : null);
        existingMemberDetails.setPhone(memberDetailsDTO.getPhone());
        existingMemberDetails.setAddress(memberDetailsDTO.getAddress());
        existingMemberDetails.setDeptName(memberDetailsDTO.getDeptName());
        existingMemberDetails.setTitle(memberDetailsDTO.getTitle());
        existingMemberDetails.setPosition(memberDetailsDTO.getPosition());
        existingMemberDetails.setDocSecurity(memberDetailsDTO.getDocSecurity());
        existingMemberDetails.setDayOff(memberDetailsDTO.getDayOff());
        existingMemberDetails.setUsedDayOff(memberDetailsDTO.getUsedDayOff());
        existingMemberDetails.setCompanyNum(memberDetailsDTO.getCompanyNum() != null ? memberDetailsDTO.getCompanyNum() : existingMemberDetails.getCompanyNum());
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
        memberDetails.setBirthDate(LocalDate.parse(memberDetailsDTO.getBirthDate()));
        memberDetails.setEmpDate(LocalDate.parse(memberDetailsDTO.getEmpDate()));
        memberDetails.setQuitDate(memberDetailsDTO.getQuitDate() != null && !memberDetailsDTO.getQuitDate().isEmpty() ?
                LocalDate.parse(memberDetailsDTO.getQuitDate()) : null);
        memberDetails.setPhone(memberDetailsDTO.getPhone());
        memberDetails.setAddress(memberDetailsDTO.getAddress());
        memberDetails.setDeptName(memberDetailsDTO.getDeptName());
        memberDetails.setTitle(memberDetailsDTO.getTitle());
        memberDetails.setPosition(memberDetailsDTO.getPosition());
        memberDetails.setDocSecurity(memberDetailsDTO.getDocSecurity());
        memberDetails.setDayOff(memberDetailsDTO.getDayOff());
        memberDetails.setUsedDayOff(memberDetailsDTO.getUsedDayOff());
        memberDetails.setCompanyNum(memberDetailsDTO.getCompanyNum());
        memberDetails.setMemberId(memberDetailsDTO.getMemberId());

        return memberDetails;
    }

    public ResponseDto<?> memberDetails(String employeeNo){
        System.out.println(employeeNo);
        MemberDetails memberDetails = memberDetailsRepository.findByEmployeeNo(employeeNo);
        System.out.println(memberDetails);
        if(memberDetails != null) {
            MemberDetailsDTO memberDetailsDTO = MemberDetailsDTO.builder().companyNum(memberDetails.getCompanyNum()).employeeNo(memberDetails.getEmployeeNo()).build();
            return ResponseDto.setSuccessData("사원정보 불러오기를 성공하였습니다.", memberDetailsDTO);
        }
        return ResponseDto.setFailed("사원정보 불러오기를 실패하였습니다.");
    }
    public List<MemberDetailsDTO> getMembersByTeamId(String teamId) {
        List<MemberDetails> memberDetailsList = memberDetailsRepository.findByCompanyNum(teamId);
        return memberDetailsList.stream()
                .map(MemberDetailsDTO::new)
                .collect(Collectors.toList());
    }
}
