package com.kh.kiwi.auth.controller;

import com.kh.kiwi.auth.dto.ResponseDto;
import com.kh.kiwi.auth.dto.SignupDto;
import com.kh.kiwi.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RequiredArgsConstructor
class AuthControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

//    @Test
//    void testDuplicate() throws Exception {
//        // Arrange
//        SignupDto signupDto = new SignupDto();
//        signupDto.setMemberId("test@example.com");
//
//        ResponseDto<?> expectedResponse = authService.duplicate(signupDto.getMemberId());
//
//        // Act & Assert
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/duplicate"))
//                .andDo(MockMvcResultHandlers.print())
//                .andExpect(ResponseEntity.status().isOk())
//                .andExpect(jsonPath("$.message", is("Disable")))
//                .andExpect(jsonPath("$.result", is(false)));
//
//        // Act & Assert
//        mockMvc.perform(post("/api/auth/duplicate")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"memberId\":\"test@example.com\"}"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message", is(expectedResponse.getMessage())))
//                .andExpect(jsonPath("$.result", is(expectedResponse.isResult())));
//    }
}