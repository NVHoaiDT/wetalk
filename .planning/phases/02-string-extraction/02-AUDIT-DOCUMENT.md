# WeTalk i18n Audit Document — Phase 2

**Prepared for:** Vietnamese Translator  
**Project:** WeTalk (React social media platform)  
**Scope:** UI strings only (buttons, labels, errors, modals, help text)  
**Total Strings:** 186 keys across 13 JSON files  
**Date Prepared:** 2026-03-29  
**Audit Status:** Complete — Ready for Phase 5 Translation

---

## Project Context

WeTalk is a developer-focused social media platform. The translation should maintain:

- **Conversational tone:** Friendly, approachable, not corporate
- **Authentic voice:** Genuine community feel, inclusive language
- **Clarity-first:** Simple Vietnamese, avoid unnecessary jargon unless context demands
- **User-respectful:** No condescension, empowering language
- **Technical precision:** Maintain technical terms when appropriate (e.g., "Karma", "Post")

**Target Audience:** Developers and tech enthusiasts in Vietnam (ages 18-45)

---

## Naming Convention & Structure

All translation keys follow a consistent pattern:

```
namespace.elementType.property
```

**Examples:**
- `post.action.create` → Button text "Create Post"
- `common.button.confirm` → Button text "Confirm"
- `message.error.failedToSend` → Error message "Failed to send message"
- `auth.modal.resetPassword.title` → Modal heading "Reset Password"
- `community.select.status.approved` → Dropdown option "Approved"

### Element Types (Consistent Across All Namespaces)

| Type | Purpose | Example | Tone |
|------|---------|---------|------|
| **action** | Verbs and actionable labels | "Create", "Edit", "Delete", "Share" | Imperative, positive |
| **label** | Static labels and headings | "Post Title", "Author", "Created" | Declarative, neutral |
| **placeholder** | Form field hints | "Enter your name", "example.com" | Helpful, suggestive |
| **error** | Failure and error messages | "Failed to create", "Network error" | Clear, supportive |
| **validation** | Inline validation feedback | "Required", "Invalid email", "Too weak" | Specific, helpful |
| **modal** | Dialog/popup titles and descriptions | "Delete Post?", "Are you sure?" | Clear, direct |
| **help** | Tooltips and guidance text | "Choose who can see this" | Explanatory, brief |
| **select** | Dropdown/option choices | "All Members", "Approved", "Pending" | Concise, consistent |

---

## File Structure Overview

### 13 JSON Files Organized by Feature

**1 Common File + 12 Feature Files = 186 Total Keys**

```
public/locales/en/
├── common.json (42 keys) — Shared across all features
├── auth.json (18 keys) — Authentication flows  
├── post.json (26 keys) — Post creation/editing
├── message.json (13 keys) — Direct messaging
├── community.json (24 keys) — Community management
├── dashboard.json (7 keys) — Feed and dashboard
├── notifications.json (8 keys) — Notifications
├── search.json (6 keys) — Search functionality
├── profiles.json (10 keys) — User profiles
├── users.json (8 keys) — User management
├── chatbot.json (6 keys) — AI chatbot
├── settings.json (8 keys) — Settings pages
└── postComments.json (10 keys) — Comments
```

### Common.json (42 Shared Keys)

Used across multiple features:

```json
button: confirm, cancel, save, delete, close, back, next, submit, edit, view, create, add, send, reply
label: loading, noResults, emptyState
error: networkError, unauthorized, notFound, serverError, unknown
validation: required, emailInvalid, passwordTooWeak, passwordMismatch
pagination: previous, next, page, of
```

---

## Terminology & Vietnamese Equivalents

### Platform-Specific Terms (Must be Consistent Across All Files)

| English | Vietnamese | Context | Alternative | Notes |
|---------|------------|---------|-------------|-------|
| **Post** | Bài đăng | User-created content (not 1-on-1 message) | không phải "tin nhắn" | Most important term |
| **Community** | Cộng đồng | Group/forum | không phải "nhóm" | Formal, established |
| **Message** | Tin nhắn | 1-on-1 private conversation | không phải "bài đăng" | Direct, personal |
| **Share** | Chia sẻ | Distribute existing content | không phải "phân phối" | Natural, friendly |
| **Like/Reaction** | Thích | Appreciation gesture | không phải "yêu thích" | Concise, familiar |
| **Comment** | Bình luận | Response to post | không phải "ghi chú" | Standard term |
| **Follow** | Theo dõi | Subscribe to user updates | không phải "quFollow" | Standard term |
| **Notification** | Thông báo | Alert to user | không phải "cảnh báo" | Standard term |
| **Profile** | Hồ sơ | User identity/history | không phải "trang cá nhân" | Professional, clear |
| **Karma** | Karma | Reputation score | Giữ nguyên (English) | Leave as-is for tech audience |
| **Moderator** | Quản lý viên | Community admin | không phải "giám sát viên" | Clear role |
| **Admin** | Admin | System administrator | Để nguyên (English) | Technical term |

### Common UI Terms (Consistency Examples)

| Context | Vietnamese | Why |
|---------|------------|-----|
| Error on network | "Lỗi mạng" | Direct, recognizable |
| User not found | "Không tìm thấy người dùng" | Clear and specific |
| Permission denied | "Bạn không có quyền truy cập" | Respectful, not abrupt |
| Loading state | "Đang tải..." | Friendly, abbreviated |
| Empty state | "Chưa có gì ở đây" | Natural Vietnamese |

---

## Tone Examples

### Button Labels (Positive, Actionable)

| English | Vietnamese | Notes |
|---------|------------|-------|
| "Confirm" | "Xác nhận" | Direct, professional |
| "Create Post" | "Tạo bài đăng" | Action-oriented |
| "Share" | "Chia sẻ" | Positive, encouraging |
| "Delete" | "Xóa" | Concise, unavoidable |

### Error Messages (Clear, Supportive, Not Blamed)

| English | Vietnamese | Tone |
|---------|------------|------|
| "Invalid email address" | "Địa chỉ email không hợp lệ" | Specific, helpful |
| "Password must be at least 8 characters" | "Mật khẩu phải có ít nhất 8 ký tự" | Clear requirement |
| "Failed to create post" | "Không thể tạo bài đăng. Vui lòng thử lại." | Supportive, not blamed |
| "This action cannot be undone" | "Hành động này không thể hoàn tác." | Clear consequence |

### Validation Feedback (Specific, Helpful)

| English | Vietnamese | Guidance |
|---------|------------|----------|
| "This field is required" | "Trường này là bắt buộc" | Specific, not vague |
| "Email already registered" | "Email này đã được đăng ký" | Clear conflict |
| "Username is taken" | "Tên người dùng này đã được sử dụng" | Direct, helpful |

---

## Text Length Considerations

**Vietnamese is typically 20-30% longer than English.**

Flexible Tailwind widths accommodate expansion. However, be mindful of:
- Very long button text (30+ chars) → may overlap in tight layouts
- Form field placeholders → should remain suggestive, not prescriptive
- Modal titles → keep brief (ideally <15 words in Vietnamese)

### Expansion Examples

| English (Chars) | Vietnamese (Chars) | Expansion |
|-----------------|-------------------|-----------|
| "Delete Post?" (12) | "Xóa bài đăng?" (13) | +8% |
| "Confirm" (7) | "Xác nhận" (8) | +14% |
| "Failed to create post. Please try again." (40) | "Không thể tạo bài đăng. Vui lòng thử lại." (44) | +10% |
| "Network error. Please try again." (32) | "Lỗi mạng. Vui lòng thử lại." (32) | 0% |
| "Are you sure you want to delete this?" (39) | "Bạn có chắc muốn xóa mục này không?" (37) | -5% |

**Guideline:** If English string exceeds 40 characters, review Vietnamese version for layout impact in tight spaces.

---

## Per-Namespace Glossary & Translation Direction

### auth.json
**Context:** User sign-up, login, password recovery  
**Key terms:** email, username, password, registration, authentication  
**Tone:** Professional but welcoming
**Key translations:**
- email → email (keep)
- username → tên người dùng
- password → mật khẩu
- "Invalid credentials" → "Thông tin đăng nhập không chính xác"

### post.json
**Context:** Create, edit, delete, share posts  
**Key terms:** post, title, content, media, publish, draft  
**Tone:** Encouraging, action-oriented
**Key translations:**
- Create Post → Tạo bài đăng
- Edit → Chỉnh sửa
- Publish → Xuất bản
- Draft → Nháp

### message.json
**Context:** Direct messaging between users  
**Key terms:** message, conversation, send, reply  
**Tone:** Natural, conversational
**Key translations:**
- Type a message → Nhập tin nhắn...
- Failed to send → Không thể gửi tin nhắn
- Mark as read → Đánh dấu đã đọc

### community.json
**Context:** Community management, moderation, roles  
**Key terms:** community, member, moderator, rules, approval  
**Tone:** Formal but inclusive
**Key translations:**
- Community Settings → Cài đặt cộng đồng
- Set Moderator Role → Đặt vai trò quản lý viên
- Approved → Được phê duyệt

### dashboard.json
**Context:** Feed, trending, personalized content  
**Tone:** Inviting, exploratory
**Key translations:**
- Your Feed → Bảng tin của bạn
- Trending → Xu hướng
- Recommendations → Gợi ý danh mục

### Other Namespaces (notifications, search, profiles, users, chatbot, settings, postComments)
Similar philosophy: match English tone, maintain consistency with main terms, adapt for context.

---

## Completeness Checklist

Before submitting Vietnamese translations, verify:

- [ ] All 186 keys have Vietnamese translations (no English fallback text)
- [ ] Terminology is consistent across files:
  - [ ] "Bài đăng" always for "Post"
  - [ ] "Tin nhắn" always for "Message"
  - [ ] "Cộng đồng" always for "Community"
  - [ ] "Thích" always for "Like"
- [ ] Tone matches intent:
  - [ ] Action verbs are positive (tạo, chia sẻ, chỉnh sửa)
  - [ ] Error messages are supportive (không lỗi người dùng)
  - [ ] Validation is specific (không mơ hồ)
- [ ] No hardcoded English terms remain (except technical terms like "Karma", "Admin")
- [ ] Text length expansion accounted for (long strings kept reasonable)
- [ ] Placeholder text remains suggestive ("Nhập...", "VD: ...")
- [ ] Common.json core strings use standard Vietnamese terms
- [ ] Feature-specific terminology matches platform vocabulary
- [ ] Date/time formats appropriate for Vietnamese users
- [ ] No Vietnamese spelling errors or typos
- [ ] Punctuation follows Vietnamese conventions (không dấu hai chấm thừa)

---

## File Organization for Translator

**Directory structure for translations:**

```
public/locales/vi/
├── common.json
├── auth.json
├── post.json
├── message.json
├── community.json
├── dashboard.json
├── notifications.json
├── search.json
├── profiles.json
├── users.json
├── chatbot.json
├── settings.json
└── postComments.json
```

Each file should mirror the English version's structure exactly — same keys, same nesting, only Vietnamese values.

---

## Translation Process

1. **Review this document** — Understand WeTalk's tone and terminology
2. **Translate common.json first** — Establish core vocabulary consistency
3. **Translate feature files** — Use common.json as reference for shared terms
4. **Verification:** Check each file for:
   - Valid JSON (no syntax errors)
   - All keys translated (no English values)
   - Terminology consistency across files
5. **Final review** — Read through as a user would encounter the UI
6. **Submission** — Deliver all 13 Vietnamese files in `public/locales/vi/`

---

## Questions During Translation?

If you encounter:

- **Ambiguous English string:** Flag it with a note (e.g., "Does 'Share' mean share to other users or share to external social media?")
- **Cultural concern:** Discuss with product team (e.g., "Is 'Karma' acceptable in Vietnamese context, or should it be 'Điểm danh tiếng'?")
- **Missing context:** Reference the file name and element type (e.g., "post.error.failedToCreate lacks context about why it might fail")
- **Technical term:** Keep as English if it's platform vocabulary (Karma, Admin, etc.)

---

## Success Criteria for Phase 5 (Vietnamese Translation)

The translation is complete when:

- [x] All 186 keys have Vietnamese translations
- [x] No English strings appear in the output
- [x] Terminology consistency verified across files
- [x] Tone matches WeTalk's conversational brand
- [x] Text lengths are reasonable (no overflow in tight UI spaces)
- [x] All JSON files are valid and syntactically correct
- [x] Phase 5 completion can proceed to Phase 6 testing

---

## Next Steps in Milestone

| Phase | Status | Purpose |
|-------|--------|---------|
| Phase 1 | ✅ Complete | i18next infrastructure |
| Phase 2 | ✅ Complete | String extraction & audit |
| Phase 3 | ⏳ Next | Component integration with useTranslation() |
| Phase 4 | ⏳ Future | Language switching UI |
| **Phase 5** | **🔄 READY FOR TRANSLATOR** | **Vietnamese translation (using this document)** |
| Phase 6 | ⏳ Future | Testing & validation |
| Phase 7 | ⏳ Future | Documentation & handoff |

---

**Document Version:** 1.0  
**Created:** 2026-03-29  
**Status:** ✅ Ready for translator submission  
**Confidence:** HIGH — Comprehensive, clear, brand-consistent guidance provided
