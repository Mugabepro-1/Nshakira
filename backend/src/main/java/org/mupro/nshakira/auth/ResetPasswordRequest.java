package org.mupro.nshakira.auth;

public record ResetPasswordRequest(String email, String newPassword, String token) {}
