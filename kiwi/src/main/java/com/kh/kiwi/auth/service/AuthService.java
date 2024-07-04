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
                return ResponseDto.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // password 중복 확인
        if(!dto.getMemberPwd().equals(dto.getConfirmPwd())) {
            return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 암호화
        String hashedPassword = bCryptPasswordEncoder.encode(dto.getMemberPwd());

        boolean isPasswordMatch = bCryptPasswordEncoder.matches(dto.getMemberPwd(), hashedPassword);

        if(!isPasswordMatch) {
            return ResponseDto.setFailed("암호화에 실패하였습니다.");
        }

        // UserEntity 생성
        Member member = new Member(dto, hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            memberRepository.save(member);
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDto.setSuccess("회원가입을 성공했습니다.\n로그인 페이지로 이동합니다.");
    }

    public ResponseDto<?> profile(String memberId){
        Member member = memberRepository.findById(memberId).orElse(null);
        if(member != null) {
            MemberDto memberDto = MemberDto.builder().name(member.getMemberNickname()).username(member.getMemberId()).filepath(member.getMemberFilepath())
                    .role(member.getMemberRole()).build();
           return ResponseDto.setSuccessData("프로필 이미지 입니다.", memberDto);
        }
        return  ResponseDto.setFailed("해당하는 프로필 정보가 없습니다.");
    }


    public ResponseDto<?> duplicate(String memberId){
        System.out.println(memberId);
        Member member = memberRepository.findById(memberId).orElse(null);
        System.out.println(member);
        if(member == null) {
            return ResponseDto.setSuccess("생성가능한 이메일 입니다.");
        }
        return  ResponseDto.setFailed("생성 불가능한 이메일입니다.");
    }

    public ResponseDto<?> member(String memberId){
        System.out.println(memberId);
        Member member = memberRepository.findById(memberId).orElse(null);
        System.out.println(member);
        if(member != null) {
            MemberDto memberDto = MemberDto.builder().name(member.getMemberNickname()).username(member.getMemberId()).filepath(member.getMemberFilepath())
                    .role(member.getMemberRole()).build();
            return ResponseDto.setSuccessData("초대 가능한 이메일 입니다.",memberDto);
        }
        return  ResponseDto.setFailed("초대 불가능한 이메일입니다.");
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
                return ResponseDto.setFailed("회원을 조회할 수 없습니다.");
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
            return ResponseDto.setFailed("오류가 발생해 저장을 실패했습니다.");
        }

        return ResponseDto.setSuccessData("성공적으로 프로필을 저장했습니다.",reuslt);
    }

    public ResponseDto<?> updatePassword(Map<String,String> data){
        try{
            Member searchMember = memberRepository.findByMemberId(data.get("memberId"));
            if(searchMember==null) return ResponseDto.setFailed("존재하지 않는 회원입니다.");
            if(bCryptPasswordEncoder.matches(data.get("currentPw"),searchMember.getPassword())) {
                searchMember.setMemberPw(bCryptPasswordEncoder.encode(bCryptPasswordEncoder.encode(data.get("newPw"))));
                memberRepository.save(searchMember);
            } else {
                return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("오류가 발생해 저장을 실패했습니다.");
        }

        return ResponseDto.setSuccess("비밀번호를 변경했습니다.");
    }

    public ResponseDto<?> deleteAccount(Map<String,String> data){
        try{
            Member searchMember = memberRepository.findByMemberId(data.get("memberId"));
            if(searchMember==null) return ResponseDto.setFailed("존재하지 않는 회원입니다.");
            if(teamRepository.existsByTeamAdminMemberId(data.get("memberId"))) return ResponseDto.setFailed("팀 소유자는 삭제할 수 없습니다.");
            if(bCryptPasswordEncoder.matches(data.get("password"),searchMember.getPassword())){
                memberRepository.deleteById(data.get("memberId"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("오류가 발생해 삭제를 실패했습니다.");
        }
        return ResponseDto.setSuccess("계정을 삭제했습니다.");
    }
}
