package com.kh.kiwi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
//@EnableScheduling
//@EnableAspectJAutoProxy
//@EnableAsync
//@PropertySource("classpath:/")
public class KiwiApplication {

    public static void main(String[] args) {
        SpringApplication.run(KiwiApplication.class, args);
    }
}
