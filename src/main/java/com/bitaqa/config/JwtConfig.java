package com.bitaqa.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtConfig {

    private String secretKey;
    private long accessTokenExpiry = 900000L;
    private long refreshTokenExpiry = 604800000L;
}
