"""생성된 HTML의 내부 링크, 제목 앵커와 정적 파일 경로를 검사합니다."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1] / 'site' / '.vitepress' / 'dist'
BASE = '/learning-research-ko/'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag in {'img', 'script'} and attrs.get('src'):
            self.links.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in {'stylesheet', 'icon', 'modulepreload'}:
            self.links.append(attrs.get('href', ''))

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    pages = {}
    for file in ROOT.rglob('*.html'):
        parsed = Links()
        parsed.feed(file.read_text(encoding='utf-8'))
        pages[file.resolve()] = parsed
    if not pages:
        raise SystemExit('빌드된 사이트가 없습니다.')
    errors = set()
    for file, parsed in pages.items():
        for link in parsed.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            target = unquote(url.path)
            if target.startswith('/'):
                if not target.startswith(BASE):
                    errors.add(f'{file.name}: 배포 하위 경로 누락: {link}')
                    continue
                destination = ROOT / target[len(BASE):]
            else:
                destination = file.parent / target if target else file
            if destination.is_dir():
                destination /= 'index.html'
            destination = destination.resolve()
            if not destination.is_relative_to(ROOT.resolve()) or not destination.is_file():
                errors.add(f'{file.name}: 파일 없음: {link}')
            elif url.fragment and destination in pages and unquote(url.fragment) not in pages[destination].ids:
                errors.add(f'{file.name}: 제목 없음: {link}')
    for error in sorted(errors):
        print(error)
    if not errors:
        print(f'통과: HTML {len(pages)}개의 내부 링크·제목·정적 파일 경로')
    return bool(errors)

if __name__ == '__main__':
    raise SystemExit(main())
