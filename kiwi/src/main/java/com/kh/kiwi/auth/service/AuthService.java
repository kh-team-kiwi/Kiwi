package com.kh.kiwi.auth.service;

import com.kh.kiwi.auth.dto.*;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;
    private final S3Client s3Client;
    private final String preFilePath = "http://localhost:8080/api/transfer/download?fileKey=";

    public ResponseDto<?> signup(SignupDto dto){

        // email(id) 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if(memberRepository.existsById(dto.getMemberId())) {
                return ResponseDto.setFailed("This email has already registered.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Database connection failed.");
        }

        // password 중복 확인
        if(!dto.getMemberPwd().equals(dto.getConfirmPwd())) {
            return ResponseDto.setFailed("The passwords don't match.");
        }

        // 비밀번호 암호화
        String hashedPassword = bCryptPasswordEncoder.encode(dto.getMemberPwd());

        boolean isPasswordMatch = bCryptPasswordEncoder.matches(dto.getMemberPwd(), hashedPassword);

        if(!isPasswordMatch) {
            return ResponseDto.setFailed("Encryption failed.");
        }

        // UserEntity 생성
        Member member = new Member(dto, hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            memberRepository.save(member);
        } catch (Exception e) {
            return ResponseDto.setFailed("Database connection failed.");
        }

        return ResponseDto.setSuccess("Signed up successfully.");
    }

    public ResponseDto<?> profile(String memberId){
        Member member = memberRepository.findById(memberId).orElse(null);
        if(member != null) {
            MemberDto memberDto = MemberDto.builder().name(member.getMemberNickname()).username(member.getMemberId()).filepath(member.getMemberFilepath())
                    .role(member.getMemberRole()).build();
           return ResponseDto.setSuccessData("This user exists", memberDto);
        }
        return  ResponseDto.setFailed("This user does not exist");
    }


    public ResponseDto<?> duplicate(String memberId){
        Member member = memberRepository.findById(memberId).orElse(null);
        if(member == null) {
            return ResponseDto.setSuccess("This user exists");
        }
        return  ResponseDto.setFailed("This user does not exist");
    }

    public ResponseDto<?> existMember(String memberId){
        Member member = memberRepository.findAllByMemberIdAndMemberStatus(memberId,"ACTIVATED");
        if(member != null) {
            MemberDto memberDto = MemberDto.builder().name(member.getMemberNickname()).username(member.getMemberId()).filepath(member.getMemberFilepath())
                    .role(member.getMemberRole()).build();
            return ResponseDto.setSuccessData("This user exists",memberDto);
        }
        return  ResponseDto.setFailed("This user does not exist");
    }

    public ResponseDto<?> updateAccount(@RequestParam("profile") MultipartFile[] files,
                                        @RequestParam("memberId") String memberId,
                                        @RequestParam("memberId") String memberNickname) throws IOException {
        String fileCode = UUID.randomUUID().toString();
        String fileKey = "member/"+memberId+"/"+fileCode;
        MemberDto reuslt = null;
        try{
            Optional<Member> searchMember = memberRepository.findById(memberId);
            if (searchMember.isEmpty()) {
                return ResponseDto.setFailed("No members could be found");
            }

            if(files != null && files.length > 0) {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .build();

                s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(files[0].getInputStream(), files[0].getSize()));

                searchMember.get().setMemberFilepath(preFilePath+fileKey);
            }
            searchMember.get().setMemberNickname(memberNickname);
            reuslt = MemberDto.builder().name(searchMember.get().getMemberNickname()).role(searchMember.get().getMemberRole()).filepath(searchMember.get().getMemberFilepath()).username(searchMember.get().getMemberId()).build();

            memberRepository.save(searchMember.get());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Save failed due to an error");
        }

        return ResponseDto.setSuccessData("You have successfully saved your profile.",reuslt);
    }

    public ResponseDto<?> updatePassword(String memberId,String currentPw,String newPw){
        try{
            Member searchMember = memberRepository.findByMemberId(memberId);
            if(searchMember==null) return ResponseDto.setFailed("Member doesn't exist.");
            if(bCryptPasswordEncoder.matches(currentPw,searchMember.getPassword())) {
                searchMember.setMemberPw(bCryptPasswordEncoder.encode(newPw));
                memberRepository.save(searchMember);
            } else {
                return ResponseDto.setFailed("The passwords don't match.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Save failed due to an error");
        }

        return ResponseDto.setSuccess("Password changed successfully");
    }

    public ResponseDto<?> deleteAccount(String memberId, String password){
        try{
            Member searchMember = memberRepository.findByMemberId(memberId);
            if(searchMember==null) return ResponseDto.setFailed("This user doesn't exist.");
            if(teamRepository.existsByTeamAdminMemberId(memberId)) return ResponseDto.setFailed("Accounts of team owners cannot be deleted");
            if(bCryptPasswordEncoder.matches(password,searchMember.getPassword())){
                memberRepository.deleteById(memberId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Delete failed due to an error");
        }
        return ResponseDto.setSuccess("You have successfully deleted your account");
    }
}
