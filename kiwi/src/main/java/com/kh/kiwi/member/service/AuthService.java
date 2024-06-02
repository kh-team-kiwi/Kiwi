package com.kh.kiwi.member.service;

import com.kh.kiwi.member.dto.*;
import com.kh.kiwi.member.entity.Member;
import com.kh.kiwi.member.repository.MemberRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional()
public class AuthService {

    private final MemberRepository memberRepository;
    private final TokenHelper tokenHelper;

    public ResponseDto<?> signUp(SignUpDto dto){
        String id = dto.getMemberId();
        String password = dto.getMemberPw();
        String confirmPassword = dto.getConfirmPw();

        // email(id) 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if(memberRepository.existsById(id)) {

                return ResponseDto.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // password 중복 확인
        if(!password.equals(confirmPassword)) {
            return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // UserEntity 생성
        Member member = new Member(dto);

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if(!isPasswordMatch) {
            return ResponseDto.setFailed("암호화에 실패하였습니다.");
        }
        member.setMemberPw(hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            memberRepository.save(member);
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDto.setSuccess("회원 생성에 성공했습니다.");
    }

    @Transactional
    public ResponseDto<LoginResponseDto> login(LoginDto dto) {
        String id = dto.getId();
        String password = dto.getPassword();
        Member member = null;

        try {
            // 이메일로 사용자 정보 가져오기
            member = memberRepository.findById(id).orElse(null);
            if(member == null) {
                return ResponseDto.setFailed("입력하신 이메일로 등록된 계정이 존재하지 않습니다.");
            }

            // 사용자가 입력한 비밀번호를 BCryptPasswordEncoder를 사용하여 암호화
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = member.getMemberPw();

            // 저장된 암호화된 비밀번호와 입력된 암호화된 비밀번호 비교
            if(!passwordEncoder.matches(password, encodedPassword)) {
                return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
            }

            if(!member.getMemberStatus().equals("1")) {
                return ResponseDto.setFailed("비활성된 계정입니다. 관리자에게 문의하세요.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        member.setMemberPw("");

        TokenHelper.PrivateClaims privateClaims = TokenHelper.createPrivateClaims(member.getMemberId(), member.getMemberRole());
        String accessToken = tokenHelper.createAccessToken(privateClaims);
        String refreshToken = tokenHelper.createRefreshToken(privateClaims, id);

        LoginResponseDto loginResponseDto = new LoginResponseDto(accessToken, refreshToken, member);

        return ResponseDto.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
    }

    public ReissueAccessTokenDTO reissueAccessToken(String rToken, String email) throws Exception{
        TokenHelper.PrivateClaims privateClaims = tokenHelper.parseRefreshToken(rToken, email).orElseThrow();
        String accessToken = tokenHelper.createAccessToken(privateClaims);
        String refreshToken = tokenHelper.createRefreshToken(privateClaims, email); //refreshToken도 재발급
        return new ReissueAccessTokenDTO(accessToken, refreshToken);
    }

}
