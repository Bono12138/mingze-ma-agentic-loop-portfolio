# 给猫姐的简历整理 Skill

把收到的简历集中放好，它会先建立一份可追溯的清单：哪几份是重复文件、哪些 PDF 扫描页要肉眼看、每位候选人的原件和文字在哪里。Agent 再按猫姐确认的岗位要求，做一页候选人卡和一张整批总览。猫姐先看有出处的重点，再决定找谁聊。

这是马铭泽主动做的演示，岗位标准需要猫姐确认。Skill 不替你联系候选人或淘汰人，也不把简历上传到外部服务。

## 5 分钟试用

需要本机 Python 3.10+。PDF 文字抽取优先使用 PyMuPDF（`pip install pymupdf`），有 `pdftotext` 也能用；DOCX、TXT、Markdown 只用 Python 标准库。若没有 PDF 解析工具，原件仍会入库，清单会提醒人工打开。扫描版需要人工查看或在本机做 OCR。

1. 下载 [Skill ZIP](../candidate-review-skill.zip)，解压，将 `candidate-review-skill` 文件夹交给支持 `SKILL.md` 的 Agent。
2. 在自己的电脑建两个**不在公开仓库中**的文件夹：`简历收件箱` 和 `简历工作区`。每位候选人一个子文件夹；简历和其主动提供的作品链接放在一起。例如：

```text
简历收件箱/
  候选人A/
    简历.pdf
    links.txt
  候选人B/
    简历.docx
```

只有一份文件一个人时，可以直接把文件放在收件箱根目录。若同一个人有多个文件，请用子文件夹，避免被分成几位候选人。

3. 在 Skill 文件夹运行：

```text
python scripts/prepare_batch.py --inbox "你的/简历收件箱" --workspace "你的/简历工作区"
```

命令会打印新批次路径，例如 `简历工作区/run-20260923-203000-a1b2c3`。以后收到新简历，可以整理好收件箱再运行；旧批次不会被覆盖。

4. 对 Agent 说：

> 使用 candidate-review-skill。请打开这次批次的 intake-summary.md、manifest.json 和 role-profile-draft.md，先告诉我哪些文件重复、哪些需要我肉眼看。再向我确认岗位必须项和加分项，把确认版存成 role-profile-confirmed.md；之后读原件与抽取文字，为每位候选人写有页码/作品链接的候选人卡，最后做 batch-overview.md。请把个人自述、公开作品和待核实能力分开；不要自动淘汰或联系任何人。

## 你会拿到什么

- `manifest.json`：每个文件的候选人编号、原件副本路径、文字路径、哈希、重复关系和提取状态。
- `intake-summary.md`：这一批有多少候选人、重复文件及需要人工查看的文件。
- `role-profile-draft.md`：岗位草案的私人副本，供猫姐修改确认；尚未确认时不能当作筛选标准。
- Agent 在私人批次目录写的候选人卡与 `batch-overview.md`：30 秒摘要、可直接打开的证据、岗位对应情况、值得问的问题和下一步。卡片格式见 [模板](candidate-card-template.md)。

脚本不会判断两个不同文件是否属于同一人，也不会检查公开账号是不是本人；这两件事要看候选人提供的资料或向候选人确认。PDF 文字提取可能漏掉图片、表格和复杂排版，重要结论必须回到原件核对。

## 设计参考

- [ResumeHQ / Resume-Builder](https://github.com/jananthan30/Resume-Builder)：岗位要求和简历出处的对应方式。
- [boss-hr-agent-toolkit](https://github.com/1xiaoyueryuer/boss-hr-agent-toolkit)：按批次保留运行记录。
- [Iteration Layer Skills](https://github.com/iterationlayer/skills)：结构化抽取与来源记录。
- [rsc-harness](https://github.com/ericrisco/rsc-harness)：先定岗位能力，再使用可比较的问题和任务。

这些是思路参考，本 Skill 未打包它们的代码或服务。
