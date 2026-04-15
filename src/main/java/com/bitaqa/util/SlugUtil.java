package com.bitaqa.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtil {

    private static final Pattern INVALID_CHARS = Pattern.compile("[^a-z0-9-]");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-{2,}");
    private static final Pattern LEADING_TRAILING_HYPHENS = Pattern.compile("^-|-$");
    private static final Pattern VALID_SLUG = Pattern.compile("^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$");

    private SlugUtil() {}

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "user";
        }
        String normalized = Normalizer.normalize(input.toLowerCase(), Normalizer.Form.NFD);
        // Remove diacritics
        normalized = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        // Replace invalid chars with hyphens
        String slug = INVALID_CHARS.matcher(normalized).replaceAll("-");
        // Collapse multiple hyphens
        slug = MULTIPLE_HYPHENS.matcher(slug).replaceAll("-");
        // Remove leading/trailing hyphens
        slug = LEADING_TRAILING_HYPHENS.matcher(slug).replaceAll("");
        // Truncate to 25 chars to leave room for suffix
        if (slug.length() > 25) {
            slug = slug.substring(0, 25);
            slug = LEADING_TRAILING_HYPHENS.matcher(slug).replaceAll("");
        }
        if (slug.isBlank()) {
            slug = "user";
        }
        return slug;
    }

    public static boolean isValidSlug(String slug) {
        if (slug == null) return false;
        return VALID_SLUG.matcher(slug).matches();
    }
}
