package com.kh.kiwi.common.controller;

import com.kh.kiwi.common.service.ImageTransferService;
import com.kh.kiwi.common.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transfer")
public class ImageTransferController {

    private final ImageTransferService imageTransferService;

    @GetMapping("/download")
    public byte[] downloadImage(@RequestParam String fileKey) {
        return imageTransferService.downloadImage(fileKey);
    }

    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDto<?> handleIOException(IOException e) {
        return ResponseDto.setFailed( "파일 처리 중 오류가 발생했습니다.");
    }

    @ExceptionHandler(MultipartException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseDto<?> handleMultipartException(MultipartException e) {
        return ResponseDto.setFailed("파일 업로드 중 오류가 발생했습니다.");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDto<?> handleException(Exception e) {
        return ResponseDto.setFailed("알 수 없는 오류가 발생했습니다.");
    }
}
