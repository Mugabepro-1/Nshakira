package org.mupro.nshakira.auth;

import org.mupro.nshakira.user.Role;

public record RegisterRequest(String name, String email, String password, Role role) {}
