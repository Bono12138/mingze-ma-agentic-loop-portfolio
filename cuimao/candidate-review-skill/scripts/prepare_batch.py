#!/usr/bin/env python3
"""Prepare a private, traceable local batch of candidate-supplied files."""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import uuid
import zipfile
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree


MAX_EXTRACT_BYTES = 30 * 1024 * 1024
SKILL_FOLDER = Path(__file__).resolve().parents[1]
TEXT_TYPES = {".txt", ".md"}
IMAGE_TYPES = {".png", ".jpg", ".jpeg", ".webp", ".heic"}


def is_within(path: Path, parent: Path) -> bool:
    return path == parent or parent in path.parents


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def extract_pdf(path: Path):
    try:
        import fitz  # type: ignore
    except ImportError:
        fitz = None
    if fitz is not None:
        with fitz.open(path) as document:
            pages = [page.get_text(sort=True) for page in document]
    elif shutil.which("pdftotext"):
        result = subprocess.run(
            ["pdftotext", "-layout", str(path), "-"],
            capture_output=True, check=True, timeout=60,
        )
        pages = result.stdout.decode("utf-8", errors="replace").split("\f")
        if pages and not pages[-1].strip():
            pages.pop()
    else:
        return "", "needs-parser", "缺少 PyMuPDF 或 pdftotext；请在 Agent 中打开 PDF。"
    text = "\n\n".join(f"--- Page {index} ---\n{page.strip()}" for index, page in enumerate(pages, 1))
    short = [str(index) for index, page in enumerate(pages, 1) if len(page.strip()) < 30]
    if short:
        return text, "needs-visual-review", f"第 {', '.join(short)} 页几乎没有可提取文字；请打开原件或在本机 OCR。"
    return text, "extracted", ""


def extract_docx(path: Path):
    with zipfile.ZipFile(path) as archive:
        info = archive.getinfo("word/document.xml")
        if info.file_size > MAX_EXTRACT_BYTES:
            return "", "needs-visual-review", "DOCX 文字部分过大，请人工打开。"
        root = ElementTree.fromstring(archive.read(info))
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs = []
    for paragraph in root.findall(".//w:p", ns):
        line = "".join(node.text or "" for node in paragraph.findall(".//w:t", ns)).strip()
        if line:
            paragraphs.append(line)
    text = "\n".join(paragraphs)
    if len(text) < 30:
        return text, "needs-visual-review", "抽取到的文字很少，请检查排版、图片和表格。"
    return text, "extracted", ""


def extract_text(path: Path):
    for encoding in ("utf-8-sig", "utf-16", "gb18030"):
        try:
            return path.read_text(encoding=encoding), "extracted", ""
        except UnicodeError:
            pass
    return "", "needs-visual-review", "文字编码无法识别，请打开原件。"


def extract(path: Path):
    suffix = path.suffix.lower()
    if path.stat().st_size > MAX_EXTRACT_BYTES:
        return "", "needs-visual-review", "文件超过 30 MB 抽取上限；原件已保留。"
    try:
        if suffix == ".pdf":
            return extract_pdf(path)
        if suffix == ".docx":
            return extract_docx(path)
        if suffix in TEXT_TYPES:
            return extract_text(path)
        if suffix in IMAGE_TYPES:
            return "", "needs-visual-review", "图片或截图：请肉眼检查，或在本机 OCR。"
        return "", "unsupported", "暂不支持自动抽取，请打开原件。"
    except (OSError, ValueError, RuntimeError, zipfile.BadZipFile, ElementTree.ParseError, subprocess.SubprocessError) as error:
        return "", "needs-visual-review", f"抽取失败：{type(error).__name__}，请打开原件。"


def groups_in(inbox: Path):
    for child in sorted(inbox.iterdir(), key=lambda p: p.name.casefold()):
        if child.is_symlink() or child.name.startswith("."):
            continue
        if child.is_dir():
            files = sorted(
                (path for path in child.rglob("*") if path.is_file() and not path.is_symlink() and not any(part.startswith(".") for part in path.relative_to(child).parts)),
                key=lambda p: str(p).casefold(),
            )
            if files:
                yield child.name, child, files
        elif child.is_file():
            yield child.stem, inbox, [child]


def main():
    parser = argparse.ArgumentParser(description="Inventory and extract a private candidate resume batch.")
    parser.add_argument("--inbox", type=Path, required=True, help="Existing local folder containing one subfolder per candidate, or one file per candidate.")
    parser.add_argument("--workspace", type=Path, required=True, help="Private local folder for run output; must be outside this public repository.")
    args = parser.parse_args()
    inbox = args.inbox.expanduser().resolve()
    workspace = args.workspace.expanduser().resolve()
    if not inbox.is_dir():
        parser.error("--inbox must be an existing directory")
    protected_roots = [SKILL_FOLDER]
    protected_roots += [parent for parent in SKILL_FOLDER.parents if (parent / ".git").exists()]
    if any(is_within(workspace, protected) for protected in protected_roots):
        parser.error("--workspace must be outside the Skill folder and any Git repository containing it")
    if is_within(workspace, inbox):
        parser.error("--workspace cannot be inside --inbox")
    run_id = datetime.now().strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:6]
    run = workspace / f"run-{run_id}"
    run.mkdir(parents=True, exist_ok=False)
    role_draft = SKILL_FOLDER / "role-profile.md"
    role_record = None
    if role_draft.is_file():
        copied_role = run / "role-profile-draft.md"
        shutil.copy2(role_draft, copied_role)
        role_record = {
            "file": copied_role.name,
            "sha256": sha256(copied_role),
            "status": "draft-unconfirmed",
        }
    records = []
    duplicate_hashes = {}
    skipped_links = []
    for number, (label, base, files) in enumerate(groups_in(inbox), 1):
        candidate_id = f"C{number:03d}"
        for source in files:
            relative = source.relative_to(base)
            destination = run / "candidates" / candidate_id / "original" / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination, follow_symlinks=False)
            digest = sha256(destination)
            duplicate_of = duplicate_hashes.get(digest, "")
            duplicate_hashes.setdefault(digest, f"{candidate_id}/{relative.as_posix()}")
            text, status, note = extract(destination)
            text_path = ""
            if text.strip():
                output = run / "candidates" / candidate_id / "text" / relative.parent / (relative.name + ".txt")
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_text(text, encoding="utf-8")
                text_path = output.relative_to(run).as_posix()
            records.append({
                "candidate_id": candidate_id,
                "inbox_group": label,
                "original": destination.relative_to(run).as_posix(),
                "sha256": digest,
                "duplicate_of": duplicate_of,
                "text": text_path,
                "extraction": status,
                "note": note,
            })
    for path in inbox.rglob("*"):
        if path.is_symlink():
            skipped_links.append(str(path.relative_to(inbox)))
    manifest = {
        "run_id": run_id,
        "created_at_local": datetime.now().isoformat(timespec="seconds"),
        "inbox": str(inbox),
        "candidate_count": len({record["candidate_id"] for record in records}),
        "role_profile": role_record,
        "records": records,
        "skipped_symlinks": skipped_links,
    }
    (run / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    duplicate_count = sum(bool(record["duplicate_of"]) for record in records)
    attention = [record for record in records if record["extraction"] != "extracted"]
    lines = [
        f"# 简历批次 {run_id}",
        "",
        f"{manifest['candidate_count']} 位候选人分组 · {len(records)} 个文件 · {duplicate_count} 个重复文件 · {len(attention)} 个文件待人工查看。",
        "",
        "候选人编号只用于整理文件，脚本没有评分或淘汰任何人。根目录里的每个文件会被当作一位候选人；同一人的多个文件请先放进同一个子文件夹，再运行下一批。",
        "",
        "| 编号 | 收件箱分组 | 文件数 | 待人工查看 |",
        "|---|---|---:|---:|",
    ]
    for candidate_id in sorted({record["candidate_id"] for record in records}):
        candidate = [record for record in records if record["candidate_id"] == candidate_id]
        lines.append(f"| {candidate_id} | {candidate[0]['inbox_group']} | {len(candidate)} | {sum(record['extraction'] != 'extracted' for record in candidate)} |")
    if attention:
        lines += ["", "## 待人工查看的文件", ""]
        lines += [f"- {record['candidate_id']}: `{record['original']}` — {record['extraction']}: {record['note']}" for record in attention]
    if skipped_links:
        lines += ["", "## 跳过的符号链接", ""]
        lines += [f"- `{path}`" for path in skipped_links]
    lines += ["", "## 下一步", "", "让 Agent 读取 manifest.json、本页和 role-profile-draft.md；先请招聘者确认岗位标准，并在本批次保存 role-profile-confirmed.md。再结合原件和抽取文字写有出处的候选人卡与 batch-overview.md。招聘者核对关键证据，决定找谁交流。", ""]
    (run / "intake-summary.md").write_text("\n".join(lines), encoding="utf-8")
    print(run)
    print(f"{manifest['candidate_count']} candidate groups, {len(records)} files, {duplicate_count} duplicates, {len(attention)} need review")
    return 0


if __name__ == "__main__":
    sys.exit(main())
