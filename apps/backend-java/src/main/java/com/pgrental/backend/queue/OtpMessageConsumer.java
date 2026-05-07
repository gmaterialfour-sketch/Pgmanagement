package com.pgrental.backend.queue;

import com.pgrental.backend.config.RabbitMQConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class OtpMessageConsumer {

    @RabbitListener(queues = RabbitMQConfig.OTP_QUEUE)
    public void consumeOtpMessage(Map<String, String> message) {
        String phone = message.get("phone");
        String otp = message.get("otp");
        
        log.info(">>>> [CONSUMER] Sending OTP {} to phone: {}", otp, phone);
        
        // Integration with SMS Provider (Twilio/AWS SNS) would go here
        try {
            Thread.sleep(1000); // Simulate network latency
            log.info(">>>> [CONSUMER] OTP successfully delivered to {}", phone);
        } catch (InterruptedException e) {
            log.error("Error during OTP delivery", e);
        }
    }
}
