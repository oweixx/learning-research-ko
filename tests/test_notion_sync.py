"""게시 변환 과정에서 링크와 코드가 손상되지 않는지 검사합니다."""

import importlib.util
from pathlib import Path
import unittest

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


if __name__ == "__main__":
    unittest.main()
