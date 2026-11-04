"""게시 변환 과정에서 링크와 코드가 손상되지 않는지 검사합니다."""

import importlib.util
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("notion_sync", Path(__file__).resolve().parents[1] / "scripts/notion_sync.py")
sync = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sync)


class RenderTests(unittest.TestCase):
    def test_local_page_uses_native_mention(self):
        title, body = sync.render("docs/notion/a.md", "# 제목\n\n[목록](./README.md)", {"docs/notion/README.md": {"id": "1234-5678"}})
        self.assertEqual(title, "제목")
        self.assertIn('<mention url="https://app.notion.com/p/12345678" />', body)
        self.assertNotIn("# 제목", body)

    def test_heading_link_stays_on_github(self):
        _, body = sync.render("docs/notion/a.md", "# 제목\n\n[절](./b.md#한국어-제목)", {"docs/notion/b.md": {"id": "abc"}})
        self.assertIn("docs/notion/b.md#%ED%95%9C%EA%B5%AD%EC%96%B4-%EC%A0%9C%EB%AA%A9", body)
        self.assertNotIn("<mention", body)

    def test_external_links_and_code_examples_are_preserved(self):
        fence = chr(96) * 3
        example = fence + "md\n[예시](./missing.md)\n" + fence
        _, body = sync.render("README.md", "# 제목\n\n[외부](https://example.org/a?q=1)\n\n" + example, {})
        self.assertIn("[외부](https://example.org/a?q=1)", body)
        self.assertIn(example, body)

    def test_unmapped_relative_link_has_absolute_fallback(self):
        _, body = sync.render("docs/notion/a.md", "# 제목\n\n[안내](../../TRANSLATION.md)", {})
        self.assertIn(sync.REPO + "TRANSLATION.md", body)
        self.assertNotIn("](../../", body)

    def test_repo_escape_is_rejected(self):
        with self.assertRaises(ValueError):
            sync.render("README.md", "# 제목\n\n[밖](../private.md)", {})

    def test_source_digest_detects_text_change(self):
        self.assertNotEqual(sync.digest("첫 번째 내용\n"), sync.digest("바뀐 내용\n"))


class PublicationTests(unittest.TestCase):
    def test_external_translations_and_guides_are_included_once(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "translation").mkdir()
            (root / "translation/notion-source-manifest.json").write_text(json.dumps({
                "direct_pages": [{"translation_path": "docs/notion/a.md"}],
                "linked_pages": [{"translation_path": None}],
            }), encoding="utf-8")
            (root / "translation/external-sources.json").write_text(json.dumps({
                "sources": [
                    {"translation_path": "docs/external/slides.md"},
                    {"reading_guide_path": "docs/external/guide.md"},
                    {"translation_path": "docs/notion/a.md", "reading_guide_path": "docs/external/guide.md"},
                ],
            }), encoding="utf-8")
            with patch.object(sync, "ROOT", root):
                paths = sync.document_paths()
            for path in ("docs/notion/a.md", "docs/external/slides.md", "docs/external/guide.md"):
                self.assertEqual(paths.count(path), 1)

    def test_edit_after_publication_requires_another_publish(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            document = root / "document.md"
            document.write_text("게시한 내용\n", encoding="utf-8")
            receipts = root / "publication.json"
            receipts.write_text(json.dumps({"documents": [{
                "path": "document.md", "sha256": sync.digest("게시한 내용\n"),
                "published_on": "2026-11-04",
            }]}), encoding="utf-8")
            with patch.object(sync, "ROOT", root), patch.object(sync, "RECEIPTS", receipts), patch.object(sync, "document_paths", return_value=["document.md"]):
                self.assertEqual(sync.check_receipts(), [])
                document.write_text("아직 게시하지 않은 수정\n", encoding="utf-8")
                self.assertEqual(len(sync.check_receipts()), 1)
                self.assertIn("document.md", sync.check_receipts()[0])


if __name__ == "__main__":
    unittest.main()
