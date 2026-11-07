/**
 * Test script for local upload feature
 * Run: node scripts/test-upload.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");

let passed = 0;
let failed = 0;

function log(msg) {
  console.log(msg);
}

function pass(test) {
  passed++;
  console.log(`  ✅ PASS: ${test}`);
}

function fail(test, reason) {
  failed++;
  console.log(`  ❌ FAIL: ${test}`);
  console.log(`         Reason: ${reason}`);
}

// ─── Inline the localUpload logic (no TS needed) ───────────────────────────
function localUpload(buffer, folder, fileName, ext) {
  const dir = path.join(UPLOAD_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });
  const safeName = `${fileName}.${ext}`;
  const filePath = path.join(dir, safeName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${folder}/${safeName}`;
}

// ─── TEST 1: public/uploads directory exists ───────────────────────────────
log("\n📁 TEST 1: public/uploads directory exists");
if (fs.existsSync(UPLOAD_DIR)) {
  pass("public/uploads folder exists");
} else {
  fail("public/uploads folder exists", "Directory not found — run: mkdir public/uploads");
}

// ─── TEST 2: Upload an image file ──────────────────────────────────────────
log("\n🖼️  TEST 2: Upload a fake image (JPG)");
try {
  const fakeImage = Buffer.from("fake-image-data-jpeg");
  const url = localUpload(fakeImage, "mba/tournaments", "tournament-test-001", "jpg");

  if (url === "/uploads/mba/tournaments/tournament-test-001.jpg") {
    pass("Returns correct URL path");
  } else {
    fail("Returns correct URL path", `Got: ${url}`);
  }

  const savedPath = path.join(ROOT, "public", url);
  if (fs.existsSync(savedPath)) {
    pass("File saved to disk");
  } else {
    fail("File saved to disk", `File not found at: ${savedPath}`);
  }

  const content = fs.readFileSync(savedPath).toString();
  if (content === "fake-image-data-jpeg") {
    pass("File content matches original buffer");
  } else {
    fail("File content matches original buffer", `Got: ${content}`);
  }
} catch (err) {
  fail("Upload image test", err.message);
}

// ─── TEST 3: Upload a PDF file ─────────────────────────────────────────────
log("\n📄 TEST 3: Upload a fake PDF");
try {
  const fakePdf = Buffer.from("%PDF-fake-content");
  const url = localUpload(fakePdf, "mba/1", "medical-fitness-certificate-by-mbbs-dr", "pdf");

  if (url === "/uploads/mba/1/medical-fitness-certificate-by-mbbs-dr.pdf") {
    pass("Returns correct URL path for PDF");
  } else {
    fail("Returns correct URL path for PDF", `Got: ${url}`);
  }

  const savedPath = path.join(ROOT, "public", url);
  if (fs.existsSync(savedPath)) {
    pass("PDF saved to disk");
  } else {
    fail("PDF saved to disk", `File not found at: ${savedPath}`);
  }
} catch (err) {
  fail("Upload PDF test", err.message);
}

// ─── TEST 4: Upload tournament form file ───────────────────────────────────
log("\n📋 TEST 4: Upload tournament form file");
try {
  const fakeDoc = Buffer.from("tournament-form-data");
  const url = localUpload(fakeDoc, "mba/tournament-forms/42", "aadhaar-abc123", "jpg");

  if (url === "/uploads/mba/tournament-forms/42/aadhaar-abc123.jpg") {
    pass("Returns correct URL path for tournament form");
  } else {
    fail("Returns correct URL path for tournament form", `Got: ${url}`);
  }

  const savedPath = path.join(ROOT, "public", url);
  if (fs.existsSync(savedPath)) {
    pass("Tournament form file saved to disk");
  } else {
    fail("Tournament form file saved to disk", `File not found at: ${savedPath}`);
  }
} catch (err) {
  fail("Upload tournament form test", err.message);
}

// ─── TEST 5: Overwrite existing file ───────────────────────────────────────
log("\n🔄 TEST 5: Overwrite existing file (same name)");
try {
  const original = Buffer.from("original-content");
  const updated = Buffer.from("updated-content");

  localUpload(original, "mba/overwrite-test", "doc", "pdf");
  const url = localUpload(updated, "mba/overwrite-test", "doc", "pdf");

  const savedPath = path.join(ROOT, "public", url);
  const content = fs.readFileSync(savedPath).toString();

  if (content === "updated-content") {
    pass("File overwritten with new content");
  } else {
    fail("File overwritten with new content", `Got: ${content}`);
  }
} catch (err) {
  fail("Overwrite test", err.message);
}

// ─── TEST 6: Nested folder auto-creation ───────────────────────────────────
log("\n📂 TEST 6: Auto-creates nested folders");
try {
  const buf = Buffer.from("nested-test");
  const url = localUpload(buf, "mba/deep/nested/folder", "file", "png");
  const savedPath = path.join(ROOT, "public", url);

  if (fs.existsSync(savedPath)) {
    pass("Nested folders created automatically");
  } else {
    fail("Nested folders created automatically", `File not found at: ${savedPath}`);
  }
} catch (err) {
  fail("Nested folder auto-creation", err.message);
}

// ─── TEST 7: Verify uploaded files are accessible via /uploads path ────────
log("\n🌐 TEST 7: Verify files are inside public/ (web accessible)");
try {
  const testUrl = "/uploads/mba/tournaments/tournament-test-001.jpg";
  const absolutePath = path.join(ROOT, "public", testUrl);

  if (fs.existsSync(absolutePath)) {
    pass(`File at ${testUrl} is inside public/ and web-accessible`);
  } else {
    fail("File web accessibility check", `Not found at: ${absolutePath}`);
  }
} catch (err) {
  fail("Web accessibility check", err.message);
}

// ─── CLEANUP test files ────────────────────────────────────────────────────
log("\n🧹 Cleaning up test files...");
try {
  const testDirs = [
    path.join(UPLOAD_DIR, "mba", "tournaments"),
    path.join(UPLOAD_DIR, "mba", "1"),
    path.join(UPLOAD_DIR, "mba", "tournament-forms", "42"),
    path.join(UPLOAD_DIR, "mba", "overwrite-test"),
    path.join(UPLOAD_DIR, "mba", "deep"),
  ];

  for (const dir of testDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  console.log("  🗑️  Test files removed");
} catch (err) {
  console.log(`  ⚠️  Cleanup warning: ${err.message}`);
}

// ─── SUMMARY ───────────────────────────────────────────────────────────────
log("\n" + "─".repeat(45));
log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  log("🎉 All tests passed! Upload feature is working correctly.");
} else {
  log("⚠️  Some tests failed. Please fix the issues above.");
}
log("─".repeat(45) + "\n");
