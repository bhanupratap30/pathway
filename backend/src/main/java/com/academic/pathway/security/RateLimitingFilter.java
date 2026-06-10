package com.academic.pathway.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    private final Map<String, TokenBucket> limiters = new ConcurrentHashMap<>();
    
    // Configurable rate limit settings
    private static final int BUCKET_CAPACITY = 30; // Max requests per window
    private static final long REFILL_DURATION_MS = 60000; // Window size: 1 minute (60,000 ms)

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest httpRequest && response instanceof HttpServletResponse httpResponse) {
            String clientIp = getClientIp(httpRequest);
            
            // Apply rate limiting only to API endpoints
            if (httpRequest.getRequestURI().startsWith("/api/")) {
                TokenBucket bucket = limiters.computeIfAbsent(clientIp, k -> new TokenBucket(BUCKET_CAPACITY, REFILL_DURATION_MS));
                
                if (!bucket.tryConsume()) {
                    log.warn("Rate limit exceeded for IP: {} on URI: {}", clientIp, httpRequest.getRequestURI());
                    sendErrorResponse(httpResponse);
                    return;
                }
            }
        }
        
        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private void sendErrorResponse(HttpServletResponse response) throws IOException {
        response.setStatus(429); // Too Many Requests
        response.setContentType("application/json");
        response.getWriter().write("{"
                + "\"status\": 429,"
                + "\"error\": \"Too Many Requests\","
                + "\"message\": \"You have exceeded the rate limit. Please wait a minute before making more requests.\""
                + "}");
    }

    @Override
    public void destroy() {
        limiters.clear();
    }

    /**
     * Inner class representing a Token Bucket for rate limiting.
     */
    private static class TokenBucket {
        private final int capacity;
        private final long refillTimeMs;
        private double tokens;
        private long lastRefillTime;

        public TokenBucket(int capacity, long refillTimeMs) {
            this.capacity = capacity;
            this.refillTimeMs = refillTimeMs;
            this.tokens = capacity;
            this.lastRefillTime = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1) {
                tokens -= 1;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsedTime = now - lastRefillTime;
            
            if (elapsedTime > 0) {
                double tokensToAdd = ((double) elapsedTime / refillTimeMs) * capacity;
                tokens = Math.min(capacity, tokens + tokensToAdd);
                lastRefillTime = now;
            }
        }
    }
}
