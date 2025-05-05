package org.mupro.nshakira.auth;

public record OtpVerificationRequest(String email, String otp) {}
