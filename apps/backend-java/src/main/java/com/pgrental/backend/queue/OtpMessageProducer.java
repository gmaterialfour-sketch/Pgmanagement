package com.pgrental.backend.queue;

import com.pgrental.backend.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpMessageProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendOtpMessage(String phone, String otp) {
        log.info("Queueing OTP for phone: {}", phone);
        rabbitTemplate.convertAndSend(RabbitMQConfig.OTP_QUEUE, Map.of("phone", phone, "otp", otp));
    }
}
