package com.pgrental.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String OTP_QUEUE = "otp_queue";

    @Bean
    public Queue otpQueue() {
        return new Queue(OTP_QUEUE, false);
    }
}
